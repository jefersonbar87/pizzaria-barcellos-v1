import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, AppSettings } from './types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, CONTACT_WHATSAPP, INSTAGRAM_URL } from './constants';
import AdminDashboard from './components/AdminDashboard';
import MenuList from './components/MenuList';
import CartModal from './components/CartModal';
import { ShoppingCart, Instagram, MapPin, Search, CheckCircle2, MessageCircle, ArrowLeft, Mail, Lock, Pizza } from 'lucide-react';

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

    // Removemos a busca no banco de dados e deixamos apenas o timer do Splash
    const forceOpenTimer = setTimeout(() => {
      setShowSplash(false);
      setLoading(false);
    }, 4000); // 4 segundos de splash é o ideal

    return () => {
      clearInterval(phraseInterval);
      clearTimeout(forceOpenTimer);
    };
  }, []);

  const handleLogoClick = () => {
    setLogoClicks(prev => {
      if (prev + 1 >= 10) {
        setIsAdmin(true);
        return 0;
      }
      return prev + 1;
    });
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
      // Tentativa de banco silenciosa
      try {
        
        setOrders(prev => [newOrder as Order, ...prev]);
    } catch (e) { console.log("Erro banco ignorado"); }

    // ✅ 1. ATIVA A MENSAGEM NO CARD
    setShowSuccessMessage(true);

    setTimeout(() => {
      if (!isOrderingAsAdmin) {
        // 1. Formatação dos Itens com a lógica de Meia a Meia que você pediu
const itemsText = orderData.items?.map(item => {
  let name;
  
  if (item.product2) {
    // Se tiver segundo sabor, formata como: 1/2 SABOR 1 e 1/2 SABOR 2
    name = `1/2 ${item.product1.name.toUpperCase()} e 1/2 ${item.product2.name.toUpperCase()}`;
  } else {
    // Se for sabor único, mantém o nome normal
    name = item.product1.name.toUpperCase();
  }

  const size = item.size ? `(${item.size})` : '';
  return `* ${item.quantity} - ${name} ${size} - R$ ${item.totalPrice.toFixed(2)}`;
}).join('\n');
        
        const isRetirada = orderData.orderType === 'Retirada';
        const typeLabel = isRetirada ? "🛵 MODO: RETIRADA" : "🛵 MODO: ENTREGA";
        
        // Ajuste do Local: Se for retirada, ignora o endereço do cliente
        const addressLabel = isRetirada ? "RETIRADA NO BALCÃO" : orderData.address;
        
        const deliveryFee = orderData.neighborhood?.fee || 0;
        const deliveryFeeText = (isRetirada || deliveryFee === 0) ? "GRÁTIS 🎁" : `R$ ${deliveryFee.toFixed(2)}`;
        
        const subtotal = (orderData.total || 0) - (isRetirada ? 0 : deliveryFee);
        const observationText = orderData.observation ? `\n\n📝 *OBSERVAÇÃO:* ${orderData.observation}` : '';

        // 2. Montagem da Mensagem com o Layout Premium
        const message = `*PEDIDO PIZZARIA BARCELLOS* 🍕\n🆔 ID: #${orderId}\n\n${typeLabel}\n👤 Cliente: ${orderData.customerName?.toUpperCase()}\n📞 Tel: ${orderData.phone}\n📍 Local: ${addressLabel}${observationText}\n\nITENS:\n${itemsText}\n\n--------------------------\nSubtotal: R$ ${subtotal.toFixed(2)}\nTaxa de Entrega: ${deliveryFeeText}\n*TOTAL: R$ ${orderData.total?.toFixed(2)}*\n--------------------------\n\n💳 Pagamento: ${orderData.paymentMethod?.toUpperCase()}${orderData.changeFor ? `\n💵 Troco para: ${orderData.changeFor}` : ''}`;

        const phone = "5527996183495";
        window.location.href = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
        
        // 🔥 AJUSTE AQUI: Espera mais 3 segundos DEPOIS de abrir o Zap para limpar a tela
        setTimeout(() => {
            setShowSuccessMessage(false);
            setIsCartOpen(false); 
            setCart([]); 
        }, 3000);

      } else {
        // Se for Admin, apenas fecha a mensagem após o tempo
        setShowSuccessMessage(false);
        setIsCartOpen(false);
      }
    }, 4000); // 4 segundos de mensagem estática no card antes de agir

    } catch (err) {
      console.error(err);
      alert('Erro no processamento.');
    }
  }; // <--- ESSA chave fecha a função e MAIS NADA.

  if (showSplash) {
    return (
      <div 
        className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-repeat bg-center p-6 text-center"
        style={{ 
          backgroundImage: `url('https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/fundosite.webp')`,
          backgroundSize: '200px', 
          backgroundColor: '#1B431D' // VOLTAMOS COM O SEU VERDE AQUI!
        }}
      >
        {/* Camada verde com transparência para o mosaico aparecer no fundo */}
        <div className="absolute inset-0 bg-[#1B431D]/90 backdrop-blur-sm"></div>

        <div className="relative space-y-8 max-w-sm sm:max-w-md mx-auto animate-in fade-in zoom-in-95 duration-1000">
          
          {/* ÍCONE DE PIZZA COM ANIMAÇÃO */}
          <div className="flex justify-center">
            <div className="relative group">
              {/* Brilho suave atrás da pizza */}
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
          
          {/* BARRA DE CARREGAMENTO BRANCA/VERMELHA */}
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
      // TROQUEI AS CLASSES AQUI:
      className="min-h-screen flex flex-col text-white selection:bg-red-600 selection:text-white bg-repeat bg-center"
      // AJUSTEI O STYLE AQUI (Repetição e Tamanho):
      style={{ 
        backgroundImage: `url('https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/fundosite.webp')`,
        backgroundRepeat: 'repeat',   // Faz a imagem repetir (mosaico)
        backgroundSize: '250px'        // TAMANHO DO DESENHO: Ajuste aqui (ex: 100px ou 200px) até ficar sutil igual ao Zap
      }}
    >
            <header className="sticky top-0 z-50 bg-[#1B431D] border-b border-black/20 shadow-2xl">
  <div className="container mx-auto px-4 py-3">
    {/* LINHA SUPERIOR: LOGO E CARRINHO */}
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
          disabled={!settings.isOpen && !isOrderingAsAdmin} 
          className={`relative p-3 bg-white/10 rounded-full hover:bg-white/20 transition border border-white/10 ${(!settings.isOpen && !isOrderingAsAdmin) && 'opacity-30'}`}
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

    {/* LINHA INFERIOR: STATUS DA LOJA E WHATSAPP CLICÁVEL */}
    <div className="flex justify-start">
      <div className="inline-flex items-center gap-3 bg-black/30 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/5">
        {/* Indicador Visual de Status */}
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${settings.isOpen ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}></div>
          <span className="text-[10px] font-black uppercase tracking-wider text-white">
            {settings.isOpen ? 'Loja Aberta' : 'Loja Fechada'}
          </span>
        </div>

        <span className="text-white/20 text-xs">|</span>

        {/* Link direto para o seu WhatsApp */}
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
        {!settings.isOpen && !isOrderingAsAdmin && (
          <div className="bg-red-900/40 border border-red-600 p-8 rounded-[2rem] mb-10 text-center animate-pulse">
            <h2 className="text-2xl font-black text-red-100 uppercase tracking-tighter">{settings.closeMessage}</h2>
            <p className="text-[10px] text-red-200 uppercase font-black mt-3 tracking-widest opacity-60">Produzindo Qualidade</p>
          </div>
        )}

        <div className="relative rounded-[3rem] overflow-hidden mb-14 shadow-2xl border border-zinc-800 h-64 sm:h-80 group">
  {/* SUBSTITUÍMOS A IMG POR ESTE VÍDEO: */}
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

        <MenuList products={products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))} onAddToCart={(i) => setCart([...cart, i])} isOpen={settings.isOpen || isOrderingAsAdmin} promotions={settings.promotions} />
      </main>

      <footer className="bg-zinc-900/80 border-t border-zinc-800 pt-16 pb-8 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center md:text-left">
            
            {/* COLUNA 1: MARCA */}
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3">
                {settings.logoImage && <img src={settings.logoImage} alt="Logo" className="h-10 w-auto object-contain" />}
                <h4 className="font-black uppercase tracking-tighter text-xl text-white">Pizzaria Barcellos</h4>
              </div>
              <p className="text-zinc-500 text-[10px] font-bold leading-relaxed max-w-xs mx-auto md:mx-0 uppercase tracking-[0.2em]">
                Produzindo Qualidade, sinta o sabor de uma pizza feita com carinho!
              </p>
            </div>

            {/* COLUNA 2: CONTATO E LOCAL */}
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
    {/* ADICIONEI O HORÁRIO AQUI EMBAIXO: */}
    <div className="flex items-center justify-center md:justify-start gap-3">
      <Pizza size={18} className="text-yellow-500" />
      <span>Aberto: 18:00h às 23:30h</span>
    </div>
  </div>
</div>

            {/* COLUNA 3: REDES SOCIAIS */}
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

          {/* LINHA FINAL: COPYRIGHTS */}
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

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onRemove={(idx) => setCart(cart.filter((_, i) => i !== idx))} settings={settings} onSubmit={submitOrder} />
    </div>
  );
};

export default App;