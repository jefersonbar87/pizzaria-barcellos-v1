import React, { useState, useRef, useEffect } from 'react'; // Adicionado useEffect
import { Product, Order, AppSettings, PizzaSize, Promotion } from '../types';
import { LayoutDashboard, ShoppingBag, Settings, Power, Printer, CheckCircle, Map, Trash2, Edit3, Plus, LogOut, Save, X, Image as ImageIcon, Upload, Ban, Eye, EyeOff, MessageCircle, Instagram, Maximize, Flame, Truck, PhoneCall, Loader2, Lock, ListPlus, Clock, Check, Octagon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  settings: AppSettings;
  onSaveProduct: (p: Product) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onSaveSettings: (s: AppSettings) => Promise<void>;
  onLogout: () => void;
  onStartOrdering: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, orders, settings, onSaveProduct, onDeleteProduct, onSaveSettings, onLogout, onStartOrdering }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'settings'>('orders');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newNeighborhood, setNewNeighborhood] = useState({ name: '', fee: 0 });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [enabledSizes, setEnabledSizes] = useState<PizzaSize[]>(['Média', 'Grande', 'Gigante']);
  const [isSaving, setIsSaving] = useState(false);
  const [showOnlyToday, setShowOnlyToday] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const promoImgInputRef = useRef<HTMLInputElement>(null);

  // --- ESCUTA EM TEMPO REAL ---
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'pizzaria_orders'
        },
        () => {
          // Atualização silenciosa via props
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // --- LÓGICA DE FILTRO POR DATA (HOJE) ---
  const isToday = (dateString: string) => {
    const orderDate = new Date(dateString);
    const today = new Date();
    return orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear();
  };

  const filteredOrders = showOnlyToday 
    ? orders.filter(order => isToday(order.createdAt))
    : orders;

  // --- 1. IMPRESSÃO EM NEGRITO TOTAL ---
  const handlePrintTicket = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const subtotal = order.items.reduce((acc, i) => acc + i.totalPrice, 0);
    const deliveryFee = order.total - subtotal;

    const itemsHtml = order.items.map(item => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-weight: 900;">
        <span>${item.quantity}x ${item.product2 ? `${item.product1.name}/${item.product2.name}` : item.product1.name} ${item.size ? `(${item.size})` : ''}</span>
        <span>R$ ${item.totalPrice.toFixed(2)}</span>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>CUPOM_BARCELLOS_${String(order.id)}</title>
          <style>
            @page { size: 80mm auto; margin: 0; }
            body { font-family: 'Courier New', monospace; width: 77mm; padding: 5px; font-size: 14px; color: #000; font-weight: 900 !important; }
            * { font-weight: 900 !important; }
            .line { border-bottom: 2px dashed #000; margin: 8px 0; }
            .center { text-align: center; }
            .total { font-size: 19px; text-align: right; margin-top: 10px; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="center" style="font-size: 16px;">PIZZARIA BARCELLOS</div>
          <div class="center">PEDIDO #${String(order.id)}</div>
          <div class="center">${new Date(order.createdAt).toLocaleString('pt-BR')}</div>
          <div class="line"></div>
          <div>CLIENTE: ${order.customerName}</div>
          <div>TEL: ${order.phone}</div>
          <div>TIPO: ${order.orderType || 'Entrega'}</div>
          <div>ENDEREÇO: ${order.address}</div>
          <div class="line"></div>
          <div>ITENS:</div>
          ${itemsHtml}
          <div class="line"></div>
          <div style="display: flex; justify-content: space-between; font-size: 13px;">
            <span>SUBTOTAL:</span>
            <span>R$ ${subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px;">
            <span>TAXA ENTREGA:</span>
            <span>${deliveryFee <= 0 ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2)}`}</span>
          </div>
          <div class="total" style="display: flex; justify-content: space-between; border-top: 1px solid #000; padding-top: 5px;">
            <span>TOTAL:</span>
            <span>R$ ${order.total.toFixed(2)}</span>
          </div>
          <div>PAGAMENTO: ${order.paymentMethod}</div>
          <div class="line"></div>
          <div class="center">PRODUZINDO QUALIDADE COM CARINHO</div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // --- 2. UPDATE STATUS COM WHATSAPP AUTOMÁTICO ---
  const handleUpdateStatus = async (order: Order, newStatus: string) => {
    if ((order.status as string) === 'Finalizado' || (order.status as string) === 'Cancelado') return;

    try {
      const { error } = await supabase.from('pizzaria_orders').update({ status: newStatus }).eq('id', order.id);
      if (error) throw error;

      let msg = "";
      if (newStatus === "Preparando") msg = "Olá! Seu pedido da Pizzaria Barcellos já está em preparação! 🍕🔥";
      if (newStatus === "Saiu para Entrega") msg = "Boa notícia! Seu pedido saiu para entrega e logo estará aí! 🛵💨";
      if (newStatus === "Finalizado") msg = "Seu pedido foi concluído. Bom apetite! ❤️";

      if (msg) {
        const cleanPhone = order.phone.replace(/\D/g, "");
        const finalPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
        window.open(`https://api.whatsapp.com/send?phone=${finalPhone}&text=${encodeURIComponent(msg)}`, '_blank');
      }
    } catch (err) {
      alert("Erro ao atualizar status");
    }
  };

  // --- 3. CANCELAR PEDIDO ---
  const handleCancelOrder = async (id: any) => {
    if (window.confirm("🚨 DESEJA REALMENTE CANCELAR ESTE PEDIDO?")) {
      await supabase.from('pizzaria_orders').update({ status: 'Cancelado' as any }).eq('id', id);
    }
  };

  // --- 4. FUNÇÕES DE DISPONIBILIDADE ---
  const handleToggleSoldOut = async (product: Product) => {
    await onSaveProduct({ ...product, available: !product.available });
  };

  const handleToggleAvailability = async (product: Product) => {
    await onSaveProduct({ ...product, available: !product.available });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setPreview: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSizeToggle = (size: PizzaSize) => {
    setEnabledSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const handleSaveProductForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const category = formData.get('category') as 'Pizza' | 'Bebida';
    
    const productData: Product = {
      id: editingProduct?.id || Math.random().toString(36).substr(2, 9),
      name: (formData.get('name') as string).toUpperCase(),
      description: formData.get('description') as string,
      image: previewImage || editingProduct?.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
      category: category,
      available: editingProduct ? editingProduct.available : true,
      enabledSizes: category === 'Pizza' ? enabledSizes : undefined,
      priceM: enabledSizes.includes('Média') ? Number(formData.get('priceM')) : undefined,
      priceG: enabledSizes.includes('Grande') ? Number(formData.get('priceG')) : undefined,
      priceGG: enabledSizes.includes('Gigante') ? Number(formData.get('priceGG')) : undefined,
      priceFA: enabledSizes.includes('Família (12)') ? Number(formData.get('priceFA')) : undefined,
      priceMA: enabledSizes.includes('Maracanã (24)') ? Number(formData.get('priceMA')) : undefined,
      priceFixed: Number(formData.get('priceFixed')) || undefined
    };

    await onSaveProduct(productData);
    setIsSaving(false);
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setPreviewImage(null);
  };

  const handlePromotionChange = async (field: keyof Promotion, value: any) => {
    const newSettings = {
      ...settings,
      promotion: { ...settings.promotion, [field]: value }
    };
    await onSaveSettings(newSettings);
  };

  const handleUpdateSetting = async (field: keyof AppSettings, value: any) => {
    await onSaveSettings({ ...settings, [field]: value });
  };

  const addNeighborhood = async () => {
    if (!newNeighborhood.name) return;
    // Adicionado cast para 'any' para evitar erro de propriedade inexistente no tipo
    const updatedNeighborhoods = [...settings.neighborhoods, { ...newNeighborhood, name: newNeighborhood.name.toUpperCase(), active: true } as any];
    await onSaveSettings({ ...settings, neighborhoods: updatedNeighborhoods });
    setNewNeighborhood({ name: '', fee: 0 });
  };

  const toggleNeighborhoodActive = async (name: string) => {
    // Usando cast para 'any' para manipular a propriedade 'active' que o TS não reconhece no tipo original
    const updated = settings.neighborhoods.map((n: any) => 
      n.name === name ? { ...n, active: n.active === undefined ? false : !n.active } : n
    );
    await onSaveSettings({ ...settings, neighborhoods: updated });
  };

  const removeNeighborhood = async (name: string) => {
    const updated = settings.neighborhoods.filter(n => n.name !== name);
    await onSaveSettings({ ...settings, neighborhoods: updated });
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      <aside className="w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col hidden lg:flex">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-[#1B431D] rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border border-white/5">B</div>
            <div>
              <span className="font-black tracking-tighter uppercase text-sm block">Barcellos</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Painel Cloud</span>
            </div>
          </div>
          <nav className="space-y-2">
            {[
              { id: 'orders', icon: <ShoppingBag size={20} />, label: 'Gestão de Pedidos' },
              { id: 'menu', icon: <LayoutDashboard size={20} />, label: 'Editar Cardápio' },
              { id: 'settings', icon: <Settings size={20} />, label: 'Configurações' },
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-bold text-sm uppercase tracking-tight ${activeTab === item.id ? 'bg-[#1B431D] text-white shadow-2xl shadow-green-900/20' : 'text-zinc-500 hover:bg-zinc-800'}`}
              >
                {item.icon} {item.label}
              </button>
            ))}

            <div className="pt-4">
              <button 
                onClick={() => setShowOnlyToday(!showOnlyToday)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-bold text-sm uppercase tracking-tight border-2 ${showOnlyToday ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'border-zinc-800 text-zinc-500 hover:border-orange-600/50'}`}
              >
                <Clock size={20} /> {showOnlyToday ? 'Turno Ativo' : 'Iniciar Turno'}
              </button>
              {showOnlyToday && <p className="text-[9px] text-orange-500 font-black uppercase text-center mt-2 animate-pulse">Exibindo apenas hoje</p>}
            </div>
            
            <div className="pt-8 border-t border-zinc-800 mt-8">
              <button 
                onClick={onStartOrdering}
                className="w-full flex items-center gap-4 p-5 rounded-2xl transition-all bg-green-600 hover:bg-green-700 text-white font-black shadow-xl shadow-green-600/20 uppercase text-xs tracking-widest"
              >
                <PhoneCall size={20} /> Novo Pedido
              </button>
            </div>
          </nav>
        </div>
        <div className="mt-auto p-8 space-y-4">
          <button 
            onClick={() => handleUpdateSetting('isOpen', !settings.isOpen)}
            className={`w-full p-4 rounded-2xl border-2 flex items-center justify-center gap-3 font-black transition-all uppercase text-xs tracking-tighter ${settings.isOpen ? 'border-green-600 text-green-600 bg-green-600/5' : 'border-red-600 text-red-600 bg-red-600/5'}`}
          >
            <Power size={18} /> {settings.isOpen ? 'Loja Aberta' : 'Loja Fechada'}
          </button>
          <button onClick={onLogout} className="w-full p-4 text-zinc-600 hover:text-white flex items-center justify-center gap-3 font-bold transition-all uppercase text-xs">
            <LogOut size={18} /> Sair do Painel
          </button>
        </div>
      </aside>

      <main className="flex-grow p-10 overflow-y-auto bg-black/40">
        <header className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            {activeTab === 'orders' ? (showOnlyToday ? 'Pedidos de Hoje' : 'Pedidos Ativos') : activeTab === 'menu' ? 'Gestão de Itens' : 'Configurações do Sistema'}
          </h2>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div> Conectado ao Supabase
          </div>
        </header>

        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {filteredOrders.length === 0 ? (
              <div className="col-span-2 text-center py-32 bg-zinc-900/30 rounded-[3rem] border border-zinc-800/50 text-zinc-600 font-black uppercase tracking-[0.2em]">
                {showOnlyToday ? 'Nenhum pedido hoje...' : 'Aguardando primeiro pedido...'}
              </div>
            ) : (
              filteredOrders.map(order => {
                const isLocked = (order.status as string) === 'Finalizado' || (order.status as string) === 'Cancelado';

                return (
                  <div key={order.id} className={`relative bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-8 flex flex-col gap-6 shadow-2xl backdrop-blur-sm transition-all ${isLocked ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                    
                    {(order.status as string) === 'Finalizado' && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-[6px] border-green-600 text-green-600 px-10 py-3 font-black text-5xl rounded-2xl z-20 bg-black/80 backdrop-blur-md pointer-events-none uppercase tracking-[0.2em] shadow-2xl">Concluído</div>
                    )}
                    {(order.status as string) === 'Cancelado' && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-[6px] border-red-600 text-red-600 px-10 py-3 font-black text-5xl rounded-2xl z-20 bg-black/80 backdrop-blur-md pointer-events-none uppercase tracking-[0.2em] shadow-2xl">Cancelado</div>
                    )}

                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-red-500 text-xs font-black uppercase tracking-widest">#{String(order.id)}</span>
                            <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${order.orderType === 'Retirada' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'}`}>{order.orderType || 'Entrega'}</span>
                            <span className="text-zinc-500 text-[10px] font-bold uppercase">{new Date(order.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <h4 className="text-2xl font-black uppercase tracking-tight">{order.customerName}</h4>
                        <p className="text-zinc-400 text-sm font-medium">{order.phone}</p>
                      </div>

                      {isLocked ? (
                        <div className="bg-zinc-800 p-3 rounded-xl text-zinc-500 shadow-inner"><Lock size={20} /></div>
                      ) : (
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order, e.target.value)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border transition-all ${order.status === 'Pendente' ? 'bg-yellow-600/10 text-yellow-600 border-yellow-600/50' : order.status === 'Preparando' ? 'bg-blue-600/10 text-blue-600 border-blue-600/50' : order.status === 'Finalizado' ? 'bg-green-600/10 text-green-600 border-green-600/50' : order.status === 'Saiu para Entrega' ? 'bg-orange-600/10 text-orange-600 border-orange-600/50' : 'bg-orange-600/10 text-orange-600 border-orange-600/50'}`}
                        >
                          <option value="Pendente">Pendente</option>
                          <option value="Preparando">Preparando</option>
                          <option value="Saiu para Entrega">Em Rota</option>
                          <option value="Finalizado">Concluir Pedido</option>
                        </select>
                      )}
                    </div>
                    
                    <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800 space-y-3 font-bold">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-zinc-300">
                            <span className="text-red-600 font-black mr-2">{item.quantity}x</span>
                            {item.product2 ? `${item.product1.name} / ${item.product2.name}` : item.product1.name}
                            {item.size && <span className="text-[10px] text-zinc-500 ml-2 uppercase">({item.size})</span>}
                          </span>
                          <span className="text-white font-black">R$ {item.totalPrice.toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="pt-4 border-t border-zinc-800 flex flex-col gap-1">
                          <span className="text-[9px] font-black uppercase text-zinc-500">Endereço:</span>
                          <span className="text-[11px] text-zinc-300">{order.address}</span>
                      </div>
                      <div className="pt-4 border-t border-zinc-800 flex justify-between">
                          <span className="text-[10px] font-black uppercase text-zinc-500">Total Pago</span>
                          <span className="text-xl font-black text-green-500">R$ {order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <button onClick={() => handlePrintTicket(order)} className="flex items-center justify-center gap-2 p-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-black uppercase text-[10px] transition-all"><Printer size={16}/> Cupom (Negrito)</button>
                        
                        {!isLocked ? (
                          <button 
                            onClick={() => handleCancelOrder(order.id)} 
                            className="flex items-center justify-center gap-2 p-4 bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl font-black uppercase text-[10px] transition-all"
                          >
                            <Ban size={16}/> Cancelar Pedido
                          </button>
                        ) : (
                          <button 
                            onClick={async () => { if(confirm('Apagar permanentemente do histórico?')) await supabase.from('pizzaria_orders').delete().eq('id', order.id) }} 
                            className="flex items-center justify-center gap-2 p-4 bg-zinc-800/30 text-zinc-600 hover:text-red-500 rounded-2xl font-black uppercase text-[10px] transition-all"
                          >
                            <Trash2 size={16}/> Excluir Registro
                          </button>
                        )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-12">
            <div className="flex flex-col items-end gap-4">
              <button 
                onClick={() => { 
                  setEditingProduct(null); 
                  setPreviewImage(null); 
                  setEnabledSizes(['Média', 'Grande', 'Gigante']);
                  setIsProductModalOpen(true); 
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-black py-4 px-10 rounded-2xl flex items-center gap-3 shadow-2xl transition-all uppercase tracking-widest text-xs"
              >
                <Plus size={22} /> Novo Produto
              </button>
              
              <button 
                onClick={() => setIsCategoryModalOpen(true)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-black py-3 px-8 rounded-2xl flex items-center gap-3 transition-all uppercase tracking-widest text-[10px] border border-white/5 shadow-lg"
              >
                <ListPlus size={18} /> Nova Categoria
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
              {products.map(product => (
                <div key={product.id} className={`bg-zinc-900 border ${!product.available ? 'border-red-600 shadow-red-600/20' : 'border-zinc-800'} rounded-[2rem] overflow-hidden shadow-2xl group flex flex-col relative`}>
                  <div className="h-48 relative overflow-hidden">
                    <img src={product.image} className={`w-full h-full object-cover transition duration-500 group-hover:scale-110 ${!product.available && 'grayscale opacity-50'}`} alt={product.name} />
                    {!product.available && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <span className="bg-red-600 text-white font-black text-[10px] px-4 py-2 rounded-full uppercase tracking-widest shadow-2xl ring-4 ring-black/50">Esgotado</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-black uppercase tracking-tight text-lg">{product.name}</h4>
                      <span className="bg-zinc-800 px-3 py-1 rounded-full text-[9px] font-black uppercase text-zinc-400">{product.category}</span>
                    </div>
                    <div className="mt-auto flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleToggleAvailability(product)}
                          className={`py-3 rounded-xl text-[9px] font-black transition-all border ${!product.available ? 'bg-red-600 text-white border-red-600' : 'bg-zinc-800 border-zinc-700 hover:bg-red-600 hover:text-white'}`}
                        >
                          SUSPENDER
                        </button>
                        <button 
                          onClick={() => handleToggleSoldOut(product)}
                          className={`py-3 rounded-xl text-[9px] font-black transition-all border ${!product.available ? 'bg-red-600 text-white border-red-600' : 'bg-zinc-800 border-zinc-700 hover:bg-red-600 hover:text-white'}`}
                        >
                          ESGOTADO
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => { 
                            setEditingProduct(product); 
                            setPreviewImage(product.image); 
                            setEnabledSizes(product.enabledSizes || []);
                            setIsProductModalOpen(true); 
                          }}
                          className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition flex items-center justify-center"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={async () => {
                             if(confirm('Apagar do cardápio permanentemente?')) await onDeleteProduct(product.id);
                          }}
                          className="p-3 bg-zinc-800 rounded-xl hover:bg-red-600 transition flex items-center justify-center"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-10">
              <section className="bg-zinc-900/50 p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-orange-500"><Flame size={24} /> Promoção de Destaque</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-black rounded-2xl border border-zinc-800">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Status do Destaque</span>
                    <button 
                      onClick={() => handlePromotionChange('active', !settings.promotion.active)}
                      className={`w-14 h-7 rounded-full transition-all relative ${settings.promotion.active ? 'bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-zinc-800'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${settings.promotion.active ? 'left-8' : 'left-1'}`}></div>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <input 
                      type="text" 
                      placeholder="Título da Promo"
                      value={settings.promotion.title} 
                      onChange={e => handlePromotionChange('title', e.target.value.toUpperCase())} 
                      className="w-full bg-black border border-zinc-800 p-5 rounded-2xl outline-none focus:border-orange-500 transition font-black uppercase text-sm" 
                    />
                    <textarea 
                      placeholder="Descrição curta do combo"
                      value={settings.promotion.description} 
                      onChange={e => handlePromotionChange('description', e.target.value)} 
                      className="w-full bg-black border border-zinc-800 p-5 rounded-2xl outline-none focus:border-orange-500 transition text-sm resize-none h-24 font-medium" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="number" 
                      step="0.01" 
                      value={settings.promotion.price} 
                      onChange={e => handlePromotionChange('price', Number(e.target.value))} 
                      className="w-full bg-black border border-zinc-800 p-5 rounded-2xl outline-none focus:border-orange-500 transition font-black text-lg" 
                    />
                    <button 
                      onClick={() => handlePromotionChange('freeDelivery', !settings.promotion.freeDelivery)}
                      className={`flex items-center justify-center gap-2 p-5 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${settings.promotion.freeDelivery ? 'bg-green-600/10 border-green-600 text-green-500 shadow-lg shadow-green-600/10' : 'bg-black border-zinc-800 text-zinc-500'}`}
                    >
                      <Truck size={18} /> {settings.promotion.freeDelivery ? 'Frete Grátis' : 'Frete Pago'}
                    </button>
                  </div>
                  <div>
                    <div onClick={() => promoImgInputRef.current?.click()} className="aspect-square w-full bg-black border-2 border-dashed border-zinc-800 rounded-[2rem] overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition group relative">
                      {settings.promotion.image ? <img src={settings.promotion.image} className="w-full h-full object-cover" alt="Promo" /> : (
                        <div className="flex flex-col items-center text-zinc-600 group-hover:text-orange-500 transition uppercase text-[10px] font-black tracking-widest">Subir Foto Promo</div>
                      )}
                    </div>
                    <input type="file" ref={promoImgInputRef} onChange={(e) => handleFileChange(e, (val) => handlePromotionChange('image', val))} className="hidden" accept="image/*" />
                  </div>
                </div>
              </section>

              <section className="bg-zinc-900/50 p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-[#1B431D]"><Maximize size={24} /> Identidade Visual</h3>
                <div className="space-y-10">
                  <div className="flex items-center gap-8">
                    <div onClick={() => logoInputRef.current?.click()} className="aspect-square w-28 bg-black border-2 border-dashed border-zinc-800 rounded-3xl overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-green-600 transition group relative">
                      {settings.logoImage ? (
                        <img src={settings.logoImage} style={{ width: settings.logoScale || 48, height: settings.logoScale || 48 }} className="object-cover rounded-full" />
                      ) : (
                        <Upload size={24} className="text-zinc-600" />
                      )}
                    </div>
                    <div className="flex-grow space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 block">Tamanho da Logo: {settings.logoScale}px</label>
                      <input 
                        type="range" min="30" max="150" value={settings.logoScale || 48}
                        onChange={(e) => handleUpdateSetting('logoScale', Number(e.target.value))}
                        className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-green-600"
                      />
                    </div>
                    <input type="file" ref={logoInputRef} onChange={(e) => handleFileChange(e, (val) => handleUpdateSetting('logoImage', val))} className="hidden" />
                  </div>
                  
                  <div className="space-y-6">
                    <div onClick={() => bannerInputRef.current?.click()} className="aspect-video w-full bg-black border-2 border-dashed border-zinc-800 rounded-[2rem] overflow-hidden flex items-center justify-center cursor-pointer hover:border-green-600 transition group">
                      {settings.bannerImage ? <img src={settings.bannerImage} className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-zinc-700" />}
                    </div>
                    <input 
                        type="range" min="150" max="600" value={settings.bannerScale || 250}
                        onChange={(e) => handleUpdateSetting('bannerScale', Number(e.target.value))}
                        className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <input type="file" ref={bannerInputRef} onChange={(e) => handleFileChange(e, (val) => handleUpdateSetting('bannerImage', val))} className="hidden" />
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-10">
              <section className="bg-zinc-900/50 p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-red-600"><Map size={24} /> Área de Atendimento</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-500 mb-2 block">Sua Cidade</label>
                      <input type="text" value={settings.allowedCity} onChange={e => handleUpdateSetting('allowedCity', e.target.value.toUpperCase())} className="w-full bg-black border border-zinc-800 p-5 rounded-2xl outline-none font-black" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-500 mb-2 block">Taxa Padrão</label>
                      <input type="number" step="0.5" value={settings.defaultDeliveryFee} onChange={e => handleUpdateSetting('defaultDeliveryFee', Number(e.target.value))} className="w-full bg-black border border-zinc-800 p-5 rounded-2xl outline-none font-black" />
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-zinc-800">
                    <label className="text-[10px] font-black uppercase text-zinc-500 mb-4 block">Exceções e Bairros Grátis</label>
                    <div className="flex gap-2 mb-6">
                      <input type="text" placeholder="Nome do Bairro" value={newNeighborhood.name} onChange={e => setNewNeighborhood({...newNeighborhood, name: e.target.value.toUpperCase()})} className="flex-grow bg-black border border-zinc-800 p-4 rounded-xl text-xs font-black" />
                      <input type="number" placeholder="Taxa" value={newNeighborhood.fee} onChange={e => setNewNeighborhood({...newNeighborhood, fee: Number(e.target.value)})} className="w-24 bg-black border border-zinc-800 p-4 rounded-xl text-xs font-black" />
                      <button onClick={addNeighborhood} className="bg-green-600 p-4 rounded-xl text-white shadow-lg"><Plus size={20}/></button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                      {settings.neighborhoods.map((n, idx) => (
                        <div key={idx} className={`flex items-center justify-between bg-black p-4 rounded-xl border transition-all ${(n as any).active === false ? 'border-red-600/30 opacity-60' : 'border-zinc-800'}`}>
                          <div className="flex flex-col">
                            <span className="font-black uppercase text-[10px] tracking-widest">{n.name}</span>
                            <span className={`font-black text-[9px] mt-1 ${(n as any).active === false ? 'text-red-500' : 'text-green-500'}`}>
                              {(n as any).active === false ? 'NÃO ENTREGA' : 'ENTREGA ATIVA'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`font-black text-xs ${n.fee === 0 ? 'text-green-500 animate-pulse' : 'text-zinc-400'}`}>{n.fee === 0 ? 'GRÁTIS' : `R$ ${n.fee.toFixed(2)}`}</span>
                            
                            <button 
                              onClick={() => toggleNeighborhoodActive(n.name)}
                              className={`p-2 rounded-lg transition-all ${(n as any).active === false ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-green-600 hover:text-white'}`}
                              title={(n as any).active === false ? "Ativar Entrega" : "Desativar Entrega"}
                            >
                              {(n as any).active === false ? <Octagon size={14} /> : <Check size={14} />}
                            </button>

                            <button onClick={() => removeNeighborhood(n.name)} className="text-zinc-700 hover:text-red-500 transition p-2"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl p-10 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-black uppercase tracking-tighter">Categorias</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-full transition"><X size={24} /></button>
            </div>
            <div className="space-y-4">
               <input type="text" placeholder="NOME DA CATEGORIA" className="w-full bg-black border border-zinc-800 p-5 rounded-2xl outline-none focus:border-red-600 transition font-black uppercase text-sm" />
               <button className="w-full bg-red-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-600/20">Salvar Categoria</button>
            </div>
            <div className="pt-6 border-t border-zinc-800 space-y-2 max-h-48 overflow-y-auto">
               <div className="flex justify-between items-center p-4 bg-black rounded-xl border border-zinc-800"><span className="font-bold text-xs uppercase">Pizza</span></div>
               <div className="flex justify-between items-center p-4 bg-black rounded-xl border border-zinc-800"><span className="font-bold text-xs uppercase">Bebida</span></div>
            </div>
          </div>
        </div>
      )}

      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 my-10">
            <form onSubmit={handleSaveProductForm}>
              <header className="p-10 border-b border-zinc-800 flex justify-between items-center bg-black/40">
                <h3 className="text-2xl font-black uppercase tracking-tighter">{editingProduct ? 'Modificar Item' : 'Novo Sabor'}</h3>
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="p-3 hover:bg-zinc-800 rounded-full transition"><X size={28} /></button>
              </header>
              <div className="p-10 space-y-8 max-h-[65vh] overflow-y-auto custom-scroll">
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase text-zinc-500 block tracking-widest">Fotografia do Produto</label>
                   <div onClick={() => fileInputRef.current?.click()} className="aspect-video bg-black border-2 border-dashed border-zinc-800 rounded-[2rem] overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-red-600 transition duration-300 group relative">
                     {previewImage ? <img src={previewImage} className="w-full h-full object-cover" /> : (
                       <div className="flex flex-col items-center text-zinc-600 group-hover:text-red-500 transition font-black uppercase text-[10px]">Carregar Foto</div>
                     )}
                   </div>
                   <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e, setPreviewImage)} className="hidden" />
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <input name="name" placeholder="NOME DO PRODUTO" defaultValue={editingProduct?.name} className="w-full bg-black border border-zinc-800 p-5 rounded-2xl outline-none focus:border-red-600 transition font-black uppercase text-sm" required />
                  <textarea name="description" placeholder="DESCRIÇÃO / INGREDIENTES" defaultValue={editingProduct?.description} className="w-full bg-black border border-zinc-800 p-5 rounded-2xl outline-none focus:border-red-600 transition text-sm h-28 resize-none font-medium" required />
                  <select name="category" defaultValue={editingProduct?.category || 'Pizza'} className="w-full bg-black border border-zinc-800 p-5 rounded-2xl focus:border-red-600 outline-none uppercase font-black text-xs tracking-widest">
                    <option value="Pizza">PIZZA</option>
                    <option value="Bebida">BEBIDA</option>
                  </select>
                </div>
                
                <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase text-red-600 tracking-[0.3em] border-b border-zinc-800 pb-2">Preços por Tamanho</p>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'priceM', label: 'MÉDIA (M)', size: 'Média' },
                      { id: 'priceG', label: 'GRANDE (G)', size: 'Grande' },
                      { id: 'priceGG', label: 'GIGANTE (GG)', size: 'Gigante' },
                      { id: 'priceFA', label: 'FAMÍLIA (FA)', size: 'Família (12)' },
                      { id: 'priceMA', label: 'MARACANÃ (MA)', size: 'Maracanã (24)' },
                    ].map(item => (
                      <div key={item.id} className="flex items-center gap-6 bg-black p-4 rounded-2xl border border-zinc-800">
                        <input type="checkbox" checked={enabledSizes.includes(item.size as PizzaSize)} onChange={() => handleSizeToggle(item.size as PizzaSize)} className="w-6 h-6 accent-red-600 rounded" />
                        <div className="flex-grow">
                          <label className="text-[9px] font-black text-zinc-500 block uppercase tracking-widest">{item.label}</label>
                          <input name={item.id} type="number" step="0.01" defaultValue={editingProduct?.[item.id as keyof Product] as number} disabled={!enabledSizes.includes(item.size as PizzaSize)} className="w-full bg-transparent border-none p-0 focus:ring-0 text-lg font-black text-white disabled:opacity-20" placeholder="0.00" />
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 mt-2 border-t border-zinc-800">
                      <label className="text-[9px] font-black text-zinc-500 block uppercase mb-2">Preço Fixo (Bebidas)</label>
                      <input name="priceFixed" type="number" step="0.01" defaultValue={editingProduct?.priceFixed} className="w-full bg-black border border-zinc-800 p-5 rounded-2xl font-black text-lg" placeholder="0.00" />
                    </div>
                  </div>
                </div>
              </div>
              <footer className="p-10 border-t border-zinc-800 flex gap-4 bg-black/40">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-grow py-5 bg-zinc-800 rounded-2xl font-black uppercase tracking-widest text-[10px]">Descartar</button>
                <button type="submit" disabled={isSaving} className="flex-grow py-5 bg-red-600 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-xl shadow-red-600/20 disabled:opacity-50">
                  {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Confirmar Sabores</>}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;