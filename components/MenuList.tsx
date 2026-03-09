import React, { useState } from 'react';
import { Product, CartItem, PizzaSize, Promotion } from '../types';
import { Plus, Check, Info, X, Lock, Flame, Truck, Pizza, CupSoda } from 'lucide-react';

interface MenuListProps {
  products: Product[];
  onAddToCart: (item: CartItem) => void;
  isOpen: boolean;
  promotion?: Promotion;
}

const MenuList: React.FC<MenuListProps> = ({ products, onAddToCart, isOpen, promotion }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [size, setSize] = useState<PizzaSize>('Grande');
  const [halfProduct, setHalfProduct] = useState<Product | null>(null);
  
  // Variável de categorias e Estado para controlar a aba ativa
  const categories: ('Pizza' | 'Bebida')[] = ['Pizza', 'Bebida'];
  const [activeCategory, setActiveCategory] = useState<'Pizza' | 'Bebida'>('Pizza');

  const handleOpenModal = (p: Product) => {
    if (!isOpen) return;
    setSelectedProduct(p);
    setHalfProduct(null);
    setSize('Grande');
  };

  const handleAddPromotion = () => {
    if (!promotion || !isOpen) return;
    
    onAddToCart({
      id: `promo-${Date.now()}`,
      product1: {
        id: 'promo',
        name: promotion.title,
        description: promotion.description,
        image: promotion.image,
        category: 'Pizza',
        available: true
      } as Product,
      quantity: 1,
      totalPrice: promotion.price,
      isPromotion: true
    });
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

    setSelectedProduct(null);
  };

  return (
    <div className="space-y-12">
      {/* Promotion Section */}
      {promotion?.active && (
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-2xl font-black uppercase tracking-tighter border-l-4 border-orange-500 pl-4 flex items-center gap-2">
              <Flame className="text-orange-500" fill="currentColor" size={24} /> EM DESTAQUE
            </h3>
            <div className="h-px flex-grow bg-zinc-800"></div>
          </div>
          
          <div 
            onClick={handleAddPromotion}
            className={`group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 p-1 cursor-pointer transition hover:scale-[1.01] active:scale-[0.99] ${!isOpen && 'opacity-70 grayscale'}`}
          >
            <div className="bg-zinc-900 rounded-[2.3rem] overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-1/2 aspect-square md:aspect-auto h-64 md:h-80 overflow-hidden relative">
                <img src={promotion.image} alt={promotion.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                {promotion.freeDelivery && (
                  <div className="absolute top-4 left-4 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
                    <Truck size={14} /> ENTREGA GRÁTIS
                  </div>
                )}
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <div className="mb-4">
                  <span className="text-orange-500 text-xs font-black uppercase tracking-[0.2em] mb-2 block">Oferta Especial</span>
                  <h4 className="text-3xl font-black uppercase tracking-tighter leading-none mb-3 group-hover:text-orange-500 transition">{promotion.title}</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">{promotion.description}</p>
                </div>
                <div className="flex items-center justify-between gap-4 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Apenas por</span>
                    <span className="text-4xl font-black text-white tracking-tighter">R$ {promotion.price.toFixed(2)}</span>
                  </div>
                  <button className={`p-5 rounded-2xl shadow-xl transition active:scale-95 ${isOpen ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/20' : 'bg-zinc-800 cursor-not-allowed'}`}>
                    {isOpen ? <Plus size={28} className="text-white" strokeWidth={3} /> : <Lock size={28} className="text-zinc-500" />}
                  </button>
                </div>
              </div>
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
        <div className="flex items-center gap-4 mb-8">
          <h3 className="text-2xl font-black uppercase tracking-tighter border-l-4 border-red-600 pl-4">
            Nossas {activeCategory}s
          </h3>
          <div className="h-px flex-grow bg-zinc-800/50"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products
            .filter(p => p.category === activeCategory)
            .map(product => (
              <div 
                key={product.id} 
                onClick={() => handleOpenModal(product)}
                className={`flex bg-zinc-950/70 border border-zinc-800 rounded-3xl overflow-hidden hover:border-red-600/50 transition duration-300 group cursor-pointer ${(!isOpen || !product.available) && 'opacity-70 grayscale-50'}`}
              >
                <div className="w-1/3 aspect-square overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-5 flex flex-col justify-between w-2/3">
                  <div>
                    <h4 className="font-bold text-lg leading-tight mb-1 group-hover:text-red-500 transition uppercase">{product.name}</h4>
                    <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">{product.description}</p>
                    {!product.available && <span className="text-[10px] bg-red-600/20 text-red-500 px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block">Indisponível</span>}
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <span className="text-red-500 font-bold text-lg">
                    {product.category === 'Bebida' 
                    ? `R$ ${product.priceFixed?.toFixed(2)}` 
                    : `A partir de R$ ${product.priceM?.toFixed(2)}`}
                  </span>
                    <button className={`p-2 rounded-xl text-white shadow-lg transition active:scale-90 ${isOpen ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : 'bg-zinc-800 cursor-not-allowed'}`}>
                      {isOpen ? <Plus size={20} /> : <Lock size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Modal Section (Mantenha o restante como está para não quebrar a lógica) */}
      {selectedProduct && isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Container da Imagem da Pizza */}
<div className="relative h-48 sm:h-64 overflow-hidden bg-zinc-950">
  {/* PIZZA 1 (Lado Esquerdo ou Inteira) */}
  <img 
    src={selectedProduct.image} 
    className="absolute inset-0 w-full h-full object-cover transition-all duration-500" 
    alt="Lado 1"
  />

  {/* PIZZA 2 (Aparece apenas se houver Meio a Meio selecionado) */}
  {halfProduct && (
    <img 
      src={halfProduct.image} 
      className="absolute inset-0 w-full h-full object-cover transition-all duration-500 animate-in fade-in slide-in-from-right-10"
      style={{ clipPath: 'inset(0 0 0 50%)' }} // Este é o segredo: corta metade da imagem!
      alt="Lado 2"
    />
  )}
  
  {/* Divisória sutil no meio para dar realismo */}
  {halfProduct && (
    <div className="absolute inset-y-0 left-1/2 w-px bg-white/20 shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10" />
  )}

  <button 
    onClick={() => setSelectedProduct(null)}
    className="absolute top-4 right-4 bg-black/60 p-2 rounded-full hover:bg-red-600 transition z-20"
  >
    <X size={24} />
  </button>
</div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
  {/* TÍTULO DINÂMICO: Se tiver meia a meia, ele monta o nome fracionado */}
  <h3 className="text-2xl font-black uppercase mb-2 leading-tight tracking-tighter">
    {halfProduct 
      ? `1/2 ${selectedProduct.name} + 1/2 ${halfProduct.name}` 
      : selectedProduct.name
    }
  </h3>

  {/* DESCRIÇÃO ESTRATÉGICA: Só aparece se for pizza inteira ou bebida */}
  {!halfProduct ? (
    <p className="text-zinc-400 text-sm mb-6 animate-in fade-in duration-500">
      {selectedProduct.description}
    </p>
  ) : (
    /* Aviso visual discreto que substitui a descrição na meia a meia */
    <div className="mb-6 flex items-center gap-2 text-red-500 animate-in slide-in-from-left-2">
      <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse"></div>
      <span className="text-[10px] font-black uppercase tracking-widest">
        Combinação Meio a Meio selecionada
      </span>
    </div>
  )}

  {selectedProduct.category === 'Bebida' && (
                <div className="bg-black border-2 border-zinc-800 p-6 rounded-3xl text-center mb-6">
                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest block mb-1">Valor Unitário</span>
                  <span className="text-3xl font-black text-white">R$ {selectedProduct.priceFixed?.toFixed(2)}</span>
                </div>
              )}

              {selectedProduct.category === 'Pizza' && (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 block">Selecione o Tamanho</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(['Média', 'Grande', 'Gigante', 'Família (12)', 'Maracanã (24)'] as PizzaSize[]).map(sz => {
                        // Preços da primeira pizza
                        const prices1 = {
                          'Média': selectedProduct.priceM,
                          'Grande': selectedProduct.priceG,
                          'Gigante': selectedProduct.priceGG,
                          'Família (12)': selectedProduct.priceFA,
                          'Maracanã (24)': selectedProduct.priceMA
                        };
                        
                        // Preços da segunda pizza (se houver)
                        const prices2 = halfProduct ? {
                          'Média': halfProduct.priceM,
                          'Grande': halfProduct.priceG,
                          'Gigante': halfProduct.priceGG,
                          'Família (12)': halfProduct.priceFA,
                          'Maracanã (24)': halfProduct.priceMA
                        } : prices1;

                        // Pega sempre o maior valor entre as duas para o tamanho atual
                        const currentPrice = Math.max(prices1[sz] || 0, prices2[sz] || 0);

                        const isEnabled = selectedProduct.enabledSizes ? selectedProduct.enabledSizes.includes(sz) : !!prices1[sz];
                        if (!isEnabled) return null;

                        return (
                          <button 
                            key={sz}
                            onClick={() => setSize(sz)}
                            className={`py-3 rounded-2xl text-[10px] font-bold transition flex flex-col items-center gap-1 border-2 ${size === sz ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                          >
                            <span className="uppercase">{sz.split(' ')[0]}</span>
                            <span className="opacity-70 font-medium text-[9px]">
                              {sz === 'Média' ? '4 FATIAS' : sz === 'Grande' ? '6 FATIAS' : sz === 'Gigante' ? '8 FATIAS' : sz === 'Família (12)' ? '12 FATIAS' : '24 FATIAS'}
                            </span>
                            {/* O PREÇO AQUI JÁ ATUALIZA SE FOR MEIA A MEIA */}
                            <span className="text-xs mt-1 font-black">R$ {currentPrice.toFixed(2)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 block">Deseja Meio a Meio?</label>
                    <select 
                      className="w-full bg-black border-2 border-zinc-800 p-4 rounded-2xl outline-none focus:border-red-600 transition uppercase text-sm font-bold text-white appearance-none"
                      onChange={(e) => {
                        const found = products.find(p => p.id === e.target.value);
                        setHalfProduct(found || null);
                      }}
                    >
                      <option value="">🍕 ESCOLHA AQUI O OUTRO SABOR</option>
                      {products.filter(p => p.category === 'Pizza' && p.id !== selectedProduct.id && p.available).map(p => (
                        <option key={p.id} value={p.id}>+ {p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* TELÃO DE PREÇO FINAL NO MODAL */}
                  <div className="bg-red-600/10 border border-red-600/20 p-4 rounded-2xl flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-red-500">Total desta Pizza</span>
                    <span className="text-2xl font-black text-white">
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
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl mt-8 shadow-xl shadow-red-600/20 active:scale-[0.98] transition flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                ADICIONAR AO CARRINHO <Check size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuList;