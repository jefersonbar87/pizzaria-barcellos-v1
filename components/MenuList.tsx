import React, { useState } from 'react';
import { Product, CartItem, PizzaSize, Promotion } from '../types';
import { Plus, Check, Info, X, Lock, Flame, Truck, Pizza, CupSoda } from 'lucide-react';

interface MenuListProps {
  products: Product[];
  onAddToCart: (item: CartItem) => void;
  isOpen: boolean;
  promotions?: Promotion[];
}

const MenuList: React.FC<MenuListProps> = ({ products, onAddToCart, isOpen, promotions }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [size, setSize] = useState<PizzaSize>('Grande');
  const [halfProduct, setHalfProduct] = useState<Product | null>(null);
  
  // Variável de categorias e Estado para controlar a aba ativa
  const categories: ('Pizza' | 'Bebida')[] = ['Pizza', 'Bebida'];
  const [activeCategory, setActiveCategory] = useState<'Pizza' | 'Bebida'>('Pizza');
  // Adicione esta linha abaixo do activeCategory
  const [pizzaSubCategory, setPizzaSubCategory] = useState<'Todas' | 'Clássicas' | 'Premium'>('Todas');

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

  // --- PASSO 1: COLOQUE AQUI (ANTES DO RETURN) ---
  const refri2L = products.filter(p => p.category === 'Bebida' && p.name.toUpperCase().includes('2L'));
  const refri15L = products.filter(p => p.category === 'Bebida' && p.name.toUpperCase().includes('1,5L'));
  const refri600 = products.filter(p => p.category === 'Bebida' && p.name.toUpperCase().includes('600ML'));
  const refriLata = products.filter(p => p.category === 'Bebida' && (p.name.toUpperCase().includes('LATA') || p.name.toUpperCase().includes('350ML')));
  // -----------------------------------------------

  return (
    <div className="space-y-12">
      {/* Seção de Promoções Dinâmica */}
{/* Ajustado: Adicionado o "p" em promotions e o parâmetro na função de clique */}
{promotions && promotions.filter(p => p.active).length > 0 && (
  <section className="animate-in fade-in duration-700">
    <div className="flex items-center gap-4 mb-6">
      <h3 className="text-2xl font-black uppercase tracking-tighter border-l-4 border-orange-500 pl-4 flex items-center gap-2">
        <Flame className="text-orange-500" fill="currentColor" size={24} /> EM DESTAQUE
      </h3>
      <div className="h-px flex-grow bg-zinc-800"></div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {promotions.filter(p => p.active).map((promo) => (
        <div 
          key={promo.id || promo.title}
          onClick={() => handleAddPromotion(promo)} 
          className={`group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 p-1 cursor-pointer transition hover:scale-[1.02] active:scale-[0.98] ${!isOpen && 'opacity-70 grayscale'}`}
        >
          <div className="bg-zinc-900 rounded-[2.3rem] overflow-hidden flex flex-col">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={promo.image} 
                alt={promo.title} 
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
              
              {promo.freeDelivery && (
                <div className="absolute top-4 left-4 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
                  <Truck size={14} /> ENTREGA GRÁTIS
                </div>
              )}
            </div>

            <div className="p-8 flex flex-col justify-center">
              <div className="mb-4">
                <span className="text-orange-500 text-xs font-black uppercase tracking-[0.2em] mb-2 block">Oferta Especial</span>
                <h4 className="text-2xl font-black uppercase tracking-tighter leading-none mb-3 group-hover:text-orange-500 transition">
                  {promo.title}
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">
                  {promo.description}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 mt-auto">
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Apenas por</span>
                  <span className="text-3xl font-black text-white tracking-tighter">
                    R$ {promo.price.toFixed(2)}
                  </span>
                </div>
                <button className={`p-4 rounded-2xl shadow-xl transition active:scale-95 ${isOpen ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/20' : 'bg-zinc-800 cursor-not-allowed'}`}>
                  {isOpen ? <Plus size={24} className="text-white" strokeWidth={3} /> : <Lock size={24} className="text-zinc-500" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
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
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-black uppercase tracking-tighter border-l-4 border-red-600 pl-4">
              Nossas {activeCategory}s
            </h3>
            <div className="h-px flex-grow bg-zinc-800/50"></div>
          </div>

          {/* SUBCLASSE DE FILTROS AJUSTADA */}
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
              // 1. Filtro de Categoria Principal (Pizza ou Bebida)
              const matchesMainCategory = p.category === activeCategory;
              if (!matchesMainCategory) return false;
              
             // 2. NOVO: Filtro de Subcategoria para Pizzas
              if (activeCategory === 'Pizza') {
                if (pizzaSubCategory === 'Clássicas') return p.isPremium === false;
                if (pizzaSubCategory === 'Premium') return p.isPremium === true;
              }
              return true; // Se for "Todas" ou Bebidas mostra tudo
            }) // <--- Aqui termina o filtro
            .sort((a, b) => (a.index ?? 99) - (b.index ?? 99)) // <--- ADICIONE ESTA LINHA AQUI!
            .map(product => ( // <--- Aqui começa a mostrar na tela
              <div 
                key={product.id} 
                onClick={() => handleOpenModal(product)}
                className={`flex bg-zinc-950/70 border border-zinc-800 rounded-3xl overflow-hidden hover:border-red-600/50 transition duration-300 group cursor-pointer ${(!isOpen || !product.available) && 'opacity-70 grayscale-50'}`}
              >
                <div className="w-1/3 aspect-square overflow-hidden relative">
                  {/* IMAGEM: Escurece se estiver esgotado */}
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className={`w-full h-full object-cover group-hover:scale-110 transition duration-500 ${(!product.available || product.stock === 0) ? 'opacity-30 grayscale' : ''}`} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* SELO NOVO SABOR COM DATA AUTOMÁTICA */}
                  {(() => {
                    if (!product.createdAt) return null;
                    const [year, month, day] = product.createdAt.split('-').map(Number);
                    const dataCriacao = new Date(year, month - 1, day).getTime();
                    const agora = new Date();
                    const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()).getTime();
                    const dataLimite = new Date(2026, 3, 9, 23, 59, 59).getTime(); 
                    
                    if (hoje >= dataCriacao && hoje <= dataLimite) {
                      return (
                        <div className="absolute top-1.5 left-1.5 z-20 bg-amber-500 text-black text-[7px] sm:text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-lg border border-white/20 animate-pulse tracking-tighter">
                          ✨ Novo Sabor
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* AVISO CENTRALIZADO: Esgotado */}
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
                    {/* O NOME */}
                    <h4 className={`font-bold text-lg leading-tight mb-1 transition uppercase ${(!product.available || product.stock === 0) ? 'text-zinc-600' : 'group-hover:text-red-500 text-white'}`}>
                      {product.name}
                    </h4>
                    
                    <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    {/* AVISO DE ESTOQUE BAIXO */}
                    {product.stock !== undefined && product.stock > 0 && product.stock <= 3 && (
                      <div className="mt-2 flex items-center gap-1.5 animate-pulse">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
                        <span className="text-[10px] text-amber-500 font-black uppercase tracking-wider">
                          Apenas {product.stock} unidades!
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    <span className={`font-bold text-lg ${(!product.available || product.stock === 0) ? 'text-zinc-700' : 'text-red-500'}`}>
                      {product.category === 'Bebida' 
                        ? `R$ ${product.priceFixed?.toFixed(2).replace('.', ',')}` 
                        : `A partir de R$ ${product.priceM?.toFixed(2).replace('.', ',')}`}
                    </span>
                    
                    {/* BOTÃO ÚNICO E CORRIGIDO */}
                    <button 
                      className={`p-2 rounded-xl text-white shadow-lg transition active:scale-90 ${
                        (isOpen && product.available && (product.stock === undefined || product.stock > 0)) 
                        ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' 
                        : 'bg-zinc-800 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {(isOpen && product.available && (product.stock === undefined || product.stock > 0)) ? <Plus size={20} /> : <Lock size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

{/* Modal Section (Ajuste de tamanho compacto - Lógica mantida 100%) */}
      {selectedProduct && isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Imagem com altura reduzida: de h-48/64 para h-40/48 */}
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
              
              {halfProduct && (
                <div className="absolute inset-y-0 left-1/2 w-px bg-white/20 shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10" />
              )}

              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 bg-black/60 p-1.5 rounded-full hover:bg-red-600 transition z-20"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Padding reduzido de p-8 para p-5 e max-height ajustada */}
            <div className="p-5 max-h-[65vh] overflow-y-auto">
              <h3 className="text-xl font-black uppercase mb-1 leading-tight tracking-tighter">
                {halfProduct 
                  ? `1/2 ${selectedProduct.name} + 1/2 ${halfProduct.name}` 
                  : selectedProduct.name
                }
              </h3>

              {!halfProduct ? (
                <p className="text-zinc-400 text-xs mb-4 animate-in fade-in duration-500 line-clamp-2">
                  {selectedProduct.description}
                </p>
              ) : (
                <div className="mb-4 flex items-center gap-2 text-red-500 animate-in slide-in-from-left-2">
                  <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Combinação Meio a Meio selecionada
                  </span>
                </div>
              )}

              {selectedProduct.category === 'Bebida' && (
                <div className="bg-black border border-zinc-800 p-4 rounded-2xl text-center mb-4">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Valor Unitário</span>
                  <span className="text-2xl font-black text-white">R$ {selectedProduct.priceFixed?.toFixed(2)}</span>
                </div>
              )}

              {selectedProduct.category === 'Pizza' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Selecione o Tamanho</label>
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
        className={`py-2 rounded-xl text-[9px] font-bold transition flex flex-col items-center border-2 ${size === sz ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
      >
        <span className="uppercase">{sz.split(' ')[0]}</span>
        
        {/* AQUI ESTÁ A MUDANÇA: Legenda de fatias dinâmica */}
        <span className={`text-[8px] opacity-70 mb-0.5 ${size === sz ? 'text-white' : 'text-zinc-500'}`}>
          {sz === 'Média' && '4 FATIAS'}
          {sz === 'Grande' && '6 FATIAS'}
          {sz === 'Gigante' && '8 FATIAS'}
          {sz === 'Família (12)' && '12 FATIAS'}
          {sz === 'Maracanã (24)' && '24 FATIAS'}
        </span>

        <span className="text-xs font-black">R$ {currentPrice.toFixed(2)}</span>
      </button>
    );
  })}
</div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Deseja Meio a Meio?</label>
                    <select 
                      className="w-full bg-black border border-zinc-800 p-3 rounded-xl outline-none focus:border-red-600 transition uppercase text-xs font-bold text-white appearance-none"
                      onChange={(e) => {
                        const found = products.find(p => p.id === e.target.value);
                        setHalfProduct(found || null);
                      }}
                    >
                      <option value="">🍕 OUTRO SABOR?</option>
                      {products.filter(p => p.category === 'Pizza' && p.id !== selectedProduct.id && p.available).map(p => (
                        <option key={p.id} value={p.id}>+ {p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-red-600/10 border border-red-600/20 p-3 rounded-xl flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-red-500">Total</span>
                    <span className="text-xl font-black text-white">
                      R$ {(() => {
                        const p1 = selectedProduct;
                        const p2 = halfProduct || p1;
                        const v1 = { 'Média': p1.priceM, 'Grande': p1.priceG, 'Gigante': p1.priceGG, 'Família (12)': p1.priceFA, 'Maracanã (24)': p1.priceMA }[size] || 0;
                        const v2 = { 'Média': p2.priceM, 'Grande': p2.priceG, 'Gigante': p2.priceGG, 'Família (12)': p2.priceFA, 'Maracanã (24)': p2.priceMA }[size] || 0;
                        return Math.max(v1, v2).toFixed(2);
                      })()}
                    </span>
                  </div>
                </div>
              )}

              <button 
                onClick={handleAdd}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-xl mt-6 active:scale-[0.98] transition flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
              >
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