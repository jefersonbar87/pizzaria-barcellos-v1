// components/TidaChat.tsx
import React, { useState, useEffect, useRef } from 'react';

declare global {
  interface ImportMeta { env: { VITE_GEMINI_API_KEY: string; }; }
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

interface Message { id: number; sender: 'client' | 'tida'; text: string; }

// FAQ Mantido e Atualizado com História e Redes Sociais
interface TidaFAQItem { keywords: string[]; answer: string; }
const TIDA_FAQ: TidaFAQItem[] = [
  { keywords: ['telefone', 'whatsapp', 'contato'], answer: 'Nosso WhatsApp é o (27) 99618-3495.' },
  { keywords: ['horario', 'funcionamento'], answer: 'Funcionamos todos os dias, das 18h às 23h30!' },
  { keywords: ['tempo', 'demora', 'espera'], answer: 'Leva de 20 a 40 minutos para ficar prontinha!' },
  { keywords: ['endereco', 'endereço', 'local'], answer: 'Rua São Bernardo, 20, Nova Esperança, Linhares/ES.' },

  // 🌟 NOVO 1: Instagram da Pizzaria
  {
    keywords: ['instagram', 'insta', 'rede social', 'fotos'],
    answer: 'Acompanhe a gente no Instagram! É o @pizzaria.barcellos 🍕✨\n\nLá postamos fotos deliciosas das nossas pizzas. Clique no link para seguir:\nhttps://www.instagram.com/pizzaria.barcellos'
  },

  // 🌟 NOVO 2: A Essência e História da Família Barcellos
  {
    keywords: ['fale da pizzaria', 'como surgiu', 'historia', 'história', 'sobre voces', 'sobre vocês', 'quem sao'],
    answer: 'A história da Pizzaria Barcellos é feita de muita fé, união familiar e amor pelo que fazemos! 🥰\n\nTudo começou há cerca de 16 anos. Por muito tempo, atendemos com dedicação em um ponto físico, mas alguns desafios nos fizeram pausar. Foi um período de muito aprendizado e perseverança.\n\nMas Deus escreve novas histórias! 🙏 No dia 07/03/2026, reinauguramos no formato delivery. Nosso objetivo não é só vender pizza, mas levar até a sua casa sabor, carinho e um pedacinho da nossa história.\n\nSeja muito bem-vindo! O que podemos preparar para você hoje?'
  },

  // 🌟 NOVO 3: Aviso de Atendimento Exclusivo (Sem mesas)
  {
    keywords: ['comer ai', 'comer aí', 'mesas', 'espaço fisico', 'espaço físico', 'consumir no local', 'rodizio', 'rodízio', 'reservar mesa'],
    answer: 'Nós trabalhamos exclusivamente com Delivery e Retirada no balcão! 🛵🏃‍♂️\n\nNão temos espaço físico com mesas para consumo no local, mas preparamos sua pizza com todo o carinho para você saborear no conforto da sua casa. O que vamos pedir hoje? 🍕'
  },
  
  // 🌟 NOVO 4: Maionese Caseira
  {
    keywords: ['maionese', 'caseira', 'molho', 'maionese verde', 'molho verde'],
    answer: 'Siiim! 😋 Toda pizza vai acompanhada da nossa deliciosa maionese caseira temperada. É sucesso absoluto por aqui!'
  }, // <--- COLOQUE ESSA VÍRGULA AQUI SE ELA NÃO ESTIVER!

  // 🌟 NOVO 5: Ticket / Vale Refeição (Lecard)
  {
    keywords: ['ticket', 'vale refeição', 'vale-refeição', 'vale alimentação', 'vr', 'va', 'alelo', 'sodexo', 'ticket restaurante', 'lecard', 'vale'],
    answer: 'Siiim! Aceitamos vale, mas no momento estamos trabalhando apenas com a bandeira Lecard, tá bom? 🥰'
  }
  ];

  const TidaChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isIconVisible, setIsIconVisible] = useState(true); 
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  // 🌟 Controla se a Tida está em modo de descanso (15s inativa)
  const [isIdle, setIsIdle] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'tida', text: 'Olá! Sou a Tida, assistente virtual da Pizzaria Barcellos. Como posso te ajudar hoje?' }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // 🌟 AJUSTE CIRÚRGICO: O temporizador agora reinicia sempre que ela acorda
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Só ativa o timer se o chat estiver fechado, ícone visível e ELA NÃO ESTIVER DORMINDO
    if (!isOpen && isIconVisible) {
      if (!isIdle) {
        timeout = setTimeout(() => {
          setIsIdle(true); // Dorme após 15s sem interação
        }, 15000);
      }
    } else {
      setIsIdle(false); // Acorda se o chat abrir
    }

    return () => clearTimeout(timeout);
  }, [isOpen, isIconVisible, isIdle]); // Adicionado o isIdle para reiniciar o ciclo

  // =========================================================================
  // 🛑 PAINEL DE CONTROLE DE EXPEDIENTE 🛑
  // =========================================================================
  const FORCAR_ABERTO = true; // Mude para true para testar o bot fora do horário
  const FORCAR_FECHADO = false; // Mude para true se faltar luz ou precisar fechar do nada

  const verificarExpediente = () => {
    if (FORCAR_FECHADO) return false;
    if (FORCAR_ABERTO) return true;

    const agora = new Date();
    const hora = agora.getHours();
    const minuto = agora.getMinutes();

    const tempoAtualEmMinutos = (hora * 60) + minuto;
    const horarioAbertura = (17 * 60) + 50; // 17:50h
    const horarioFechamento = (23 * 60) + 30; // 23:30h

    return tempoAtualEmMinutos >= horarioAbertura && tempoAtualEmMinutos <= horarioFechamento;
  };

  // =========================================================================
  // RADAR DE BOTÕES DINÂMICOS (Mapeia a última mensagem para gerar opções)
  // =========================================================================
  const getLastMessageText = () => messages.length > 0 ? messages[messages.length - 1].text.toLowerCase() : '';
  let activeOptions: string[] = [];
  const lastText = getLastMessageText();

  if (messages.length > 0 && messages[messages.length - 1].sender === 'tida') {
    if (lastText.includes('como posso te ajudar')) {
      activeOptions = ['🍕 Fazer novo pedido', '📖 Conhecer os Sabores', '❓ Tirar dúvidas'];
    } else if (lastText.includes('o que vamos pedir hoje') || lastText.includes('como será a sua próxima pizza')) {
      activeOptions = ['🍕 Pizza um sabor', '🍕 Pizza meio a meio'];
    } else if (lastText.includes('quantidade dessa pizza') || lastText.includes('unidades desse refrigerante')) {
      activeOptions = ['1', '2', '3', '4'];
    } else if (lastText.includes('dividir em 2 ou 3 sabores')) {
      activeOptions = ['✌️ 2 Sabores', '🖖 3 Sabores'];
    } else if (lastText.includes('mais alguma pizza') || lastText.includes('mais alguma bebida') || lastText.includes('alguma observação no seu pedido')) {
      activeOptions = ['✅ Sim', '❌ Não'];
    } else if (lastText.includes('tamanho da pizza')) {
      activeOptions = ['Média', 'Grande', 'Gigante', 'Família'];
    } else if (lastText.includes('escolha uma das opções abaixo')) {
      activeOptions = ['🥤 Coca Cola', '🥤 Refrigerante Coroa', '🥤 Guaraná Antarctica', '❌ Não quero refrigerante'];
    } else if (lastText.includes('versão normal ou zero')) {
      activeOptions = ['Normal', 'Zero'];
    } else if (lastText.includes('tamanho da sua coca cola')) {
      activeOptions = ['Coca 2L', 'Coca 1,5L', 'Coca 600ml', 'Coca Lata'];
    } else if (lastText.includes('tamanho do seu refrigerante coroa')) {
      activeOptions = ['Coroa 2L', 'Coroa 1,5L'];
    } else if (lastText.includes('tamanho do seu guaraná antarctica')) {
      activeOptions = ['Guaraná Antarctica 2L'];
    } else if (lastText.includes('sabor do seu coroa 2l')) {
      activeOptions = ['Guaraná', 'Laranja', 'Limão', 'Uva'];
    } else if (lastText.includes('entrega ou retirada')) {
      activeOptions = ['🛵 Entrega', '🏪 Retirada'];
    } else if (lastText.includes('posso enviar o pedido')) {
      activeOptions = ['✅ Confirmar pedido', '🔄 Revisar pedido', '❌ Cancelar pedido'];
    } else if (lastText.includes('forma de pagamento')) {
      activeOptions = ['PIX', 'Dinheiro', 'Débito', 'Crédito'];
    }
  }

  // =========================================================================
  // MOTOR DE COMUNICAÇÃO GEMINI
  // =========================================================================
  const tidaResponseLogic = async (clientText: string, currentHistory: Message[]) => {
    setIsTyping(true);

    try {
      const recentMessages = currentHistory.slice(-40);
      const formattedHistory = recentMessages.map((m, index) => {
        if (index === recentMessages.length - 1 && m.sender === 'client') return { role: 'user', parts: [{ text: clientText }] };
        return { role: m.sender === 'client' ? 'user' : 'model', parts: [{ text: m.text }] };
      });

      const systemInstruction = `
        Você é a Tida, assistente virtual simpática e envolvente da Pizzaria Barcellos em Linhares/ES.
        SUA MISSÃO: Conduzir o cliente pelo pedido de forma clara, informando valores parciais e oferecendo escolhas em botões.

       [GATILHOS OBRIGATÓRIOS PARA A INTERFACE - USE AS FRASES EXATAS]
        Para o sistema gerar os botões na tela, você DEVE usar estas frases exatas para fazer perguntas:
        - Tamanho da pizza: "Qual o tamanho da pizza?"
        - Quantidade de sabores Família: "Você quer dividir em 2 ou 3 sabores?"
        - Loop da Pizza (Pergunta): "Você deseja pedir mais alguma pizza?"
        - Loop da Pizza (Confirmação): "Combinado! Como será a sua próxima pizza?"
        - Oferecer bebida: "Temos opções de refrigerantes no nosso cardápio: Escolha uma das opções abaixo."
        - Tamanho da Coca Cola: "Qual o tamanho da sua Coca Cola?"
        - Tipo da Coca (APENAS 1,5L e Lata): "Você prefere a versão Normal ou Zero?"
        - Tamanho do Coroa: "Qual o tamanho do seu Refrigerante Coroa?"
        - Tamanho do Antarctica Guaraná: "Qual o tamanho do seu Guaraná Antarctica?" 
        - Sabor do Coroa 2L: "Qual o sabor do seu Coroa 2L?"
        - Loop da Bebida: "Você deseja pedir mais alguma bebida?"
        - Observação: "Você quer colocar alguma observação no seu pedido?"
        - Forma de Entrega: "O pedido é para entrega ou retirada?"
        - Forma de pagamento: "Qual a forma de pagamento?"
        - Confirmação final: "Este resumo está correto? Posso enviar o pedido?"

        [REGRAS DE CONDUÇÃO E VALORES]
        1. QUEM CONDUZ É VOCÊ: O cliente escolhe/digita, mas VOCÊ determina o próximo passo. Faça apenas UMA pergunta por vez.
        2. PIZZA MEIO A MEIO (TRAVA DE SABORES CRÍTICA): 
           - Se o cliente escolher "Média", "Grande" ou "Gigante" meio a meio: É OBRIGATÓRIO ser apenas 2 sabores. NÃO pergunte se ele quer dividir em 2 ou 3. Passe direto e pergunte: "Qual vai ser a 1ª metade?".
           - Se o cliente escolher "Família" meio a meio: Aí sim, pergunte OBRIGATORIAMENTE a frase exata: "Você quer dividir em 2 ou 3 sabores?".
        3. PEDINDO OS SABORES: Se a pizza for dividida, peça um sabor por vez. Ex: "Qual vai ser a 1ª metade?", depois que ele responder, "Qual vai ser a 2ª metade?" (e a 3ª parte, somente se for Família com 3 sabores).
        4. QUANTIDADE DA PIZZA: Assim que todos os sabores e tamanho da pizza forem definidos, informe o valor de 1 unidade e pergunte EXATAMENTE: "Qual a quantidade dessa pizza você vai querer?".
        5. LOOP DE PIZZAS: Após o cliente informar a quantidade da pizza anterior, pergunte EXATAMENTE: "Você deseja pedir mais alguma pizza?". 
           - Se o cliente clicar em "Sim", pergunte OBRIGATORIAMENTE a frase exata: "Combinado! Como será a sua próxima pizza?". (Isso acionará os botões iniciais).
           - Se o cliente clicar em "Não", avance para oferecer a bebida.
        6. COCA NORMAL/ZERO: Se o cliente escolher "Coca 1,5L" ou "Coca Lata", antes de passar o valor, pergunte OBRIGATORIAMENTE a frase exata: "Você prefere a versão Normal ou Zero?". Se escolher 2L ou 600ml, não pergunte isso.
        7. SABOR DO COROA: Se o cliente escolher "Coroa 2L", pergunte OBRIGATORIAMENTE a frase exata: "Qual o sabor do seu Coroa 2L?". Se escolher "Coroa 1,5L", assuma automaticamente que o sabor é Guaraná e não pergunte.
        8. QUANTIDADE DA BEBIDA: Assim que o tamanho/tipo/sabor da bebida for definido, pergunte EXATAMENTE: "Quantas unidades desse refrigerante você vai levar?".
        9. LOOP DE BEBIDAS: Após informar a quantidade de bebidas, pergunte EXATAMENTE: "Você deseja pedir mais alguma bebida?".
           - Se "Sim", use NOVAMENTE a frase do gatilho de "Oferecer bebida" para os botões aparecerem.
           - Se "Não", avance para perguntar sobre as observações.
        10. OBSERVAÇÕES: Assim que o cliente finalizar os pedidos (pizzas e bebidas), pergunte OBRIGATORIAMENTE a frase exata: "Você quer colocar alguma observação no seu pedido?".
           - Se o cliente clicar em "Sim", responda de forma acolhedora pedindo para ele digitar (Ex: "Claro! Pode digitar sua observação. Ex: sem cebola, coca bem gelada...").
           - Após ele digitar a observação, ou se ele clicar em "Não", avance imediatamente para perguntar a Forma de Entrega.
        11. CEP PRIMEIRO: Se o cliente escolher "Entrega", a PRIMEIRA e ÚNICA coisa que você deve perguntar OBRIGATORIAMENTE é: "Perfeito! Para a entrega, qual é o seu CEP?". NUNCA peça bairro, rua ou endereço completo antes de pedir o CEP.
        12. MEMÓRIA DE PEDIDOS (CRÍTICO): Guarde na memória rigorosamente TODAS as pizzas e bebidas que o cliente pedir durante os loops. No resumo final, você DEVE listar CADA UMA das pizzas separadamente e CADA UMA das bebidas.
        13. VALIDAÇÃO DO TELEFONE (CRÍTICO): Quando pedir o telefone de contato do cliente, conte a quantidade de números informados. O número DEVE ter EXATAMENTE 11 dígitos numéricos (2 do DDD + 9 do número). Se o cliente digitar números A MAIS, A MENOS, ou sem o DDD, NÃO AVANCE para o pagamento. Peça de forma meiga e educada para ele corrigir e enviar o número exato com 11 dígitos (ex: 27 99999-9999).
        
        [PROIBIÇÕES ABSOLUTAS]
        1. NUNCA liste marcas de bebidas (use apenas o gatilho obrigatório e o sistema mostrará os botões).
        2. NUNCA liste ingredientes a menos que o cliente pergunte "quais os ingredientes?".
        3. NUNCA repita opções de pagamento, deixe os botões atuarem.
        4. VENDA EXCLUSIVA DE BEBIDAS: É PROIBIDO finalizar um pedido que contenha APENAS bebidas. Se o cliente tentar fechar a compra apenas com refrigerante, explique de forma bem meiga e educada que o delivery e a retirada são realizados apenas para pedidos que incluam pelo menos uma pizza. Aproveite e convide-o a conhecer os sabores do cardápio!

        BASE DE INGREDIENTES (Consultar SOMENTE se perguntado):
        - Muçarela: Muçarela, tomate, azeitonas, orégano.
        - Mista: Muçarela, presunto, tomate, azeitonas, orégano.
        - Frango: Muçarela, frango, milho, tomate, azeitonas, orégano.
        - Calabresa: Muçarela, calabresa, tomate, azeitonas, orégano.
        - 4 Sabores: Muçarela, mista, frango, calabresa.
        - Frango c/ Catupiry: Muçarela, frango, catupiry, milho, tomate, azeitonas, orégano.
        - Calabresa c/ Cebola: Muçarela, calabresa, cebola, tomate, azeitonas, orégano.
        - Palmito: Muçarela, palmito, milho, azeitonas, orégano.
        - Vegetariana: Muçarela, milho, palmito, catupiry, cebola, azeitonas, orégano.
        - Siciliana: Muçarela, bacon, uva passas, palmito, tomate, azeitonas, orégano.
        - Kanal X: Muçarela, frango, bacon, catupiry, milho, azeitonas, orégano.
        - Magiordano: Muçarela, frango, bacon, milho, tomate, azeitonas, orégano.
        - À Moda da Casa: Muçarela, frango, catupiry, milho, palmito, cebola, azeitonas, orégano.
        - Portuguesa: Muçarela, presunto, sardinha, ovo, milho, tomate, azeitonas, orégano.
        - Camarão: Muçarela, camarão, tomate, azeitonas, orégano.
        - Camarão Cremoso: Muçarela, camarão, catupiry, milho, azeitonas, orégano.
        - Italiana: Muçarela, camarão, milho, palmito, azeitonas, orégano.
        - Saborosa: Muçarela, peito de peru, ovo, catupiry, milho, azeitonas, orégano.
        - Pepperoni: Muçarela, pepperoni, azeitonas, orégano.
        - Bacon Chef: Muçarela, bacon, catupiry, azeitonas, orégano.
        - Barcellos Completa: Muçarela, calabresa, frango, presunto, bacon, cebola, pimentão, milho, azeitonas, orégano.
        - Carioca: Muçarela, peito de peru, lombo, bacon, milho, azeitonas, orégano.
        - 3 Queijos: Muçarela, provolone, parmesão, tomate, azeitonas, orégano.
        - 4 Queijos: Muçarela, provolone, parmesão, catupiry, tomate, azeitonas, orégano.
        - Lombo Canadense: Muçarela, lombo canadense, bacon, tomate, milho, azeitonas, orégano.
        - Juparanã: Muçarela, presunto, calabresa, bacon, milho, palmito, azeitonas, orégano.
        - Batata-Frita: Muçarela, calabresa, batata-frita, azeitonas, orégano.
      
        REGRAS DO NEGÓCIO:
        - Horário: Todos os dias, das 18h às 23h30.
        - Cardápio de Pizzas (Nome / Preços: Média | Grande | Gigante | Família):
          * Muçarela, Mista, Frango, Calabresa, 4 Sabores, Palmito: R$47 | R$62 | R$77 | R$104
          * Frango c/ Catupiry, Vegetariana: R$48 | R$63 | R$78 | R$106
          * Calabresa c/ Cebola, Siciliana: R$49 | R$64 | R$79 | R$107
          * Bacon: R$49 | R$64 | R$80 | R$108
          * 3 Queijos, Lombo Canadense: R$49 | R$66 | R$82 | R$111
          * Portuguesa: R$49 | R$65 | R$81 | R$110
          * À Moda da Casa: R$50 | R$65 | R$80 | R$108
          * Kanal X, Magiordano: R$50 | R$65 | R$81 | R$110
          * Bacon Chef: R$50 | R$65 | R$82 | R$111
          * Pepperoni, Juparanã: R$50 | R$66 | R$83 | R$113
          * 4 Queijos, Carioca: R$50 | R$67 | R$84 | R$114
          * Saborosa: R$51 | R$68 | R$85 | R$114
          * Barcellos Completa: R$52 | R$68 | R$85 | R$115
          * Camarão: R$53 | R$72 | R$89 | R$120
          * Batata Frita: R$54 | R$69 | R$86 | R$117
          * Italiana: R$54 | R$73 | R$91 | R$122
          * Camarão Cremoso: R$55 | R$74 | R$93 | R$124
        - Tamanhos: Média (4 fatias), Grande (6 fatias), Gigante (8 fatias) e Família (12 fatias).
        - Meio a Meio: Permitido. É cobrado OBRIGATORIAMENTE sempre o valor do sabor mais caro. Família permite até 3 sabores.
        
        - Bebidas (Tamanhos e Valores):
          * Coca-Cola: 2L (R$ 15,00) | 1,5L Normal/Zero (R$ 13,50) | 600ml (R$ 9,00) | Lata Normal/Zero (R$ 7,00).
          * Coroa: 2L Laranja/Uva/Guaraná/Limão (R$ 10,00) | 1,5L Guaraná (R$ 8,50).
          * Guaraná Antarctica: 2L (R$ 15,00).

        - TAXAS E REGRAS DE ENTREGA:
          * GRÁTIS (R$ 0,00): Nova Esperança, Lagoa Park, Linhares 5 (V), São José, Movelar, Gaivotas, Planalto, Boa Vista, Fonte Grande.
          * R$ 5,00: Interlagos, Aviso, Canivete, Vila Maria, Vila Isabel, Nova Betânia.
          * OUTROS bairros de Linhares: R$ 4,00.
          * LOCAIS SEM ENTREGA: Bagueira, Rio Quartel, Baixo Quartel, Pontal, Farias, Guaxi.

        [FLUXO DE RESUMO E ENVIO]
        1. Ao ter todos os dados (Itens, Retirada/Entrega, Nome, Telefone com DDD, Pagamento), mostre o resumo estruturado exatamente no padrão de maiúsculas/minúsculas exigido.
        2. Pergunte OBRIGATORIAMENTE no final: "Este resumo está correto? Posso enviar o pedido?". AGUARDE o cliente clicar nos botões.
        3. Se o cliente escolher "✅ Confirmar pedido", gere APENAS o resumo final, começando DIRETAMENTE com "*PEDIDO PIZZARIA BARCELLOS* 🍕" e terminando com "Pedido enviado Via TidaChat". É PROIBIDO adicionar frases antes do resumo (como "Oba", "Aqui está", etc).
        4. Se o cliente escolher "🔄 Revisar pedido", pergunte de forma meiga o que ele deseja alterar.
        5. Se o cliente escolher "❌ Cancelar pedido", confirme o cancelamento de forma educada e encerre.

        [FORMATO DO RESUMO - SIGA ESTE PADRÃO EXATO DE MAIÚSCULAS, MINÚSCULAS E EMOJIS]
        *PEDIDO PIZZARIA BARCELLOS* 🍕
        🆔 ID: #[GERE UM ID ALEATÓRIO EX: FNU6G82]

        🛵 MODO: [ENTREGA ou RETIRADA em maiúsculas]
        👤 Cliente: [NOME DO CLIENTE em maiúsculas]
        📞 Tel: [TELEFONE FORMATADO EX: (XX) 99999-9999]
        📍 Local: [ENDEREÇO COMPLETO COM CEP ou "RETIRADA NO BALCÃO"]

        [SÓ EXIBA A LINHA ABAIXO SE O CLIENTE TIVER FEITO ALGUMA OBSERVAÇÃO]:
        📝 *OBSERVAÇÃO:* [DETALHES DA OBSERVAÇÃO EM MAIÚSCULAS]

        ITENS:
        * [QTD] - [SE PIZZA: "PIZZA DE [SABOR (SE MEIO A MEIO USE 1/2 OU 1/3)]"] [SE BEBIDA: "REFRIGERANTE [NOME]"] [TAMANHO] - R$ [VALOR TOTAL DA LINHA (MULTIPLICAR A QTD PELO VALOR UNITÁRIO)]

        --------------------------
        Subtotal: R$ [VALOR]
        Taxa de Entrega: [GRÁTIS 🎁 ou R$ X.XX]
        *TOTAL: R$ [VALOR TOTAL]*
        --------------------------

        💳 Pagamento: [FORMA DE PAGAMENTO EM MAIÚSCULAS]
        [SÓ EXIBA A LINHA ABAIXO SE O PAGAMENTO FOR DINHEIRO E PRECISAR DE TROCO]:
        💵 Troco para: [VALOR DO TROCO]

        Pedido enviado Via TidaChat
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: formattedHistory,
          generationConfig: { temperature: 0.2 }
        })
      });

      const data = await response.json();
      let responseTextFinal = 'Me desculpe, tive um problema de conexão. Pode repetir?';

      if (data.candidates && data.candidates[0].content.parts[0].text) {
        responseTextFinal = data.candidates[0].content.parts[0].text;

        if (responseTextFinal.includes('Pedido enviado Via TidaChat')) {
          const msgSucesso = "Oba! Pedido confirmado! 🎉\n\nEstou abrindo o seu WhatsApp para enviarmos direto para a nossa cozinha! 🛵💨";
          setMessages(prev => [...prev, { id: Date.now(), sender: 'tida', text: msgSucesso }]);

          const whatsappUrl = `https://api.whatsapp.com/send?phone=5527996183495&text=${encodeURIComponent(responseTextFinal)}`;
          const link = document.createElement('a');
          link.href = whatsappUrl;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setTimeout(() => {
            setMessages([{ id: Date.now(), sender: 'tida', text: 'Olá! Sou a Tida, assistente virtual da Pizzaria Barcellos. Como posso te ajudar hoje?' }]);
          }, 2000);

          setIsTyping(false);
          return; 
        }

        setMessages(prev => [...prev, { id: Date.now(), sender: 'tida', text: responseTextFinal }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now(), sender: 'tida', text: responseTextFinal }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'tida', text: 'Ops! Dei uma travadinha aqui. Pode repetir? 😅' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // =========================================================================
  // PROCESSADOR CENTRAL DE MENSAGENS (Intercepta cliques e textos)
  // =========================================================================
  const processMessage = async (userText: string) => {
    if (!userText.trim() || isTyping) return;

    if (!verificarExpediente()) {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'client', text: userText }]);
      setIsTyping(true);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'tida',
          text: 'A pizzaria está fechada, não consigo fazer pedidos, mas você pode agendar seu pedido clicando no botão de Agendar pedido no topo do site. 🌙🍕'
        }]);
        setIsTyping(false);
      }, 500);

      setInputValue('');
      return;
    }

    const newClientMsg: Message = { id: Date.now(), sender: 'client', text: userText };
    const updatedHistory = [...messages, newClientMsg];

    setMessages(updatedHistory);
    setInputValue('');

    const textLower = userText.toLowerCase().trim();
    const faqMatch = TIDA_FAQ.find(item => item.keywords.some(keyword => textLower.includes(keyword)));
    if (faqMatch) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now(), sender: 'tida', text: faqMatch.answer }]);
        setIsTyping(false);
      }, 800);
      return;
    }

    if (userText === '🍕 Fazer novo pedido') {
      setTimeout(() => setMessages(prev => [...prev, { id: Date.now(), sender: 'tida', text: 'Oba! O que vamos pedir hoje?' }]), 500);
      return;
    }

    if (userText === '📖 Conhecer os Sabores') {
      const cardapioText = `Aqui estão os nossos deliciosos sabores! 🍕\n\n*PIZZAS CLÁSSICAS:*\n- Muçarela\n- Mista\n- Frango\n- Calabresa\n- 4 Sabores\n- Frango C/ Catupiry\n- Calabresa C/ Cebola\n- Palmito\n- Vegetariana\n- Siciliana\n- Kanal X\n- À Moda da Casa\n- Magiordano\n- Portuguesa\n\n*PIZZAS PREMIUM:*\n- Camarão\n- Camarão Cremoso\n- Italiana\n- Saborosa\n- Pepperoni\n- Bacon Chef\n- Completa Barcellos\n- Carioca\n- 3 Queijos\n- 4 Queijos\n- Lombo Canadense\n- Juparanã\n- Pizza de Batata-Frita\n\nE aí, já deu água na boca? Oba! O que vamos pedir hoje?`;

      setTimeout(() => setMessages(prev => [...prev, { id: Date.now(), sender: 'tida', text: cardapioText }]), 500);
      return;
    }

    if (userText === '❓ Tirar dúvidas') {
      setTimeout(() => setMessages(prev => [...prev, { id: Date.now(), sender: 'tida', text: 'Claro! Pode me perguntar sobre nosso horário, entrega, valores ou endereço.' }]), 500);
      return;
    }
    if (userText === '🍕 Pizza um sabor') {
      setTimeout(() => setMessages(prev => [...prev, { id: Date.now(), sender: 'tida', text: 'Ótima escolha! Qual sabor de pizza você vai querer?' }]), 500);
      return;
    }
    if (userText === '🍕 Pizza meio a meio') {
      setTimeout(() => setMessages(prev => [...prev, { id: Date.now(), sender: 'tida', text: 'Combinado! Para dividir os sabores, precisamos definir o tamanho. Qual o tamanho da pizza?' }]), 500);
      return;
    }

    let textForGemini = userText;
    const cepMatch = userText.match(/\b\d{2}\.?\d{3}-?\d{3}\b/);
    if (cepMatch) {
      setIsTyping(true);
      const cepLimpo = cepMatch[0].replace(/\D/g, '');
      try {
        const cepResponse = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const cepData = await cepResponse.json();
        if (!cepData.erro) {
          textForGemini = `[O sistema encontrou o CEP ${cepLimpo}. Logradouro: ${cepData.logradouro}, Bairro: ${cepData.bairro}]. OBRIGATÓRIO: Escreva o logradouro exato (${cepData.logradouro}) e o Bairro na sua resposta para o cliente confirmar, informe a taxa de entrega e, em seguida, peça o número da casa e complemento.`;
        }
      } catch (err) { }
    }

    tidaResponseLogic(textForGemini, updatedHistory);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    processMessage(inputValue);
  };

  const handleOptionClick = (option: string) => {
    processMessage(option);
  };

  if (!isIconVisible) {
    return (
      <div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 1000 }}>
        <button
          onClick={() => { setIsIconVisible(true); setIsOpen(true); }}
          title="Chamar Tida"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', transition: 'transform 0.2s' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'radial-gradient(circle, #14532d 0%, #064e3b 100%)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/avataTida.png" alt="Tida" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.90) translateY(8px)' }} />
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="tida-chat-container" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
      <style>{`
        @keyframes tidaGlowPulse { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); } 70% { box-shadow: 0 0 0 15px rgba(34,197,94,0); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } }
        .tida-pulse-active { animation: tidaGlowPulse 2s infinite ease-in-out; }
        .tida-dot { animation: tidaDotBlink 1.4s infinite both; width: 6px; height: 6px; background: white; border-radius: 50%; display: inline-block; }
        @keyframes tidaDotBlink { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } }
        .tida-dot:nth-child(2) { animation-delay: 0.2s; } .tida-dot:nth-child(3) { animation-delay: 0.4s; }
        
        .tida-quick-btn {
           background: white; color: #1B431D; border: 1.5px solid #1B431D; padding: 10px 16px; 
           border-radius: 20px; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: 0.2s;
        }
        .tida-quick-btn:hover { background: #1B431D; color: white; }
      `}</style>

      {isOpen && (
        <div style={{ width: '360px', height: '560px', background: '#FFF8F2', borderRadius: '20px', boxShadow: '0 12px 30px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', overflow: 'hidden', marginBottom: '15px', fontFamily: 'system-ui, -apple-system, sans-serif', border: '1px solid #EADCC9' }}>

          <div style={{ padding: '14px 16px', background: '#FFF8F2', borderBottom: '1px solid #EADCC9', display: 'flex', alignItems: 'center', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#14532d', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/avataTida.png" alt="Tida" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(2.20) translateY(10px)' }} />
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#1B431D', fontSize: '15px', fontWeight: '700' }}>Tida - Assistente Virtual</h4>
                <span style={{ color: '#22C55E', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', background: '#22C55E', borderRadius: '50%' }}></span> Online</span>
              </div>
            </div>
            <div style={{ position: 'absolute', right: '16px', top: '22px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button onClick={() => setMessages([{ id: 1, sender: 'tida', text: 'Olá! Sou a Tida, assistente virtual da Pizzaria Barcellos. Como posso te ajudar hoje?' }])} title="Reiniciar" style={{ background: 'none', border: 'none', color: '#1B431D', fontSize: '16px', cursor: 'pointer' }}>🔄</button>
              <button onClick={() => setIsOpen(false)} title="Minimizar" style={{ background: 'none', border: 'none', color: '#1B431D', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold', marginTop: '-8px' }}>_</button>
              <button onClick={() => setIsIconVisible(false)} title="Ocultar Tida" style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
          </div>

          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ alignSelf: msg.sender === 'client' ? 'flex-end' : 'flex-start', background: msg.sender === 'client' ? '#EAEAEA' : '#1B431D', color: msg.sender === 'client' ? '#111' : 'white', padding: '10px 14px', borderRadius: msg.sender === 'client' ? '14px 14px 2px 14px' : '14px 14px 14px 2px', maxWidth: '85%', fontSize: '14px', lineHeight: '1.4', whiteSpace: 'pre-line' }}>
                {msg.text}
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: '#1B431D', padding: '12px 18px', borderRadius: '14px 14px 14px 2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="tida-dot"></span><span className="tida-dot"></span><span className="tida-dot"></span>
              </div>
            )}

            {!isTyping && activeOptions.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', marginTop: '4px' }}>
                {activeOptions.map(opt => (
                  <button key={opt} onClick={() => handleOptionClick(opt)} className="tida-quick-btn">{opt}</button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} style={{ padding: '14px 16px', background: 'white', borderTop: '1px solid #EADCC9', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="text"
              placeholder={activeOptions.length > 0 ? "Escolha uma das opções acima..." : "Digite sua mensagem..."}
              disabled={isInputDisabled || activeOptions.length > 0}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: activeOptions.length > 0 ? '#999' : '#111' }}
            />
            <button
              type="submit"
              disabled={isInputDisabled || activeOptions.length > 0 || !inputValue.trim() || isTyping}
              style={{ background: 'none', border: 'none', color: (!inputValue.trim() || isTyping || activeOptions.length > 0) ? '#A3B8A4' : '#1B431D', cursor: 'pointer' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>
            </button>
          </form>

        </div>
      )}

      {/* BOTÃO FLUTUANTE (ANIMAÇÃO 15S, MENOR, SEM FANTASMA E SEM BLOQUEAR A TELA) */}
      {!isOpen && (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          
          {/* Balãozinho de texto com Position Absolute para NUNCA bugar o clique */}
          <div style={{ 
            position: 'absolute',
            right: '85px', // Fica à esquerda da bolinha da Tida, sem ocupar espaço real
            background: 'white', color: '#1B431D', padding: '10px 16px', borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: isIdle ? 0 : 1,
            visibility: isIdle ? 'hidden' : 'visible',
            transform: isIdle ? 'translateX(10px) scale(0.95)' : 'translateX(0) scale(1)',
            pointerEvents: 'none', // Garante que o texto é intocável, o clique passa direto
            whiteSpace: 'nowrap' // Impede que o texto quebre de linha
          }}>
            <span style={{ fontWeight: '800', fontSize: '15px', color: '#1B431D' }}>Posso te ajudar?</span>
            <span style={{ fontSize: '11px', color: '#666', fontWeight: '600' }}>Tida - Assistente Virtual</span>
            {/* Triângulo do balão */}
            <div style={{ position: 'absolute', right: '-6px', top: '50%', transform: 'translateY(-50%)', width: '0', height: '0', borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '6px solid white' }}></div>
          </div>
          
          {/* Botão da Tida (Sensor e Clique) */}
          <button 
            onMouseEnter={() => setIsIdle(false)} 
            onClick={() => setIsOpen(true)} 
            style={{ 
              border: 'none', background: 'transparent', cursor: 'pointer',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: isIdle ? 0.4 : 1,
              transform: isIdle ? 'scale(0.75)' : 'scale(1)',
              transformOrigin: 'center'
            }}
          >
            <div className="tida-pulse-active" style={{ width: '74px', height: '74px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '66px', height: '66px', borderRadius: '50%', background: 'radial-gradient(circle, #14532d 0%, #064e3b 100%)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grodnkjmhsk8/b/fotos-pizzaria/o/avataTida.png" alt="Tida" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.90) translateY(13px)' }} />
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default TidaChat;