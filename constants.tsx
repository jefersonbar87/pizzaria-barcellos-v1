import { Product, Neighborhood, AppSettings } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '7gn3dyjhu',
    index: 10.5,
    name: 'PIZZA BACON CHEF',
    description: 'Muçarela, bacon, catupiry, azeitona e orégano.',
    priceM: 50,
    priceG: 65,
    priceGG: 82,
    priceFA: 111,
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
    priceFA: 115,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI
    createdAt: '2026-04-02',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/barcellos-completa.avif',
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
    priceFA: 107,
    category: 'Pizza',
    isPremium: false, // <--- COLOQUE EXATAMENTE AQUI
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
    priceFA: 106,
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
    priceFA: 104,
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
    priceFA: 110,
    category: 'Pizza',
    isPremium: false, // <--- COLOQUE EXATAMENTE AQUI 
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
    priceFA: 104,
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
    priceFA: 106,
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
    priceFA: 104,
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
    priceFA: 104,
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
    priceFA: 104,
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
    priceFA: 104,
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
    priceFA: 114,
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
    priceFA: 108,
    category: 'Pizza',
    isPremium: false, // <--- COLOQUE EXATAMENTE AQUI 
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
    priceFA: 107,
    category: 'Pizza',
    isPremium: false, // <--- COLOQUE EXATAMENTE AQUI 
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-calabresa-com-cebola.png',
    available: true,
  },
  {
    id: 'alqbiz8an',
    index: 16,
    name: 'PIZZA À MODA DA CASA',
    description: 'Muçarela, frango, palmito, cebola, catupiry, milho, azeitona e orégano.',
    priceM: 50,
    priceG: 65,
    priceGG: 80,
    priceFA: 108,
    category: 'Pizza',
    isPremium: false, // <--- COLOQUE EXATAMENTE AQUI 
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
    priceFA: 111,
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
    priceFA: 111,
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
    priceFA: 113,
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
    priceFA: 110,
    category: 'Pizza',
    isPremium: false, // <--- COLOQUE EXATAMENTE AQUI 
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
    priceFA: 117,
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
    priceFA: 114,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI 
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pizza-4-queijos.png',
    available: true,
  },
  {
    id: '9yaJrKwiu',
    index: 10,
    name: 'PIZZA DE CAMARÃO',
    description: 'Muçarela, camarão, tomate, azeitonas e orégano.',
    priceM: 53,
    priceG: 72,
    priceGG: 89,
    priceFA: 120,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI 
    createdAt: '2026-04-02',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/camarao.avif',
    available: true,
  },
  {
    id: '1ya8rOIiu',
    index: 10.1,
    name: 'PIZZA DE CAMARÃO CREMOSO',
    description: 'Muçarela, camarão, milho, catupiry, azeitonas e orégano.',
    priceM: 55,
    priceG: 74,
    priceGG: 93,
    priceFA: 124,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI 
    createdAt: '2026-04-02',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/camaraocremoso.avif',
    available: true,
  },
  {
    id: '6ya6Uywiu',
    index: 10.2,
    name: 'PIZZA ITALIANA',
    description: 'Muçarela, camarão, milho, palmito, azeitonas e orégano.',
    priceM: 54,
    priceG: 73,
    priceGG: 91,
    priceFA: 122,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI 
    createdAt: '2026-04-02',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/italiana.avif',
    available: true,
  },
  {
    id: '3ya0Pywiu',
    index: 10.3,
    name: 'PIZZA SABOROSA',
    description: 'Muçarela, peito de peru, ovo, catupiry, milho, azeitonas e orégano.',
    priceM: 51,
    priceG: 68,
    priceGG: 86,
    priceFA: 114,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI 
    createdAt: '2026-04-02',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/saborosa.avif',
    available: true,
  },
  {
    id: '4ya9rySiu',
    index: 10.4,
    name: 'PIZZA DE PEPPERONI',
    description: 'Muçarela, pepperoni, azeitonas e orégano.',
    priceM: 50,
    priceG: 66,
    priceGG: 84,
    priceFA: 113,
    category: 'Pizza',
    isPremium: true, // <--- COLOQUE EXATAMENTE AQUI 
    createdAt: '2026-04-02',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/pepperoni.avif',
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
    id: 'oy41mu42y',
    name: 'REFRIGERANTE COCA COLA ZERO 2L',
    description: 'Refrigerante 2L gelado',
    priceFixed: 15.00,
    category: 'Bebida',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/cocazero.jpg',
    available: true,
    stock: 10,
  },
  {
    id: 'ab41mss9y',
    name: 'REFRIGERANTE COCA COLA 1,5L',
    description: 'Refrigerante 1,5L gelado',
    priceFixed: 13.50,
    category: 'Bebida',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/coca-cola1,5l.avif',
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
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/coca-cola-lata.avif',
    available: true,
    stock: 10,
  },
  {
    id: '7oglY4b53',
    name: 'REFRIGERANTE COCA COLA ZERO LATA 350ML',
    description: 'Refrigerante lata 350ml gelado',
    priceFixed: 7,
    category: 'Bebida',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/coca-cola-lata-zero.avif',
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
    id: 'gelarknsq',
    name: 'REFRIGERANTE GUARANÁ ANTARCTICA 2L',
    description: 'Refrigerante 2 Litros gelado',
    priceFixed: 15,
    category: 'Bebida',
    image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/guaranaantactida.avif',
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
const MANUAL_CONTROL = 'closed' as 'auto' | 'open' | 'closed'; // AQUI VOCE ABRE E FECHA A PAGINA

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
  { name: 'NOVA BETÂNIA', fee: 5 },
  { name: 'VILA IZABEL', fee: 5 },
  { name: 'VILA ISABEL', fee: 5 },
];

export const INITIAL_SETTINGS: AppSettings = {
  // --- CONFIGURAÇÃO DO CARTAZ  ---
  showAdCartaz: false, // ADICIONA OU TIRA O CARTAZ
  adCartazLink: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/lecardcartaz.avif', // Link da imagem hospedada na Oracle Cloud
  // ----------------------------------------------
  isOpen: MANUAL_CONTROL === 'open' ? true :
    MANUAL_CONTROL === 'closed' ? false :
      checkAutomaticOpening(),

  closedMode: 'hide-menu',
  closeMessage: 'ATENÇÃO! NOS DIAS 20 E 28 DE AGOSTO, NÃO TEREMOS ATENDIMENTO.',
  neighborhoods: INITIAL_NEIGHBORHOODS,
  blockedNeighborhoods: 'Bagueira, Rio Quartel, Guaxe, Povoação, Bebedouro, Residencial Rio Doce, Bairro Perigoso, Invasão, Pontal do Ipiranga, Regência',
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
      active: false, // AQUI VC ATIVA E DESATIVA
      isClickable: true, // AQUI VC ATIVA O VALOR
      title: 'PROMOÇÃO FAMÍLIA GG',
      image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/promocao-coca-cola.avif',
      price: 164.90,
      freeDelivery: true, // SELO DE ENTREGA GRATIS
      description: 'Aqui você leva 16 pedaços de pizza + Coca Cola 2L GRÁTIS!'
    },
    {
      id: 'promo-coroa', // Entre aspas para ser uma string
      active: false, // AQUI VC ATIVA E DESATIVA 
      isClickable: true, // AQUI VC ATIVA O VALOR
      title: 'PROMOÇÃO FAMÍLIA G',
      image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/promocao-coroa.avif', // Link da imagem que criamos
      price: 129.90,
      freeDelivery: false, // SELO DE ENTREGA GRATIS
      description: 'Aqui você leva 12 pedaços + 1 Coroa Sabores 2L GRÁTIS!'
    },
    {
      id: 'infor-0', // Entre aspas para ser uma string
      active: true, // AQUI VC ATIVA E DESATIVA
      isClickable: false, // AQUI VC ATIVA O VALOR
      title: 'Informativo TidaChat',
      image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/informativotidachat.avif', // Link da imagem que criamos
      price: 129.90,
      freeDelivery: false, // SELO DE ENTREGA GRATIS
      description: 'Aqui você leva 12 pedaços + 1 Coroa Sabores 2L GRÁTIS!'
    },
    {
      id: 'infor-1', // Entre aspas para ser uma string
      active: true, // AQUI VC ATIVA E DESATIVA
      isClickable: false, // AQUI VC ATIVA O VALOR
      title: 'Cartão LeCard',
      image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/cartaolecard.avif', // Link da imagem que criamos
      price: 129.90,
      freeDelivery: false, // SELO DE ENTREGA GRATIS
      description: 'Aqui você leva 12 pedaços + 1 Coroa Sabores 2L GRÁTIS!'
    },
    {
      id: 'infor-2', // Entre aspas para ser uma string
      active: false, // AQUI VC ATIVA E DESATIVA
      isClickable: false, // AQUI VC ATIVA O VALOR
      title: 'PIZZA DE CAMARÃO',
      image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/cartazcamarao.avif', // Link da imagem que criamos
      price: 129.90,
      freeDelivery: false, // SELO DE ENTREGA GRATIS
      description: 'Aqui você leva 12 pedaços + 1 Coroa Sabores 2L GRÁTIS!'
    },
    {
      id: 'infor-3', // Entre aspas para ser uma string
      active: false, // AQUI VC ATIVA E DESATIVA
      isClickable: false, // AQUI VC ATIVA O VALOR
      title: 'PIZZA CAMARAO CREMOSO',
      image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/cartazcamaraocremoso.avif', // Link da imagem que criamos
      price: 129.90,
      freeDelivery: false, // SELO DE ENTREGA GRATIS
      description: 'Aqui você leva 12 pedaços + 1 Coroa Sabores 2L GRÁTIS!'
    },
    {
      id: 'infor-4', // Entre aspas para ser uma string
      active: false, // AQUI VC ATIVA E DESATIVA
      isClickable: false, // AQUI VC ATIVA O VALOR
      title: 'PIZZA ITALIANA',
      image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/cartazitaliana.avif', // Link da imagem que criamos
      price: 129.90,
      freeDelivery: false, // SELO DE ENTREGA GRATIS
      description: 'Aqui você leva 12 pedaços + 1 Coroa Sabores 2L GRÁTIS!'
    },
    {
      id: 'infor-5', // Entre aspas para ser uma string
      active: false, // AQUI VC ATIVA E DESATIVA
      isClickable: false, // AQUI VC ATIVA O VALOR
      title: 'PIZZA SABOROSA',
      image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/cartazsaborosa.avif', // Link da imagem que criamos
      price: 129.90,
      freeDelivery: false, // SELO DE ENTREGA GRATIS
      description: 'Aqui você leva 12 pedaços + 1 Coroa Sabores 2L GRÁTIS!'
    },
    {
      id: 'infor-6', // Entre aspas para ser uma string
      active: false, // AQUI VC ATIVA E DESATIVA
      isClickable: false, // AQUI VC ATIVA O VALOR
      title: 'PIZZA PEPPERONI',
      image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/cartazpepperoni.avif', // Link da imagem que criamos
      price: 129.90,
      freeDelivery: false, // SELO DE ENTREGA GRATIS
      description: 'Aqui você leva 12 pedaços + 1 Coroa Sabores 2L GRÁTIS!'
    },
    {
      id: 'infor', // Entre aspas para ser uma string
      active: true, // AQUI VC ATIVA E DESATIVA
      isClickable: false, // AQUI VC ATIVA O VALOR
      title: 'TAMANHOS DAS PIZZAS',
      image: 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/cartaz1.avif', // Link da imagem que criamos
      price: 129.90,
      freeDelivery: false, // SELO DE ENTREGA GRATIS      
      description: 'Aqui você leva 12 pedaços + 1 Coroa Sabores 22 GRÁTIS!'
    }
  ],


  // Acrescentando as informações de rodapé solicitadas
  registeredTrademark: 'Marca Registrada',
  producedBy: 'Produzido por JefTecnologias'
};

export const CONTACT_WHATSAPP = '5527996183495';
export const INSTAGRAM_URL = 'https://www.instagram.com/pizzaria.barcellos';
