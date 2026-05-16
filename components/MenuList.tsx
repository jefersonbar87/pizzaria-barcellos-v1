import React, { useState, useEffect } from 'react';
import { Product, CartItem, PizzaSize, Promotion } from '../types';
import { Plus, Check, Info, X, Lock, Flame, Truck, Pizza, CupSoda, Search } from 'lucide-react';

interface MenuListProps {
  products: Product[];
  onAddToCart: (item: CartItem) => void;
  isOpen: boolean;
  promotions?: Promotion[];
  searchQuery: string;        // <--- Adicione esta
  setSearchQuery: (query: string) => void; // <--- Adicione esta
}

const MenuList: React.FC<MenuListProps> = ({ products, onAddToCart, isOpen, promotions, searchQuery, setSearchQuery }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [size, setSize] = useState<PizzaSize>('Grande');
  const [halfProduct, setHalfProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // Variável de categorias e Estado para controlar a aba ativa
  const categories: ('Pizza' | 'Bebida')[] = ['Pizza', 'Bebida'];
  const [activeCategory, setActiveCategory] = useState<'Pizza' | 'Bebida'>('Pizza');
  // Adicione esta linha abaixo do activeCategory
  const [pizzaSubCategory, setPizzaSubCategory] = useState<'Todas' | 'Clássicas' | 'Premium'>('Todas');
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const promoRef = React.useRef<HTMLDivElement>(null);
  const isUserInteracting = React.useRef(false); // Ref para saber se o cliente está mexendo
  const interactionTimeout = React.useRef<NodeJS.Timeout | null>(null);

const handleOpenModal = (p: Product) => {
    if (!isOpen || !p.available || p.stock === 0) return; 
    
    setSelectedProduct(p);
    setHalfProduct(null);
    setSize('Grande');
  };

  const handleAddPromotion = (promo: Promotion) => { // <--- Adicionamos o parâmetro 'promo'
  if (!promo || !isOpen) return;
  
  onAddToCart({
    id: `promo-${Date.now()}-${Math.random()}`, // ID único para não dar conflito
    product1: {
      id: 'promo',
      name: promo.title,
      description: promo.description,
      image: promo.image,
      category: 'Pizza',
      available: true
    } as Product,
    quantity: 1,
    totalPrice: promo.price,
    isPromotion: true
  });

    // SE ADICIONAR PROMOÇÃO (QUE É PIZZA), TAMBÉM PULA PRO REFRI!
    setActiveCategory('Bebida');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdd = () => {
    if (!selectedProduct || !isOpen) return;

    let price = 0;
    if (selectedProduct.category === 'Pizza') {
      const p1 = selectedProduct;
      const p2 = halfProduct || p1;
      const prices1 = { 
        'Média': p1.priceM, 
        'Grande': p1.priceG, 
        'Gigante': p1.priceGG,
        'Família (12)': p1.priceFA,
        'Maracanã (24)': p1.priceMA
      };
      const prices2 = { 
        'Média': p2.priceM, 
        'Grande': p2.priceG, 
        'Gigante': p2.priceGG,
        'Família (12)': p2.priceFA,
        'Maracanã (24)': p2.priceMA
      };
      
      const price1 = prices1[size] || 0;
      const price2 = prices2[size] || 0;
      
      price = Math.max(price1, price2);
    } else {
      price = selectedProduct.priceFixed || 0;
    }

    onAddToCart({
      id: Math.random().toString(),
      product1: selectedProduct,
      product2: halfProduct || undefined,
      size: selectedProduct.category === 'Pizza' ? size : undefined,
      quantity: 1,
      totalPrice: price
    });

    // --- MUDANÇA ESTRATÉGICA AQUI ---
if (selectedProduct.category === 'Pizza') {
      setActiveCategory('Bebida'); // Troca a aba para Bebida
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Sobe a tela para ver os refris
    }

    setSelectedProduct(null);
  };

  // --- PARTE 2: LÓGICA DO CARROSSEL AUTOMÁTICO ---
useEffect(() => {
    const activePromos = promotions?.filter(p => p.active) || [];
    if (activePromos.length <= 1) return;

    const interval = setInterval(() => {
      if (!isUserInteracting.current) {
        setCurrentPromoIndex((prev) => prev + 1);
      }
    }, 2500);

    return () => {
      if (interval) clearInterval(interval);
      if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    };
  }, [promotions]);

  useEffect(() => {
    const activePromos = promotions?.filter(p => p.active) || [];
    if (activePromos.length === 0 || isUserInteracting.current) return;

    if (promoRef.current) {
      // Se chegarmos no "clone" (a cópia da primeira promo no final)
      if (currentPromoIndex >= activePromos.length) {
        // Primeiro desliza suavemente até o clone
        const scrollAmount = promoRef.current.offsetWidth * currentPromoIndex;
        promoRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });

        // Depois de meio segundo (tempo da animação), reseta para o zero real sem o cliente ver
        setTimeout(() => {
          if (promoRef.current) {
            promoRef.current.style.scrollBehavior = 'auto'; // Desativa o deslize
            promoRef.current.scrollLeft = 0; // Volta pro início instantâneo
            setCurrentPromoIndex(0);
            promoRef.current.style.scrollBehavior = 'smooth'; // Reativa o deslize
          }
        }, 500); 
      } else {
        const scrollAmount = promoRef.current.offsetWidth * currentPromoIndex;
        promoRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }, [currentPromoIndex, promotions]);

  // Função que detecta interação e pausa o automático por 4 segundos
const handleUserScroll = (e: React.UIEvent<HTMLDivElement>) => {
    isUserInteracting.current = true;
    
    // Calcula qual slide está visível para atualizar os indicadores (dots)
    const scrollPosition = e.currentTarget.scrollLeft;
    const itemWidth = e.currentTarget.offsetWidth;
    
    if (itemWidth > 0) {
      const activeCount = promotions?.filter(p => p.active).length || 1;
      const newIndex = Math.round(scrollPosition / itemWidth);
      // Mantém o index dentro do limite real das promoções
      setCurrentPromoIndex(newIndex % activeCount);
    }

    if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    interactionTimeout.current = setTimeout(() => {
      isUserInteracting.current = false;
    }, 4000);
  };

  // Funções para as Setas (Igual ao exemplo que você mandou)
  const nextSlide = () => {
    const activeCount = promotions?.filter(p => p.active).length || 0;
    isUserInteracting.current = true;
    setCurrentPromoIndex((prev) => (prev + 1 >= activeCount ? 0 : prev + 1));
    setTimeout(() => isUserInteracting.current = false, 4000);
  };

  const prevSlide = () => {
    const activeCount = promotions?.filter(p => p.active).length || 0;
    isUserInteracting.current = true;
    setCurrentPromoIndex((prev) => (prev - 1 < 0 ? activeCount - 1 : prev - 1));
    setTimeout(() => isUserInteracting.current = false, 4000);
  };

  // --- PASSO 1: VARIÁVEIS DE BEBIDAS (ORIGINAL) ---
  const refri2L = products.filter(p => p.category === 'Bebida' && p.name.toUpperCase().includes('2L'));
  const refri15L = products.filter(p => p.category === 'Bebida' && p.name.toUpperCase().includes('1,5L'));
  const refri600 = products.filter(p => p.category === 'Bebida' && p.name.toUpperCase().includes('600ML'));
  const refriLata = products.filter(p => p.category === 'Bebida' && (p.name.toUpperCase().includes('LATA') || p.name.toUpperCase().includes('350ML')));
  // -----------------------------------------------

  return (
    <div className="space-y-12">
      {/* Seção de Promoções - Layout Limpo, Minimalista e com Scroll (Estilo UP) */}
      {promotions && promotions.filter(p => p.active).length > 0 && (
        <section className="animate-in fade-in duration-700 px-4 mb-10">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-2xl font-black uppercase tracking-tighter border-l-4 border-orange-500 pl-4 flex items-center gap-2 text-white">
              <Flame className="text-orange-500" fill="currentColor" size={24} /> EM DESTAQUE
            </h3>
            <div className="h-px flex-grow bg-zinc-800"></div>
          </div>
          
          <div className="relative group">
            <div 
              ref={promoRef}
              onScroll={handleUserScroll}
              className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory rounded-[2rem]"
              style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                flexWrap: 'nowrap',
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth'
              }}
            >
              {promotions.filter(p => p.active).map((promo, index) => (
                <div 
                  key={`${promo.id}-${index}`} 
                  className="flex-none w-[98%] snap-center p-1" 
                  style={{ flexShrink: 0 }}
                >
                  <div 
  onClick={(e) => {
  e.stopPropagation();

  // A MÁGICA ESTÁ AQUI: Se for false ou indefinido, ele para a execução na hora (return)
  if (promo.isClickable === false || !isOpen) {
    return;
  }

  // Só chega aqui se isClickable for true (ou não existir, se você quiser que o padrão seja clicar)
  setSelectedProduct({
    id: promo.id,
    name: promo.title,
    description: promo.description,
    image: promo.image,
    priceFixed: promo.price,
    category: 'Bebida', 
    available: true
  } as any);
}}
  className={`relative aspect-[16/10] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-zinc-950 ${
    promo.isClickable ? 'cursor-pointer group' : 'cursor-default'
  }`}
>
                    {/* Banner Foco Total na Arte */}
                    <img 
                      src={promo.image} 
                      alt={promo.title} 
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" 
                    />

                    {/* Feedback de toque meigo e sutil */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-active:opacity-100 transition-opacity duration-200"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- NOVA NAVEGAÇÃO DE CATEGORIAS LADO A LADO --- */}
      <div className="flex justify-start gap-3 p-1 bg-zinc-900/80 backdrop-blur-xl rounded-full border border-zinc-800 max-w-full overflow-x-auto sticky top-20 z-40 px-2 sm:px-4 mb-10 shadow-2xl">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-none flex items-center justify-center gap-2.5 py-3.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 border-2 w-auto px-6 sm:px-8 ${
              activeCategory === cat 
              ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20 scale-[1.02]' 
              : 'bg-black/50 border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {cat === 'Pizza' ? <Pizza size={16} /> : <CupSoda size={16} />}
            {cat}s
          </button>
        ))}
      </div>

      {/* --- LISTAGEM DOS PRODUTOS FILTRADOS --- */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-2xl font-black uppercase tracking-tighter border-l-4 border-red-600 pl-4">
              Nossas {activeCategory}s
            </h3>
            
            <button 
              type="button"
              onClick={() => {
                if (isSearchOpen) setSearchQuery('');
                setIsSearchOpen(!isSearchOpen);
              }}
              className={`p-3 rounded-2xl transition-all duration-300 border ${
                isSearchOpen 
                ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] scale-105' 
                : 'bg-black border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 animate-pulse' 
              }`}
            >
              <Search size={20} strokeWidth={3} />
            </button>
          </div>

          {isSearchOpen && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Buscar ${activeCategory.toLowerCase()}...`}
                className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-sm focus:border-red-600 outline-none transition-all text-white placeholder:text-zinc-600"
                autoFocus
              />
            </div>
          )}

          <div className="h-px w-full bg-zinc-800/50"></div>

          {activeCategory === 'Pizza' && (
            <div className="flex gap-2 px-1 overflow-x-auto py-2 min-h-[50px] items-center">
              {(['Todas', 'Clássicas', 'Premium'] as const).map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPizzaSubCategory(sub);
                  }}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
                    pizzaSubCategory === sub
                    ? 'bg-white text-black border-white shadow-lg scale-105'
                    : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products
            .filter(p => {
              const matchesMainCategory = p.category === activeCategory;
              if (!matchesMainCategory) return false;
              if (activeCategory === 'Pizza') {
                if (pizzaSubCategory === 'Clássicas') return p.isPremium === false;
                if (pizzaSubCategory === 'Premium') return p.isPremium === true;
              }
              return true;
            })
            .sort((a, b) => (a.index ?? 99) - (b.index ?? 99))
            .map(product => (
              <div 
                key={product.id} 
                onClick={() => handleOpenModal(product)}
                className={`flex bg-zinc-950/70 border border-zinc-800 rounded-3xl overflow-hidden hover:border-red-600/50 transition duration-300 group cursor-pointer ${(!isOpen || !product.available) && 'opacity-70 grayscale-50'}`}
              >
                <div className="w-1/3 aspect-square overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className={`w-full h-full object-cover group-hover:scale-110 transition duration-500 ${(!product.available || product.stock === 0) ? 'opacity-30 grayscale' : ''}`} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {(!product.available || product.stock === 0) && (
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                      <div className="bg-red-600/90 text-white text-[10px] font-black uppercase py-1.5 px-3 rounded-md shadow-2xl border border-white/20 tracking-tighter">
                        Esgotado
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col justify-between w-2/3">
                  <div>
                    <h4 className={`font-bold text-lg leading-tight mb-1 transition uppercase ${(!product.available || product.stock === 0) ? 'text-zinc-600' : 'group-hover:text-red-500 text-white'}`}>
                      {product.name}
                    </h4>
                    <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

<div className="mt-2">
  {product.category === 'Pizza' ? (
    <div className="p-2 rounded-xl border border-white/30 bg-black/60 space-y-0.5 shadow-lg shadow-black/50">
      <div className="flex justify-between items-center text-[12px] sm:text-[13px] leading-none py-0.5">
        <span className="text-zinc-300 font-black uppercase tracking-tighter italic">
          Média <span className="text-[10px] opacity-80 font-medium"> (4 fatias)</span>
        </span>
        <span className="text-white font-black">R$ {product.priceM?.toFixed(2).replace('.', ',')}</span>
      </div>
      <div className="flex justify-between items-center text-[12px] sm:text-[13px] leading-none border-t border-white/10 pt-1 pb-0.5">
        <span className="text-zinc-300 font-black uppercase tracking-tighter italic">
          Grande <span className="text-[10px] opacity-80 font-medium"> (6 fatias)</span>
        </span>
        <span className="text-white font-black">R$ {product.priceG?.toFixed(2).replace('.', ',')}</span>
      </div>
      <div className="flex justify-between items-center text-[12px] sm:text-[13px] leading-none border-t border-white/10 pt-1 pb-0.5">
        <span className="text-zinc-300 font-black uppercase tracking-tighter italic">
          Gigante <span className="text-[10px] opacity-80 font-medium"> (8 fatias)</span>
        </span>
        <span className="text-white font-black">R$ {product.priceGG?.toFixed(2).replace('.', ',')}</span>
      </div>

      {/* BLOCO AJUSTADO: Aparece apenas se houver preço para 12 fatias */}
      {product.priceFA && (
        <div className="flex justify-between items-center text-[12px] sm:text-[13px] leading-none border-t border-white/10 pt-1 pb-0.5">
          <span className="text-zinc-300 font-black uppercase tracking-tighter italic">
            Família <span className="text-[10px] opacity-80 font-medium"> (12 fatias)</span>
          </span>
          <span className="text-white font-black">R$ {product.priceFA?.toFixed(2).replace('.', ',')}</span>
        </div>
      )}
    </div>
  ) : (
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-red-500 font-black text-xl">
                          R$ {product.priceFixed?.toFixed(2).replace('.', ',')}
                        </span>
                        <div className="p-1.5 bg-zinc-800 rounded-lg text-white border border-white/10">
                          <Plus size={18} strokeWidth={3} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Modal Section */}
      {selectedProduct && isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative h-40 sm:h-48 overflow-hidden bg-zinc-950">
              <img 
                src={selectedProduct.image} 
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500" 
                alt="Lado 1"
              />
              {halfProduct && (
                <img 
                  src={halfProduct.image} 
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-500 animate-in fade-in slide-in-from-right-10"
                  style={{ clipPath: 'inset(0 0 0 50%)' }} 
                  alt="Lado 2"
                />
              )}
              {halfProduct && <div className="absolute inset-y-0 left-1/2 w-px bg-white/20 shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10" />}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 bg-black/60 p-1.5 rounded-full hover:bg-red-600 transition z-20"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 max-h-[65vh] overflow-y-auto">
              <h3 className="text-xl font-black uppercase mb-1 leading-tight tracking-tighter">
                {halfProduct ? `1/2 ${selectedProduct.name} + 1/2 ${halfProduct.name}` : selectedProduct.name}
              </h3>

              {!halfProduct ? (
                <p className="text-zinc-400 text-xs mb-4 line-clamp-2">{selectedProduct.description}</p>
              ) : (
                <div className="mb-4 flex items-center gap-2 text-red-500">
                  <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest">Combinação Meio a Meio selecionada</span>
                </div>
              )}

              {selectedProduct.category === 'Bebida' && (
                <div className="bg-black border border-zinc-800 p-4 rounded-2xl text-center mb-4">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Valor Unitário</span>
                  <span className="text-2xl font-black text-white">R$ {selectedProduct.priceFixed?.toFixed(2)}</span>
                </div>
              )}

{selectedProduct.category === 'Pizza' && (
  <div className="space-y-6">
    {/* Cabeçalho com Toggle de Modo */}
    <div className="flex items-center justify-between">
      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Selecione o Tamanho</label>
      
      <div className="flex bg-black border border-zinc-800 p-1 rounded-xl">
        <button 
          onClick={() => setHalfProduct(null)}
          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${!halfProduct ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-600'}`}
        >
          Inteira
        </button>
        <button 
          onClick={() => {
            // Mantém a pizza atual nos dois lados ao ativar o modo
            if(!halfProduct) setHalfProduct(selectedProduct);
          }}
          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${halfProduct ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-600'}`}
        >
          Meio a Meio
        </button>
      </div>
    </div>

    {/* Grid de Tamanhos com Preços Dinâmicos */}
    <div className="grid grid-cols-2 gap-2">
      {(['Média', 'Grande', 'Gigante', 'Família (12)', 'Maracanã (24)'] as PizzaSize[]).map(sz => {
        const prices1 = {
          'Média': selectedProduct.priceM,
          'Grande': selectedProduct.priceG,
          'Gigante': selectedProduct.priceGG,
          'Família (12)': selectedProduct.priceFA,
          'Maracanã (24)': selectedProduct.priceMA
        };
        const prices2 = halfProduct ? {
          'Média': halfProduct.priceM,
          'Grande': halfProduct.priceG,
          'Gigante': halfProduct.priceGG,
          'Família (12)': halfProduct.priceFA,
          'Maracanã (24)': halfProduct.priceMA
        } : prices1;
        
        const currentPrice = Math.max(prices1[sz] || 0, prices2[sz] || 0);
        const isEnabled = selectedProduct.enabledSizes ? selectedProduct.enabledSizes.includes(sz) : !!prices1[sz];
        if (!isEnabled) return null;

        return (
          <button 
            key={sz} 
            onClick={() => setSize(sz)} 
            className={`py-3 rounded-xl text-[9px] font-bold transition flex flex-col items-center border-2 ${size === sz ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
          >
            <span className="uppercase tracking-widest">{sz.split(' ')[0]}</span>
            <span className={`text-[8px] opacity-70 mb-0.5 ${size === sz ? 'text-white' : 'text-zinc-500'}`}>
              {sz === 'Média' && '4 FATIAS'}
              {sz === 'Grande' && '6 FATIAS'}
              {sz === 'Gigante' && '8 FATIAS'}
              {sz === 'Família (12)' && '12 FATIAS'}
              {sz === 'Maracanã (24)' && '24 FATIAS'}
            </span>
            <span className="text-xs font-black italic">R$ {currentPrice.toFixed(2).replace('.', ',')}</span>
          </button>
        );
      })}
    </div>

    {/* Seleção do Segundo Sabor - Aparece quando Meio a Meio está ativo */}
    {halfProduct && (
      <div className="animate-in slide-in-from-top-2 duration-300">
        <label className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-2 block">Escolha o 2º Sabor</label>
        <div className="relative">
          <select 
            className="w-full bg-black border-2 border-red-600/30 p-3.5 rounded-xl outline-none focus:border-red-600 text-xs font-bold text-white uppercase appearance-none" 
            value={halfProduct.id}
            onChange={(e) => setHalfProduct(products.find(p => p.id === e.target.value) || null)}
          >
            {/* Texto ajustado conforme seu pedido */}
            <option value={selectedProduct.id}>🍕 Selecione a segunda parte</option>
            {products.filter(p => p.category === 'Pizza' && p.id !== selectedProduct.id && p.available).map(p => (
              <option key={p.id} value={p.id}>+ {p.name}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-red-500">
            <Pizza size={16} />
          </div>
        </div>
      </div>
    )}

    {/* Totalizador */}
    <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center shadow-inner">
      <div className="flex flex-col">
        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 italic">Total</span>
        {halfProduct && halfProduct.id !== selectedProduct.id && (
          <span className="text-[7px] text-red-500 font-bold uppercase">Prevalece valor do maior</span>
        )}
      </div>
      <span className="text-2xl font-black text-white italic">
        R$ {(() => {
          const p1 = selectedProduct;
          const p2 = halfProduct || p1;
          const v1 = { 'Média': p1.priceM, 'Grande': p1.priceG, 'Gigante': p1.priceGG, 'Família (12)': p1.priceFA, 'Maracanã (24)': p1.priceMA }[size] || 0;
          const v2 = { 'Média': p2.priceM, 'Grande': p2.priceG, 'Gigante': p2.priceGG, 'Família (12)': p2.priceFA, 'Maracanã (24)': p2.priceMA }[size] || 0;
          return Math.max(v1, v2).toFixed(2).replace('.', ',');
        })()}
      </span>
    </div>
  </div>
)}
<button onClick={handleAdd} className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-xl mt-6 transition flex items-center justify-center gap-2 uppercase text-xs tracking-widest shadow-xl shadow-red-600/20">
  ADICIONAR <Check size={18} />
</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuList;