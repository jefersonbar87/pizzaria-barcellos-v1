import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, AppSettings } from './types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, CONTACT_WHATSAPP, INSTAGRAM_URL } from './constants';
import AdminDashboard from './components/AdminDashboard';
import MenuList from './components/MenuList';
import CartModal from './components/CartModal';
// Importei o ícone Clock para deixarmos a nossa modal de agendamento bem profissional
import { ShoppingCart, Instagram, MapPin, Search, CheckCircle2, MessageCircle, ArrowLeft, Mail, Lock, Pizza, Clock } from 'lucide-react';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOrderingAsAdmin, setIsOrderingAsAdmin] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [splashText, setSplashText] = useState("Bem-vindo à Pizzaria Barcellos");
  const [showAd, setShowAd] = useState(false);

  // --- NOVAS VARIÁVEIS PARA O AGENDAMENTO DE PEDIDOS ---
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [scheduleHour, setScheduleHour] = useState('19');
  const [scheduleMinute, setScheduleMinute] = useState('00');
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);

  const availableHours = ['18', '19', '20', '21', '22', '23'];
  const availableMinutes = ['00', '10', '20', '30', '40', '50'];

  // Variável inteligente: O sistema "abre" se a loja estiver aberta normal, se for admin, OU se houver um agendamento em andamento
  const canOrder = settings.isOpen || isOrderingAsAdmin || !!scheduledTime;

  useEffect(() => {
    const phrases = [
      "Bem-vindo à Pizzaria Barcellos",
      "Onde suas pizzas são feitas com carinho",
      "Suas pizzas em poucos minutos",
      "Sabor em cada detalhe."
    ];

    let currentPhrase = 0;
    const phraseInterval = setInterval(() => {
      currentPhrase++;
      if (currentPhrase >= phrases.length) currentPhrase = 0;
      setSplashText(phrases[currentPhrase]);
    }, 3000);

    const forceOpenTimer = setTimeout(() => {
      setShowSplash(false);
      setLoading(false);

      if (settings.showAdCartaz) {
        setShowAd(true);
      }
    }, 4000);

    return () => {
      clearInterval(phraseInterval);
      clearTimeout(forceOpenTimer);
    };
  }, [settings]);

  const handleLogoClick = () => {
    setLogoClicks(prev => {
      if (prev + 1 >= 10) {
        setIsAdmin(true);
        return 0;
      }
      return prev + 1;
    });
  };

  // Função para validar e confirmar o agendamento
  const handleConfirmSchedule = () => {
    setScheduledTime(`${scheduleHour}:${scheduleMinute}`);
    setIsSchedulingModalOpen(false);
  };

  const submitOrder = async (orderData: Partial<Order>) => {
    if (orderData.orderType === 'Entrega' && !isOrderingAsAdmin) {
      const selectedNeighborhood = settings.neighborhoods.find(n =>
        orderData.address?.toUpperCase().includes(n.name.toUpperCase())
      );
      if (selectedNeighborhood && (selectedNeighborhood as any).active === false) {
        alert("Ainda não estamos entregando no seu bairro no momento.");
        return;
      }
    }

    const orderId = Math.random().toString(36).substring(2, 9).toUpperCase();
    const newOrder = { ...orderData, id: orderId, status: 'Pendente', createdAt: Date.now() };

    try {
      try {
        setOrders(prev => [newOrder as Order, ...prev]);
      } catch (e) {
        console.log("Erro banco ignorado");
      }

      setShowSuccessMessage(true);

      setTimeout(() => {
        if (!isOrderingAsAdmin) {
          const itemsText = orderData.items?.map(item => {
            let name;

            if (item.product3) {
              name = `1/3 ${item.product1.name.toUpperCase()}, 1/3 ${item.product2?.name.toUpperCase() || '...'} e 1/3 ${item.product3.name.toUpperCase()}`;
            } else if (item.product2) {
              name = `1/2 ${item.product1.name.toUpperCase()} e 1/2 ${item.product2.name.toUpperCase()}`;
            } else {
              name = item.product1.name.toUpperCase();
            }

            const size = item.size ? `(${item.size})` : '';
            return `* ${item.quantity} - ${name} ${size} - R$ ${item.totalPrice.toFixed(2)}`;
          }).join('\n');

          const isRetirada = orderData.orderType === 'Retirada';
          const typeLabel = isRetirada ? "🛵 MODO: RETIRADA" : "🛵 MODO: ENTREGA";
          const addressLabel = isRetirada ? "RETIRADA NO BALCÃO" : orderData.address;
          const deliveryFee = orderData.neighborhood?.fee || 0;
          const deliveryFeeText = (isRetirada || deliveryFee === 0) ? "GRÁTIS 🎁" : `R$ ${deliveryFee.toFixed(2)}`;
          const subtotal = (orderData.total || 0) - (isRetirada ? 0 : deliveryFee);
          const observationText = orderData.observation ? `\n\n📝 *OBSERVAÇÃO:* ${orderData.observation}` : '';

          // AQUI ESTÁ A MÁGICA DO AGENDAMENTO NO WHATSAPP
          const scheduleText = scheduledTime ? `*Agendamento de pedido para ${scheduledTime}h*\n\n` : '';

          const message = `${scheduleText}*PEDIDO PIZZARIA BARCELLOS* 🍕\n🆔 ID: #${orderId}\n\n${typeLabel}\n👤 Cliente: ${orderData.customerName?.toUpperCase()}\n📞 Tel: ${orderData.phone}\n📍 Local: ${addressLabel}${observationText}\n\nITENS:\n${itemsText}\n\n--------------------------\nSubtotal: R$ ${subtotal.toFixed(2)}\nTaxa de Entrega: ${deliveryFeeText}\n*TOTAL: R$ ${orderData.total?.toFixed(2)}*\n--------------------------\n\n💳 Pagamento: ${orderData.paymentMethod?.toUpperCase()}${orderData.changeFor ? `\n💵 Troco para: ${orderData.changeFor}` : ''}`;

          const phone = "5527996183495";
          window.location.href = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

          setTimeout(() => {
            setShowSuccessMessage(false);
            setIsCartOpen(false);
            setCart([]);
            // Reseta o agendamento após o pedido
            setScheduledTime(null);
          }, 3000);

        } else {
          setShowSuccessMessage(false);
          setIsCartOpen(false);
        }
      }, 4000);

    } catch (err) {
      console.error(err);
      alert('Erro no processamento.');
    }
  };

  if (showSplash) {
    return (
      <div
        className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-repeat bg-center p-6 text-center"
        style={{
          backgroundImage: `url('https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/fundosite.webp')`,
          backgroundSize: '200px',
          backgroundColor: '#1B431D'
        }}
      >
        <div className="absolute inset-0 bg-[#1B431D]/90 backdrop-blur-sm"></div>
        <div className="relative space-y-8 max-w-sm sm:max-w-md mx-auto animate-in fade-in zoom-in-95 duration-1000">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl"></div>
              <Pizza
                size={80}
                className="text-white sm:size-[110px] animate-bounce opacity-95 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                strokeWidth={1.2}
              />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-white text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none drop-shadow-2xl">
              PIZZARIA BARCELLOS
            </h1>
            <p className="text-white/60 font-bold text-[10px] sm:text-xs uppercase tracking-[0.4em]">
              Produzindo Qualidade
            </p>
          </div>
          <div className="w-48 sm:w-60 h-1 bg-white/10 mx-auto rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-red-600 animate-pulse w-full"></div>
          </div>
          <div className="h-12 flex items-center justify-center">
            <p className="text-white font-bold text-[11px] sm:text-sm uppercase tracking-widest animate-pulse max-w-xs leading-tight">
              {splashText}
            </p>
          </div>
          <p className="text-white/20 text-[8px] font-black tracking-[0.5em] uppercase pt-8 border-t border-white/5">
            Linhares - Espírito Santo
          </p>
        </div>
      </div>
    );
  }

  if (showAd && settings.showAdCartaz) {
    return (
      <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 overflow-hidden bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/fundosite.webp')`,
            opacity: '0.4',
            filter: 'blur(6px)',
            WebkitFilter: 'blur(6px)',
            zIndex: 0
          }}
        />
        <div className="absolute inset-0 bg-black/50 z-[1]" />
        <div className="relative z-[10] w-full max-w-[92%] sm:max-w-md mx-auto animate-in fade-in zoom-in duration-500 flex flex-col items-center">
          <div className="text-center mb-4">
            <h2 className="text-white text-xl font-black uppercase tracking-[0.3em] drop-shadow-lg">
              Avisos
            </h2>
            <div className="w-10 h-1 bg-red-600 mx-auto mt-1 rounded-full"></div>
          </div>
          <div className="w-full rounded-[1.5rem] border-2 border-white/10 shadow-2xl bg-zinc-900/60 overflow-visible flex justify-center">
            <img
              src={settings.adCartazLink}
              alt="Campanha Dia das Mães"
              className="w-full h-auto max-h-[68vh] object-contain shadow-2xl touch-pinch-zoom cursor-zoom-in active:scale-125 transition-transform duration-300"
            />
          </div>
          <button
            onClick={() => setShowAd(false)}
            className="w-full mt-8 mb-2 bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 text-base"
          >
            ACESSAR CARDÁPIO
          </button>
        </div>
      </div>
    );
  }

  if (isAdmin && !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4 text-white">
        <div className="bg-zinc-900 p-10 rounded-[2.5rem] w-full max-w-md border border-red-600 shadow-2xl">
          <form onSubmit={(e) => {
            e.preventDefault();
            const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
            const pass = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
            if (email === 'pizzariabarcellos87@gmail.com' && pass === '1842JJcc!@#') setIsLoggedIn(true);
            else alert('Credenciais inválidas');
          }} className="space-y-4">
            <h2 className="text-2xl font-black text-center uppercase mb-6">Acesso Restrito</h2>
            <input name="email" type="email" placeholder="Email" className="w-full bg-black border border-zinc-700 p-4 rounded-xl text-sm" required />
            <input name="password" type="password" placeholder="Senha" className="w-full bg-black border border-zinc-700 p-4 rounded-xl text-sm" required />
            <button className="w-full bg-red-600 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-red-700 transition">Entrar</button>
            <button type="button" onClick={() => setIsAdmin(false)} className="w-full text-zinc-500 text-[10px] uppercase font-bold text-center">Voltar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col text-white selection:bg-red-600 selection:text-white bg-repeat bg-center"
      style={{
        backgroundImage: `url('https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/fundosite.webp')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '250px'
      }}
    >
      <header className="sticky top-0 z-50 bg-[#1B431D] border-b border-black/20 shadow-2xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-4 cursor-pointer select-none" onClick={handleLogoClick}>
              {settings.logoImage ? (
                <img src={settings.logoImage} alt="Logo" style={{ height: '60px' }} className="w-auto object-contain" />
              ) : (
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center font-black text-xl shadow-lg">B</div>
              )}
              <div>
                <h1 className="text-white text-xl font-black tracking-tighter uppercase leading-none">Pizzaria Barcellos</h1>
                <p className="text-white/60 text-[9px] font-bold tracking-[0.3em] uppercase">Produzindo Qualidade</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isOrderingAsAdmin && (
                <button onClick={() => setIsOrderingAsAdmin(false)} className="px-4 py-2 bg-white/10 text-white rounded-xl font-bold text-[10px] uppercase border border-white/20 flex items-center gap-2">
                  <ArrowLeft size={16} /> Voltar ao Painel
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(true)}
                // Usando a variável canOrder aqui
                disabled={!canOrder}
                className={`relative p-3 bg-white/10 rounded-full hover:bg-white/20 transition border border-white/10 ${(!canOrder) && 'opacity-30'}`}
              >
                <ShoppingCart size={22} className="text-white" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#1B431D] animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="inline-flex items-center gap-3 bg-black/30 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/5">
              <div className="flex items-center gap-2">
                {/* Ajustado para refletir o status de agendamento */}
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${settings.isOpen || scheduledTime ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}></div>
                <span className="text-[10px] font-black uppercase tracking-wider text-white">
                  {settings.isOpen ? 'Loja Aberta' : scheduledTime ? `AGENDADO: ${scheduledTime}H` : 'Loja Fechada'}
                </span>
              </div>

              <span className="text-white/20 text-xs">|</span>

              <a
                href={`https://wa.me/${CONTACT_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-70 transition-opacity"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-3.5 h-3.5" alt="Zap" />
                <span className="text-[10px] font-bold text-white tracking-wide">(27) 99618-3495</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">

        {/* CASO A LOJA ESTEJA FECHADA E O CLIENTE NÃO TENHA FEITO UM AGENDAMENTO AINDA */}
        {!canOrder && (
          <>
            <div className="flex justify-start mb-3 -mt-5">
              <button
                onClick={() => setIsSchedulingModalOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs sm:text-sm font-black py-2.5 px-6 rounded-xl uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all active:scale-95"
              >
                AGENDAR PEDIDO
              </button>
            </div>

            <div className="bg-red-900/40 border border-red-600 p-4 sm:p-5 rounded-2xl mb-6 text-center animate-pulse shadow-lg">
              <h2 className="text-[1.1rem] sm:text-xl font-black text-red-100 uppercase tracking-tighter leading-tight">
                {settings.closeMessage}
              </h2>
              <p className="text-[9px] text-red-200 uppercase font-black mt-1.5 tracking-widest opacity-80">Produzindo Qualidade</p>
            </div>
          </>
        )}

        {/* MENSAGEM DE AVISO QUANDO O AGENDAMENTO ESTIVER ATIVO (Para ele lembrar) */}
        {scheduledTime && (
          <div className="bg-yellow-900/40 border border-yellow-500 p-3 sm:p-4 rounded-2xl mb-6 text-center shadow-[0_0_15px_rgba(234,179,8,0.15)] flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-500">
            <div className="flex items-center gap-3">
              <Clock className="text-yellow-500" size={24} />
              <div className="text-left">
                <h2 className="text-sm sm:text-base font-black text-yellow-100 uppercase tracking-tighter leading-tight">
                  Seu pedido está sendo agendado para as {scheduledTime}h
                </h2>
                <p className="text-[10px] text-yellow-200/70 font-bold uppercase tracking-widest">Adicione os itens ao carrinho</p>
              </div>
            </div>
            <button onClick={() => setScheduledTime(null)} className="w-full sm:w-auto bg-black/40 hover:bg-black/60 text-zinc-300 text-[10px] px-4 py-2 rounded-xl uppercase font-black tracking-widest transition-colors">
              Cancelar
            </button>
          </div>
        )}

        <div className="relative rounded-[3rem] overflow-hidden mb-14 shadow-2xl border border-zinc-800 h-64 sm:h-80 group">
          <video
            src={settings.bannerImage}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover brightness-[0.5] group-hover:scale-105 transition duration-1000"
          />
          <div className="absolute inset-0 flex flex-col justify-center p-12 bg-gradient-to-r from-black/80 to-transparent">
            <span className="bg-red-600 text-[10px] font-black px-4 py-1.5 rounded-full mb-4 w-fit uppercase tracking-widest shadow-lg">Premium Quality</span>
            <h2 className="text-4xl sm:text-6xl font-black mb-3 uppercase tracking-tighter leading-none">{settings.bannerText}</h2>
            <p className="text-zinc-300 max-w-md text-sm sm:text-lg font-medium opacity-80">{settings.bannerSubtext}</p>
          </div>
        </div>

        <MenuList
          products={products.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          onAddToCart={(i) => setCart([...cart, i])}
          // Agora passamos o canOrder, assim se ele agendou, o cardápio fica liberado
          isOpen={canOrder}
          promotions={settings.promotions}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </main>

      <footer className="bg-zinc-900/80 border-t border-zinc-800 pt-16 pb-8 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center md:text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3">
                {settings.logoImage && <img src={settings.logoImage} alt="Logo" className="h-10 w-auto object-contain" />}
                <h4 className="font-black uppercase tracking-tighter text-xl text-white">Pizzaria Barcellos</h4>
              </div>
              <p className="text-zinc-500 text-[10px] font-bold leading-relaxed max-w-xs mx-auto md:mx-0 uppercase tracking-[0.2em]">
                Produzindo Qualidade, sinta o sabor de uma pizza feita com carinho!
              </p>
            </div>

            <div className="space-y-4">
              <h5 className="text-red-600 font-black text-[10px] uppercase tracking-[0.3em]">Onde Estamos</h5>
              <div className="flex flex-col gap-3 text-zinc-300 text-sm font-bold uppercase tracking-widest">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <MapPin size={18} className="text-red-600" />
                  <span>Nova Esperança - Linhares - ES</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <MessageCircle size={18} className="text-green-500" />
                  <span>(27) 99618-3495</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Pizza size={18} className="text-yellow-500" />
                  <span>Aberto: 18:00h às 23:30h</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-red-600 font-black text-[10px] uppercase tracking-[0.3em]">Siga-nos</h5>
              <div className="flex justify-center md:justify-start gap-4">
                <a href={`https://wa.me/5527996183495`} target="_blank" className="p-4 bg-zinc-800 rounded-2xl hover:bg-green-600 hover:scale-110 transition duration-300 shadow-xl border border-zinc-700">
                  <MessageCircle size={24} className="text-white" />
                </a>
                <a href={INSTAGRAM_URL} target="_blank" className="p-4 bg-zinc-800 rounded-2xl hover:bg-red-600 hover:scale-110 transition duration-300 shadow-xl border border-zinc-700">
                  <Instagram size={24} className="text-white" />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em]">
              © 2026 PIZZARIA BARCELLOS - MARCA REGISTRADA
            </p>
            <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em]">
              DESENVOLVIDO POR <span className="text-zinc-400">JEFTECNOLOGIAS</span>
            </p>
          </div>
        </div>
      </footer>

      {/* MODAL DE AGENDAMENTO CUSTOMIZADO */}
      {isSchedulingModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-[2rem] w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center mb-6">
              <Clock size={40} className="text-yellow-500 mb-3 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
              <h2 className="text-xl font-black text-white uppercase tracking-wider text-center">Horário de Entrega</h2>
              <p className="text-zinc-400 text-[10px] text-center mt-1 font-bold uppercase tracking-widest">
                Selecione o horário desejado
              </p>
            </div>

            {/* NOSSO SELETOR DE TEMPO CUSTOMIZADO */}
            <div className="flex gap-4 mb-8">
              {/* Coluna Horas */}
              <div className="flex-1">
                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest text-center mb-2">Hora</p>
                <div className="grid grid-cols-2 gap-2">
                  {availableHours.map(h => (
                    <button
                      key={h}
                      onClick={() => {
                        setScheduleHour(h);
                        // Ajusta os minutos automaticamente se cair em uma restrição
                        if (h === '18' && (scheduleMinute === '00' || scheduleMinute === '10')) setScheduleMinute('20');
                        if (h === '23' && (scheduleMinute === '40' || scheduleMinute === '50')) setScheduleMinute('30');
                      }}
                      className={`py-2 rounded-xl font-black text-sm sm:text-base transition-colors ${scheduleHour === h ? 'bg-yellow-500 text-black shadow-lg' : 'bg-black text-white border border-zinc-700 hover:border-yellow-500'}`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Coluna Minutos */}
              <div className="flex-1">
                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest text-center mb-2">Minuto</p>
                <div className="grid grid-cols-2 gap-2">
                  {availableMinutes.map(m => {
                    // Lógica de bloqueio: antes das 18:20h e depois das 23:30h
                    const isDisabled = (scheduleHour === '18' && (m === '00' || m === '10')) || (scheduleHour === '23' && (m === '40' || m === '50'));

                    return (
                      <button
                        key={m}
                        disabled={isDisabled}
                        onClick={() => setScheduleMinute(m)}
                        className={`py-2 rounded-xl font-black text-sm sm:text-base transition-colors ${isDisabled ? 'opacity-20 cursor-not-allowed bg-black text-zinc-600 border border-zinc-900' : scheduleMinute === m ? 'bg-yellow-500 text-black shadow-lg' : 'bg-black text-white border border-zinc-700 hover:border-yellow-500'}`}
                      >
                        {m}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* BOTÕES EMPILHADOS PARA NÃO QUEBRAR TEXTO */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmSchedule}
                className="w-full py-4 bg-yellow-500 text-black rounded-2xl font-black uppercase tracking-wider hover:bg-yellow-600 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.4)] active:scale-95 text-sm sm:text-base"
              >
                Ir para o Cardápio
              </button>
              <button
                onClick={() => setIsSchedulingModalOpen(false)}
                className="w-full py-3 bg-zinc-800 text-zinc-300 rounded-2xl font-black uppercase tracking-wider hover:bg-zinc-700 transition-colors text-xs sm:text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onRemove={(idx) => setCart(cart.filter((_, i) => i !== idx))} settings={settings} onSubmit={submitOrder} />
    </div>
  );
};

export default App;