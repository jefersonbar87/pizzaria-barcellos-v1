import { Product, Neighborhood, AppSettings } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '7gn3dyjhu',
    index: 10,
    name: 'PIZZA BACON CHEF',
    description: 'Muçarela, bacon, catupiry, azeitona e orégano.',
    priceM: 50,
    priceG: 65,
    priceGG: 82,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI
    createdAt: '2026-04-02',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-bacon-chef.avif',
    available: true,
  }, 
  {
    id: '4yarcellu',
    index: 11,
    name: 'PIZZA BARCELLOS COMPLETA',
    description: 'Muçarela, frango desfiado, presunto, calabresa, bacon, milho, cebola, pimentão azeitona e orégano.',
    priceM: 52,
    priceG: 68,
    priceGG: 85,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI
    createdAt: '2026-04-02',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/barcellos.avif',
    available: true,
  },
  {
    id: '9pa3lyxht',
    index: 12,
    name: 'PIZZA SICILIANA',
    description: 'Muçarela, bacon, uva passas, palmito, tomate, azeitonas e orégano.',
    priceM: 49,
    priceG: 64,
    priceGG: 79,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI
    createdAt: '2026-04-02',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-siciliana.avif',
    available: true,
  },
  {
    id: '5ya3rywiu',
    index: 9,
    name: 'PIZZA VEGETARIANA',
    description: 'Muçarela, milho, palmito, catupiry, cebola, azeitonas e orégano.',
    priceM: 48,
    priceG: 63,
    priceGG: 78,
    category: 'Pizza',
    isPremium: false, // <--- COLOQUE EXATAMENTE AQUI 
    createdAt: '2026-04-02',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-vegetariana.avif',
    available: true,
  },
  {
    id: '4ya3dyxiu',
    index: 8,
    name: 'PIZZA DE PALMITO',
    description: 'Muçarela, palmito, milho, azeitona e orégano.',
    priceM: 47,
    priceG: 62,
    priceGG: 77,
    category: 'Pizza',
    isPremium: false, // <--- COLOQUE EXATAMENTE AQUI 
    //createdAt: '2026-03-20', pizza ja inclusa
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/%2Fpizza-palmito.avif',
    available: true,
  },
  {
    id: '6wa3ryvil',
    index: 13,
    name: 'PIZZA KANAL X',
    description: 'Muçarela, frango desfiado, catupiry, bacon, milho, azeitona e orégano.',
    priceM: 50,
    priceG: 65,
    priceGG: 81,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI 
    //createdAt: '2026-03-20', pizza ja inclusa
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/%2Fpizza-kanalx.avif',
    available: true,
  },
  {
    id: '0wa3dyxia',
    index: 5,
    name: 'PIZZA DE 4 SABORES',
    description: 'Sabor: Mista, Muçarela, Frango e Calabresa.',
    priceM: 47,
    priceG: 62,
    priceGG: 77,
    category: 'Pizza',
    isPremium: false, // <--- COLOQUE EXATAMENTE AQUI 
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-4-sabores.png',
    available: true,
  },
  {
    id: '1wb4eziyb',
    index: 6,
    name: 'PIZZA DE FRANGO C/ CATUPIRY',
    description: 'Muçarela, frango desfiado, catupiry, milho, azeitona e orégano.',
    priceM: 48,
    priceG: 63,
    priceGG: 78,
    category: 'Pizza',
    isPremium: false, // <--- COLOQUE EXATAMENTE AQUI 
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-frango-com-catupiry.png',
    available: true,
  },
  {
    id: '1uxypud3b',
    index: 2,
    name: 'PIZZA MISTA',
    description: 'Muçarela, presunto, tomate, azeitona e orégano.',
    priceM: 47,
    priceG: 62,
    priceGG: 77,
    category: 'Pizza',
    isPremium: false, // <--- COLOQUE EXATAMENTE AQUI 
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-mista.png',
    available: true,
 },
  {
    id: '1x6tu1u6s',
    index: 1,
    name: 'PIZZA DE MUÇARELA',
    description: 'Muçarela, tomate, azeitona e orégano.',
    priceM: 47,
    priceG: 62,
    priceGG: 77,
    category: 'Pizza',
    isPremium: false, // <--- COLOQUE EXATAMENTE AQUI
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-mucarela.png',
    available: true,
 },
  {
    id: '5pjeg4wwn',
    index: 4,
    name: 'PIZZA DE CALABRESA',
    description: 'Muçarela, calabresa, tomate, azeitona e orégano.',
    priceM: 47,
    priceG: 62,
    priceGG: 77,
    category: 'Pizza',
    isPremium: false, // <--- COLOQUE EXATAMENTE AQUI 
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-calabresa.png',
    available: true,
 },
  {
    id: '6m1ab7eh4',
    index: 3,
    name: 'PIZZA DE FRANGO',
    description: 'Frango desfiado, milho, tomate, azeitona e orégano.',
    priceM: 47,
    priceG: 62,
    priceGG: 77,
    category: 'Pizza',
    isPremium: false, // <--- COLOQUE EXATAMENTE AQUI 
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-frango.png',
    available: true,
 },
  {
    id: '6qti9nfvd',
    index: 14,
    name: 'PIZZA CARIOCA',
    description: 'muçarela, lombo canadense, peito de peru, bacon, milho, azeitona e orégano.',
    priceM: 50,
    priceG: 67,
    priceGG: 84,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI 
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-carioca.png',
    available: true,
 },
 {
    id: 'lm6xkyo4u',
    index: 15,
    name: 'PIZZA MAGIORDANO',
    description: 'Muçarela, frango desfiado, bacon, tomate, milho, azeitona e orégano.',
    priceM: 49,
    priceG: 64,
    priceGG: 80,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI 
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-magiordano.png',
    available: true,
 },
  {
    id: '9bcnh8zs1',
    index: 7,
    name: 'PIZZA DE CALABRESA C/ CEBOLA',
    description: 'Muçarela, calabresa, cebola, tomate, azeitona e orégano.',
    priceM: 49,
    priceG: 64,
    priceGG: 79,
    category: 'Pizza',
    isPremium: false, // <--- COLOQUE EXATAMENTE AQUI 
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-calabresa-com-cebola.png',
    available: true,
  },
  {
    id: 'alqbiz8an',
    index: 16,
    name: 'PIZZA Á MODA DA CASA',
    description: 'Muçarela, frango, palmito, cebola, catupiry, milho, azeitona e orégano.',
    priceM: 50,
    priceG: 65,
    priceGG: 80,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI 
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-a-moda-da-casa.png',
    available: true,
  },
  {
    id: 'gh5xo4u05',
    index: 17,
    name: 'PIZZA DE 3 QUEIJOS',
    description: 'Muçarela, provolone, parmesão, tomate, azeitona e orégano.',
    priceM: 49,
    priceG: 66,
    priceGG: 82,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI 
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-3-queijos.png',
    available: true,
  },
  {
    id: 'kh19i3ljv',
    index: 19,
    name: 'PIZZA DE LOMBO CANADENSE',
    description: 'Muçarela, lombo canadense, bacon, tomate, milho, azeitona e orégano.',
    priceM: 49,
    priceG: 65,
    priceGG: 82,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI 
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-lombo-canadense.png',
    available: true,
 },
  {
    id: '70h7ydc8g',
    index: 20,
    name: 'PIZZA JUPARANÃ',
    description: 'Muçarela, presunto, calabresa, palmito, bacon, milho, azeitona e orégano.',
    priceM: 50,
    priceG: 66,
    priceGG: 83,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI 
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-juparana.png',
    available: true,
 },
  {
    id: 'm1h1jsim4',
    index: 21,
    name: 'PIZZA PORTUGUESA',
    description: 'Muçarela, sardinha, presunto, ovo, tomate, milho, azeitona e orégano.',
    priceM: 49,
    priceG: 65,
    priceGG: 81,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI 
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-portuguesa.png',
    available: true,
 },
  {
    id: 'tguituk21',
    index: 22,
    name: 'PIZZA DE BATATA FRITA',
    description: 'Muçarela, calabresa, batata frita, azeitona e orégano.',
    priceM: 54,
    priceG: 69,
    priceGG: 86,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI 
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-bata-frita.png',
    available: true,
 },
  {
    id: 'ujfiuq9r9',
    index: 18,
    name: 'PIZZA  DE 4 QUEIJOS',
    description: 'Muçarela, provolone, parmesão, catupiry, tomate, azeitona e orégano.',
    priceM: 50,
    priceG: 67,
    priceGG: 84,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI 
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-4-queijos.png',
    available: true,
 },
  {
    id: 'cy41mut6y',
    name: 'REFRIGERANTE COCA COLA 2L',
    description: 'Refrigerante 2L gelado',
    priceFixed: 15,
    category: 'Bebida',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/coca-cola.png',
    available: true,
    stock: 10,
},
  {
    id: 'cy41muz9y',
    name: 'REFRIGERANTE COCA COLA ZERO 1,5L',
    description: 'Refrigerante 1,5L gelado',
    priceFixed: 13.50,
    category: 'Bebida',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/cocazero.jpg',
    available: true,
    stock: 10,
},

  {
    id: '6oglq4b39',
    name: 'REFRIGERANTE COCA COLA LATA 350ML',
    description: 'Refrigerante lata 350ml gelado',
    priceFixed: 7,
    category: 'Bebida',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/coca-cola-lata.jpg',
    available: true,
    stock: 10,
},    
  
    {
    id: '6oglqAP39',
    name: 'REFRIGERANTE COCA COLA 600ML',
    description: 'Refrigerante 600ml gelado',
    priceFixed: 9,
    category: 'Bebida',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/coca-cola-600ml.png',
    available: true,
    stock: 10,
},
  {
    id: 'pilarlssq',
    name: 'REFRIGERANTE COROA LARANJA 2L',
    description: 'Refrigerante 2 Litros gelado',
    priceFixed: 10,
    category: 'Bebida',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/coroa-laranja.avif',
    available: true,
    stock: 10,
},
  {
    id: 'piuval1iq',
    name: 'REFRIGERANTE COROA UVA 2L',
    description: 'Refrigerante 2 litros gelado',
    priceFixed: 10,
    category: 'Bebida',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/Coroa-uva.png',
    available: true,
    stock: 10,
},
  {
    id: 'thot6jw4a',
    name: 'REFRIGERANTE COROA GUARANÁ 2L',
    description: 'Refrigerante 2 litros gelado',
    priceFixed: 10,
    category: 'Bebida',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/Coroa-Guarana.png',
    available: true,
    stock: 10,
},
  {
    id: '7zif3shpk',
    name: 'REFRIGERANTE COROA LIMÃO 2L',
    description: 'Refrigerante 2 litros gelado',
    priceFixed: 10,
    category: 'Bebida',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/Coroa-Limão.png',
    available: true,
    stock: 10,
},
  {
    id: 'thot5lw4a',
    name: 'REFRIGERANTE COROA GUARANÁ 1,5L',
    description: 'Refrigerante 1,5L gelado',
    priceFixed: 8.50,
    category: 'Bebida',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/guarana-coroa-1.5L.avif',
    available: true,
    stock: 10,
  }  
];

// 1. Controle Manual (A CHAVE DA LOJA)
// Mude para 'auto' para o robô abrir sozinho no horário
// Mude para 'open' para forçar o site a ficar ABERTO
// Mude para 'closed' para forçar o site a ficar FECHADO
const MANUAL_CONTROL = 'auto' as 'auto' | 'open' | 'closed'; 

// 2. Lógica de horário automática
const checkAutomaticOpening = () => {
  const agora = new Date();
  const hora = agora.getHours();
  const minutos = agora.getMinutes();
  const tempoAtual = hora * 60 + minutos;

  const inicio = 17 * 60 + 45; // 17:45h
  const fim = 23 * 60 + 30;    // 23:30h

  return tempoAtual >= inicio && tempoAtual <= fim;
};

export const INITIAL_NEIGHBORHOODS: Neighborhood[] = [
  { name: 'NOVA ESPERANÇA', fee: 0 },
  { name: 'LAGOA PARK', fee: 0 },
  { name: 'LINHARES 5', fee: 0 },
  { name: 'LINHARES V', fee: 0 },
  { name: 'SÃO JOSÉ', fee: 0 },
  { name: 'MOVELAR', fee: 0 },
  { name: 'GAIVOTAS', fee: 0 },
  { name: 'PLANALTO', fee: 0 },
  { name: 'BOA VISTA', fee: 0 },
  { name: 'FONTE GRANDE', fee: 0 },
  { name: 'INTERLAGOS', fee: 5 },
  { name: 'AVISO', fee: 5 },
  { name: 'CANIVETE', fee: 5 },
  { name: 'VILA MARIA', fee: 5 },
  { name: 'VILA ISABEL', fee: 5 },
];

export const INITIAL_SETTINGS: AppSettings = {
  // Aqui o sistema decide: se estiver em 'auto', ele usa o relógio. 
  // Se você mudar lá em cima para 'open' ou 'closed', ele obedece você!
  isOpen: MANUAL_CONTROL === 'open' ? true : 
          MANUAL_CONTROL === 'closed' ? false : 
          checkAutomaticOpening(),

  closedMode: 'hide-menu',
  closeMessage: 'NESTE MOMENTO ESTAMOS FECHADOS, NOSSO ATENDIMENTO É DE 18:00H ÀS 23:30H',
  neighborhoods: INITIAL_NEIGHBORHOODS,
  blockedNeighborhoods: 'Bagueira, Rio Quartel, Bebedouro, Residencial Rio Doce, Bairro Perigoso, Invasão',
  defaultDeliveryFee: 4,
  allowedCity: 'LINHARES',
  bannerText: 'SABOR EM CADA DETALHE',
  bannerSubtext: 'Peça agora a melhor pizza de Linhares com entrega rápida.',
  bannerImage: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/telainicial.mp4',
  bannerScale: 250,
  logoImage: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/logo-pizzaria.png',
  logoScale: 100,
  whatsappIcon: undefined,
  instagramIcon: undefined,
  promotions: [
    {
      id: 'promo-coca', // Entre aspas para ser uma string
      active: false,
      title: 'PROMOÇÃO FAMÍLIA GG',
      image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/promocao-coca-cola.avif',
      price: 164.90,
      freeDelivery: false,
      description: 'Aqui você leva 16 pedaços de pizza + Coca Cola 2L GRÁTIS!'
      
    },
    {
      id: 'promo-coroa', // Entre aspas para ser uma string
      active: false,
      title: 'PROMOÇÃO FAMÍLIA G',
      image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/promocao-coroa.avif', // Link da imagem que criamos
      price: 129.90,
      freeDelivery: true,
      description: 'Aqui você leva 12 pedaços + 1 Coroa Sabores 2L GRÁTIS!'
    }
  ],
  
  // Acrescentando as informações de rodapé solicitadas
  registeredTrademark: 'Marca Registrada',
  producedBy: 'Produzido por JefTecnologias'
};

export const CONTACT_WHATSAPP = '5527996183495';
export const INSTAGRAM_URL = 'https://www.instagram.com/pizzaria.barcellos';