import React, { useState } from 'react';
import { CartItem, Neighborhood, Order, AppSettings } from '../types';
import { Trash2, ArrowLeft, ArrowRight, ChevronRight, CreditCard, Banknote, Landmark, Smartphone, Loader2, MapPin, AlertCircle, ShoppingBag, Truck, Check } from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (index: number) => void;
  settings: AppSettings;
  onSubmit: (orderData: Partial<Order>) => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, items, onRemove, settings, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // <-- ESTADO NOVO
  const [showManualButton, setShowManualButton] = useState(false); // Estado para o botão de segurança
  const [deliveryMessage, setDeliveryMessage] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  
  const [addressData, setAddressData] = useState({
    cep: '',
    street: '',
    number: '',
    complement: '',
    bairro: '',
    city: ''
  });
  
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    neighborhood: { name: 'Entrega', fee: settings.defaultDeliveryFee },
    paymentMethod: 'PIX',
    changeFor: '',
    orderType: 'Entrega',
    observation: '' // <-- ADICIONE ESTA LINHA AQUI! 
  });

  const subtotal = items.reduce((acc, i) => acc + i.totalPrice, 0);
  
  const deliveryFee = formData.orderType === 'Retirada' ? 0 : formData.neighborhood.fee;
  const total = subtotal + deliveryFee;

  // FUNÇÃO DE MÁSCARA PARA TELEFONE
  const formatPhone = (value: string) => {
    if (!value) return "";
    const numbers = value.replace(/\D/g, ""); 
    
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };
const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Seu navegador não suporta localização.");
      return;
    }

    setLoadingLocation(true);

    // Configurações para forçar a precisão máxima do aparelho
    const geoOptions = {
      enableHighAccuracy: true, // O SEGREDO: Força o GPS de satélite do celular
      timeout: 10000,           // Espera até 10 segundos pela melhor resposta
      maximumAge: 0             // Não aceita localização "velha" do cache
    };

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        
        // Usando o serviço gratuito do OpenStreetMap
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
        );
        const data = await response.json();
        
        if (data.address) {
          // Tenta pegar o CEP (postcode)
          const cepEncontrado = data.address.postcode ? data.address.postcode.replace(/\D/g, '') : '';
          
          // Se achou o CEP, já preenche a rua e o bairro para o cliente não ter dúvida
          if (cepEncontrado) {
            setAddressData(prev => ({
              ...prev,
              street: data.address.road || data.address.pedestrian || prev.street,
              bairro: data.address.suburb || data.address.neighbourhood || prev.bairro,
              city: data.address.city || data.address.town || prev.city
            }));
            
            // Chama sua lógica de CEP para validar as taxas da Barcellos
            handleCepLookup(cepEncontrado);
          } else {
            alert("CEP não identificado nesta posição. Por favor, digite manualmente.");
          }
        }
      } catch (error) {
        alert("Erro ao identificar endereço. Tente o CEP manualmente.");
      } finally {
        setLoadingLocation(false);
      }
    }, (error) => {
      // Mensagens de erro amigáveis para o cliente
      if (error.code === 1) alert("Por favor, autorize a localização no seu navegador.");
      else alert("Não conseguimos captar seu sinal de GPS. Digite o CEP.");
      setLoadingLocation(false);
    }, geoOptions); // <--- Passando as opções de alta precisão aqui
  };
  const handleCepLookup = async (cep: string) => {
    const cleanedCep = cep.replace(/\D/g, '');
    setAddressData(prev => ({ ...prev, cep: cleanedCep }));
    setDeliveryMessage(null);
    setIsBlocked(false);

    if (cleanedCep.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          const bairroUpper = (data.bairro || '').toUpperCase();
          const cityUpper = (data.localidade || '').toUpperCase();
          const allowedCity = (settings.allowedCity || '').toUpperCase();
          const blockedList = (settings.blockedNeighborhoods || '').split(',').map(n => n.trim().toUpperCase());

          setAddressData(prev => ({
            ...prev,
            street: data.logradouro,
            bairro: data.bairro,
            city: data.localidade
          }));

          if (cityUpper !== allowedCity) {
            setDeliveryMessage(`Ops! Atualmente entregamos apenas em ${settings.allowedCity}.`);
            setIsBlocked(true);
            setLoadingCep(false);
            return;
          }

          if (blockedList.some(b => b === bairroUpper && b !== "")) {
            setDeliveryMessage("Desculpe, não realizamos entregas neste bairro por questões de logística ou segurança.");
            setIsBlocked(true);
            setLoadingCep(false);
            return;
          }

          // --- BUSCA O BAIRRO NAS CONFIGURAÇÕES ---
          const match = settings.neighborhoods.find(n => n.name.toUpperCase() === bairroUpper);
          
          if (match) {
            // VERIFICA SE O BAIRRO ESTÁ DESATIVADO NO PAINEL
            if ((match as any).active === false) {
              setDeliveryMessage("Ainda não estamos entregando no seu bairro, você pode retirar no balcão. Agradeço a compreensão.");
              setIsBlocked(true);
              setFormData(prev => ({ ...prev, neighborhood: match }));
            } else {
              setFormData(prev => ({ ...prev, neighborhood: match }));
              if (match.fee === 0) setDeliveryMessage("Parabéns! Você tem ENTREGA GRÁTIS neste bairro.");
              setIsBlocked(false);
            }
          } else {
            setFormData(prev => ({ 
              ...prev, 
              neighborhood: { name: data.bairro || 'Geral', fee: settings.defaultDeliveryFee } 
            }));
            setIsBlocked(false);
          }
        }
      } catch (e) {
        console.error("CEP lookup failed", e);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleNameChange = (val: string) => {
    setFormData({...formData, customerName: val.toUpperCase()});
  };

  const fullAddress = formData.orderType === 'Retirada' 
    ? 'RETIRADA NO BALCÃO' 
    : `${addressData.street}, ${addressData.number}${addressData.complement ? ` - ${addressData.complement}` : ''}, ${addressData.bairro}, ${addressData.city} (CEP: ${addressData.cep})`;

  const handleNext = () => {
    if (step === 1 && items.length === 0) return;
    if (step === 2) {
      const isAddressOk = formData.orderType === 'Retirada' || (addressData.cep && addressData.number);
      
      if (!formData.customerName || !formData.phone || !isAddressOk) {
        alert('Preencha os campos obrigatórios para prosseguir.');
        return;
      }
      if (formData.orderType === 'Entrega' && isBlocked) {
        alert('Não podemos prosseguir com a entrega para este endereço. Selecione "No Balcão" para retirar seu pedido.');
        return;
      }
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const handleFinalize = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // 1. Ativa a tela de sucesso NO MODAL
      setShowSuccess(true);

      // --- AJUSTE CIRÚRGICO: Inicia o cronômetro de segurança ---
      setTimeout(() => {
        setShowManualButton(true);
      }, 4000); 
      // -------------------------------------------------------

      // 2. Envia os dados para o App.tsx
      await onSubmit({
        ...formData,
        address: fullAddress,
        items: items,
        total: total,
        orderType: formData.orderType as "Entrega" | "Retirada",
        observation: formData.observation
      });

    } catch (error) {
      console.error("Erro ao finalizar:", error);
      setShowSuccess(false);
      setIsSubmitting(false);
      setShowManualButton(false); // Reseta o botão se der erro
    }
  };

  if (!isOpen) return null;

  // --- TELA DE SUCESSO ESTRATÉGICA ---
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-6">
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 text-center animate-in zoom-in-95 duration-500 shadow-2xl shadow-red-600/10">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
            <Check size={40} className="text-green-500 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-4">
            Pedido Criado!
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-medium">
            Estamos te encaminhando para o <span className="text-green-500 font-bold">WhatsApp</span> da Pizzaria Barcellos agora. 🍕🚀
          </p>

          {/* AJUSTE CIRÚRGICO: Alterna entre "Redirecionando" e o "Botão Manual" */}
          {!showManualButton ? (
            <div className="flex items-center justify-center gap-2 text-red-500 font-bold text-[10px] uppercase tracking-widest">
              <Loader2 className="animate-spin" size={16} />
              Redirecionando...
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <p className="text-[10px] text-zinc-500 uppercase font-black mb-3">O redirecionamento falhou?</p>
              <button 
                onClick={handleFinalize}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl transition shadow-xl shadow-green-600/20 uppercase tracking-widest flex items-center justify-center gap-2 text-xs"
              >
                ENVIAR PARA WHATSAPP
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-zinc-900 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 border-l border-zinc-800">
        <header className="p-6 border-b border-zinc-800 flex justify-between items-center bg-black">
          <div className="flex items-center gap-4">
            {/* BOTÃO DE VOLTAR: Seta para a esquerda para retornar à loja */}
            <button 
              onClick={onClose} 
              className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-red-600 hover:border-red-600 text-zinc-400 hover:text-white transition-all duration-300"
            >
              <ArrowLeft size={22} strokeWidth={3} />
            </button>
            
            <h2 className="text-xl font-black uppercase tracking-tighter">
              {step === 1 ? 'Seu Carrinho' : step === 2 ? 'Dados do Pedido' : 'Pagamento'}
            </h2>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Seu carrinho está vazio.</p>
                  </div>
                ) : (
                  <>
                    {items.map((item, idx) => (
  <div key={idx} className="flex gap-4 bg-black border border-zinc-800 p-4 rounded-3xl group animate-in fade-in slide-in-from-right-4">
    
    {/* CONTAINER DA IMAGEM MEIA A MEIA */}
    <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-zinc-950">
      {/* Sabor 1 (ou pizza inteira) */}
      <img 
        src={item.product1.image} 
        className="absolute inset-0 w-full h-full object-cover" 
        alt={item.product1.name} 
      />
      
      {/* Sabor 2 (aparece apenas se for meio a meio) */}
      {item.product2 && (
        <img 
          src={item.product2.image} 
          className="absolute inset-0 w-full h-full object-cover" 
          style={{ clipPath: 'inset(0 0 0 50%)' }} 
          alt={item.product2.name} 
        />
      )}
      
      {/* Linha divisória sutil para o efeito visual */}
      {item.product2 && (
        <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/20 z-10" />
      )}
    </div>

    <div className="flex-grow">
      <h4 className="font-bold text-sm uppercase">
        {item.product2 ? `1/2 ${item.product1.name} + 1/2 ${item.product2.name}` : item.product1.name}
      </h4>
      {item.size && (
        <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest block">
          {item.size}
        </span>
      )}
      <p className="text-red-500 font-black text-sm mt-1">R$ {item.totalPrice.toFixed(2)}</p>
    </div>

    <button 
      onClick={() => onRemove(idx)} 
      className="text-zinc-700 hover:text-red-500 transition self-center"
    >
      <Trash2 size={20} />
    </button>
  </div>
))}

                    {/* --- CAMPO DE OBSERVAÇÃO ESTRATÉGICO --- */}
                    <div className="mt-8 border-t border-zinc-800 pt-6 animate-in fade-in zoom-in-95">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block ml-2">
                        Alguma observação no pedido?
                      </label>
                      <textarea 
                        value={formData.observation}
                        onChange={e => setFormData({...formData, observation: e.target.value})}
                        className="w-full bg-black border border-zinc-800 p-5 rounded-[2rem] outline-none focus:border-red-600 transition text-white text-sm min-h-[100px] resize-none placeholder:text-zinc-700"
                        placeholder="Ex: Tirar cebola, massa bem assada, campainha estragada..."
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => { setFormData({...formData, orderType: 'Entrega'}); setIsBlocked(addressData.bairro ? isBlocked : false); }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${formData.orderType === 'Entrega' ? 'border-red-600 bg-red-600/10 text-white' : 'border-zinc-800 text-zinc-500 opacity-50'}`}
                >
                  <Truck size={24} />
                  <span className="text-xs font-black uppercase tracking-widest">Entrega</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setFormData({...formData, orderType: 'Retirada'}); setIsBlocked(false); }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${formData.orderType === 'Retirada' ? 'border-red-600 bg-red-600/10 text-white' : 'border-zinc-800 text-zinc-500 opacity-50'}`}
                >
                  <ShoppingBag size={24} />
                  <span className="text-xs font-black uppercase tracking-widest">No Balcão</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Nome Completo</label>
                <input type="text" value={formData.customerName} onChange={e => handleNameChange(e.target.value)} className="w-full bg-black border border-zinc-800 p-4 rounded-2xl outline-none focus:border-red-600 transition uppercase font-bold text-white" placeholder="SEU NOME" />
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">WhatsApp</label>
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={handlePhoneChange} 
                  maxLength={15} 
                  className="w-full bg-black border border-zinc-800 p-4 rounded-2xl outline-none focus:border-red-600 transition font-bold text-white" 
                  placeholder="(00) 00000-0000" 
                />
              </div>
              
              {formData.orderType === 'Entrega' && (
                <div className="border-t border-zinc-800 pt-6 animate-in fade-in slide-in-from-top-4 duration-300">
                  <h3 className="text-xs font-black uppercase tracking-widest text-red-600 mb-4 flex items-center gap-2">
                    <MapPin size={14} /> Local de Entrega
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">1. Digite seu CEP</label>
  <div className="relative">
    <input 
      type="text" 
      maxLength={8} 
      value={addressData.cep} 
      onChange={e => handleCepLookup(e.target.value)} 
      className="w-full bg-black border border-zinc-800 p-4 rounded-2xl outline-none focus:border-red-600 transition font-mono tracking-widest text-lg text-white" 
      placeholder="00000000" 
    />
    {loadingCep && <Loader2 className="absolute right-4 top-4 animate-spin text-red-600" />}
  </div>

  {/* PASSO 2: PARA QUEM NÃO SABE O CEP - ADICIONADO AQUI */}
  <div className="mt-4 flex flex-col items-center">
    <div className="flex items-center gap-3 w-full mb-3 px-2">
      <div className="h-px flex-grow bg-zinc-800"></div>
      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Ou se não souber</span>
      <div className="h-px flex-grow bg-zinc-800"></div>
    </div>
    
    <button
      type="button"
      onClick={handleGetLocation}
      disabled={loadingLocation || loadingCep}
      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 hover:border-red-600 hover:bg-red-600/5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all active:scale-95"
    >
      {loadingLocation ? (
        <Loader2 className="animate-spin text-red-600" size={14} />
      ) : (
        <MapPin size={14} className="text-red-600" />
      )}
      {loadingLocation ? "Localizando..." : "2. Pedir pela minha localização atual"}
    </button>
  </div>
</div>

                    {deliveryMessage && (
                      <div className={`col-span-2 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in-95 ${isBlocked ? 'bg-red-600/20 text-red-500 border border-red-600' : 'bg-green-600/20 text-green-500 border border-green-600'}`}>
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <p className="text-sm font-bold uppercase leading-tight">{deliveryMessage}</p>
                      </div>
                    )}
                    
                    <div className="col-span-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Rua / Logradouro</label>
                      <input type="text" value={addressData.street} readOnly className="w-full bg-zinc-800/30 border border-zinc-800 p-4 rounded-2xl outline-none text-zinc-400" />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Número</label>
                      <input type="text" value={addressData.number} onChange={e => setAddressData({...addressData, number: e.target.value})} className="w-full bg-black border border-zinc-800 p-4 rounded-2xl outline-none focus:border-red-600 transition text-white" placeholder="123" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Complemento</label>
                      <input type="text" value={addressData.complement} onChange={e => setAddressData({...addressData, complement: e.target.value})} className="w-full bg-black border border-zinc-800 p-4 rounded-2xl outline-none focus:border-red-600 transition text-white" placeholder="Ap 101" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Escolha o Meio de Pagamento</label>
              {[
                { id: 'PIX', icon: <Landmark size={20} />, label: 'PIX (Instantâneo)' },
                { id: 'Dinheiro', icon: <Banknote size={20} />, label: 'Dinheiro' },
                { id: 'Crédito', icon: <CreditCard size={20} />, label: 'Cartão de Crédito' },
                { id: 'Débito', icon: <Smartphone size={20} />, label: 'Cartão de Débito' },
              ].map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: method.id})}
                  className={`w-full flex items-center gap-4 p-5 rounded-3xl border-2 transition ${formData.paymentMethod === method.id ? 'bg-red-600/10 border-red-600 text-white' : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                >
                  <div className={formData.paymentMethod === method.id ? 'text-red-500' : ''}>{method.icon}</div>
                  <span className="font-bold uppercase">{method.label}</span>
                </button>
              ))}

              {formData.paymentMethod === 'Dinheiro' && (
                <div className="mt-6 animate-in fade-in slide-in-from-top-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block text-white">Troco para quanto?</label>
                  <input type="text" value={formData.changeFor} onChange={e => setFormData({...formData, changeFor: e.target.value})} className="w-full bg-black border border-zinc-800 p-4 rounded-2xl outline-none focus:border-red-600 transition text-white" placeholder="Ex: R$ 100,00" />
                </div>
              )}
            </div>
          )}
        </main>

        <footer className="p-6 border-t border-zinc-800 bg-black space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-zinc-400 text-sm font-bold uppercase">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-400 text-sm font-bold uppercase">
              <span>Taxa de Entrega</span>
              <span className={deliveryFee === 0 ? 'text-green-500 font-black' : ''}>
                {deliveryFee === 0 ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-white font-black text-xl pt-2">
              <span>TOTAL</span>
              <span className="text-red-600 tracking-tighter">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className="flex-shrink-0 bg-zinc-800 p-4 rounded-2xl hover:bg-zinc-700 transition text-white">
                <ArrowLeft size={24} />
              </button>
            )}
            <button 
              type="button"
              onClick={step === 3 ? handleFinalize : handleNext}
              disabled={items.length === 0 || (step === 2 && formData.orderType === 'Entrega' && isBlocked) || isSubmitting}
              className="flex-grow bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-black py-4 rounded-2xl transition shadow-xl shadow-red-600/20 uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {step === 3 ? 'FINALIZAR PEDIDO' : 'PRÓXIMO'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CartModal;