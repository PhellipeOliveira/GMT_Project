export type Familia = "F1" | "F2" | "F3" | "F4" | "MKT" | "AV";

export type TipoServico = "agente" | "pacote" | "avulso";

export interface Servico {
  slug: string;
  nome: string;
  tipo: TipoServico;
  familia: Familia;
  corPlaceholder: string;
  headline: string;
  problema: string;
  solucao: string;
  beneficios: string[];
  funcionalidades: string[];
  casosDeUso: string[];
  /** Copy do overlay na home (secção «O que fazemos»). */
  homeOverlay?: {
    body: string;
    cta: string;
  };
}

/** Cores de placeholder por família visual (Plano Mestre de Mídia). */
export const CORES_FAMILIA: Record<Familia, string> = {
  F1: "#92400E",
  F2: "#1E3A5F",
  F3: "#3B0764",
  F4: "#0F172A",
  MKT: "#1A3A2A",
  AV: "#1A3A2A",
};

export const servicos: Servico[] = [
  // ===================== AGENTES DE IA — Bloco 1: Hospitalidade (F1) =====================
  {
    slug: "reservas-whatsapp",
    nome: "Reservas via WhatsApp",
    tipo: "agente",
    familia: "F1",
    corPlaceholder: CORES_FAMILIA.F1,
    headline: "Nunca mais perca uma reserva por não atender a tempo.",
    problema:
      "Cada chamada não respondida a meio do serviço é uma mesa que fica vazia.",
    solucao:
      "Recebe, confirma, altera e cancela reservas sozinho no WhatsApp, 24h por dia, e envia lembretes para travar as faltas.",
    beneficios: [
      "Redução de no-shows (~35%)",
      "Atendimento 24h sem ocupar a equipa",
      "Cada conversa registada e pronta a fidelizar",
    ],
    funcionalidades: [
      "Verificação de disponibilidade em tempo real",
      "Confirmação / alteração / cancelamento automático",
      "Lembretes anti-falta",
    ],
    casosDeUso: ["Restaurantes, cafés e bares", "Hotéis e alojamento local"],
  },
  {
    slug: "voz-telefone",
    nome: "Voz para Telefone",
    tipo: "agente",
    familia: "F1",
    corPlaceholder: CORES_FAMILIA.F1,
    headline: "O seu negócio atende mesmo depois de fechar.",
    problema:
      "O telefone toca fora de horas e ninguém atende — é uma venda a sair pela porta.",
    solucao:
      "Atende por voz, responde a horários, localização e menu, e marca reservas mesmo fora de horas.",
    beneficios: [
      "Nenhum contacto perdido, dia e noite",
      "Imagem moderna e tecnológica",
      "Recuperação de vendas que ficavam na rua",
    ],
    funcionalidades: [
      "Atendimento por voz natural",
      "Respostas a dúvidas frequentes",
      "Marcação de reservas por voz + fallback humano",
    ],
    casosDeUso: [
      "Restaurantes com alto volume de chamadas",
      "Negócios com atendimento fora de horário",
    ],
  },
  {
    slug: "cardapio-inteligente",
    nome: "Cardápio Inteligente (RAG)",
    tipo: "agente",
    familia: "F1",
    corPlaceholder: CORES_FAMILIA.F1,
    headline: "Responde a cada dúvida do cliente na hora, no site ou na mesa.",
    problema:
      "Dúvidas sobre ingredientes, alergénios e sugestões sem resposta são pedidos a menos.",
    solucao:
      "Chatbot no site ou QR code na mesa que responde na hora, recomenda pratos e aceita pedidos antecipados.",
    beneficios: [
      "Confiança de clientes com alergias/intolerâncias",
      "Mais decisões de compra, menos hesitação",
      "Equipa livre nas horas de ponta",
    ],
    funcionalidades: [
      "Base RAG do cardápio",
      "Recomendação de pratos",
      "Pedidos antecipados",
    ],
    casosDeUso: [
      "Restaurantes com cardápio extenso ou sazonal",
      "Clientes com restrições alimentares",
    ],
  },
  {
    slug: "reputacao-reviews",
    nome: "Reputação e Reviews",
    tipo: "agente",
    familia: "F1",
    corPlaceholder: CORES_FAMILIA.F1,
    headline: "A sua nota no Google sobe, semana após semana.",
    problema: "A reputação online vale ouro e está a ficar ao acaso.",
    solucao:
      "Pede avaliação no momento certo — satisfeitos vão ao Google, insatisfeitos chegam primeiro a si, em privado.",
    beneficios: [
      "Mais estrelas e visibilidade no mapa",
      "Queixas tratadas a tempo, marca protegida",
      "Mais reservas vindas da reputação",
    ],
    funcionalidades: [
      "Pedido de avaliação automático",
      "Análise de sentimento e direcionamento",
      "Captura interna de feedback negativo",
    ],
    casosDeUso: ["Negócios que dependem de avaliações locais"],
  },
  {
    slug: "relatorio-semanal",
    nome: "Relatório Semanal para o Dono",
    tipo: "agente",
    familia: "F1",
    corPlaceholder: CORES_FAMILIA.F1,
    headline: "O seu negócio resumido em dois minutos, toda a semana.",
    problema: "Gerir às cegas custa caro.",
    solucao:
      "Reúne reservas, avaliações e redes sociais e entrega um resumo claro no WhatsApp ou em PDF.",
    beneficios: [
      "Decisões com dados, não intuição",
      "Sem folhas de cálculo",
      "Controlo total do negócio",
    ],
    funcionalidades: [
      "Coleta automática de dados",
      "Resumo em linguagem natural",
      "Entrega por WhatsApp ou PDF",
    ],
    casosDeUso: ["Donos que querem visão semanal sem esforço"],
  },

  // ===================== AGENTES DE IA — Bloco 2: Serviços Locais (F2) =====================
  {
    slug: "agendamento-universal",
    nome: "Agendamento Universal",
    tipo: "agente",
    familia: "F2",
    corPlaceholder: CORES_FAMILIA.F2,
    headline: "A sua agenda enche-se sozinha, sem ninguém ao telefone.",
    problema: "Cada chamada perdida é uma marcação que não aconteceu.",
    solucao:
      "Atende no WhatsApp ou site, abre a agenda, marca, confirma e lembra cada cliente automaticamente.",
    beneficios: [
      "Fim das faltas",
      "Recepção liberta",
      "Marcação em segundos, a qualquer hora",
    ],
    funcionalidades: [
      "Integração com calendário existente",
      "Regras de disponibilidade",
      "Confirmações e lembretes",
    ],
    casosDeUso: ["Clínicas, salões, personal trainers, imobiliárias"],
  },
  {
    slug: "follow-up-clientes",
    nome: "Follow-up de Clientes",
    tipo: "agente",
    familia: "F2",
    corPlaceholder: CORES_FAMILIA.F2,
    headline: "Transforme quem veio uma vez em cliente habitual.",
    problema: "O cliente que já o conhece esquece-o sem contacto.",
    solucao:
      "Acompanha cada cliente depois do serviço, sugere novo agendamento e ativa promoções de regresso.",
    beneficios: [
      "Mais retorno de clientes (LTV)",
      "Presença sem esforço manual",
      "Agenda sempre aquecida",
    ],
    funcionalidades: [
      "Sequências automáticas pós-serviço",
      "Ofertas de regresso",
      "Registo de respostas",
    ],
    casosDeUso: ["Negócios de serviço recorrente"],
  },
  {
    slug: "triagem-documentos",
    nome: "Triagem de Documentos",
    tipo: "agente",
    familia: "F2",
    corPlaceholder: CORES_FAMILIA.F2,
    headline: "O fim das horas perdidas a arquivar papelada.",
    problema: "Afogado em PDFs, fotos e papéis, com dados que se perdem.",
    solucao:
      "Recebe documentos por WhatsApp, classifica, extrai a informação e organiza tudo numa base pronta a consultar.",
    beneficios: [
      "Mais tempo e menos erros de transcrição",
      "Mais capacidade sem contratar",
      "Imagem moderna e eficiente",
    ],
    funcionalidades: [
      "Extração com leitura de layout",
      "Classificação automática",
      "Armazenamento estruturado",
    ],
    casosDeUso: ["Imobiliárias, contabilistas, advogados"],
  },
  {
    slug: "cobranca-automatica",
    nome: "Cobrança Automática",
    tipo: "agente",
    familia: "F2",
    corPlaceholder: CORES_FAMILIA.F2,
    headline: "Cada marcação garantida com pagamento à cabeça.",
    problema: "Marcações que não aparecem custam dinheiro real.",
    solucao:
      "Envia link de pagamento no WhatsApp no momento do agendamento e só garante o horário com o pagamento confirmado.",
    beneficios: [
      "Fim das faltas e prejuízos",
      "Fluxo de caixa previsível",
      "Imagem profissional desde o primeiro contacto",
    ],
    funcionalidades: [
      "Geração de link de pagamento",
      "Confirmação antes de garantir slot",
      "Registo de pagamentos",
    ],
    casosDeUso: ["Consultas, sessões e serviços por marcação"],
  },

  // ===================== AGENTES DE IA — Bloco 3: Marketing com IA (F3) =====================
  {
    slug: "criacao-conteudo",
    nome: "Criação de Conteúdo Autónomo",
    tipo: "agente",
    familia: "F3",
    corPlaceholder: CORES_FAMILIA.F3,
    headline: "Um calendário editorial pronto a aprovar, todos os meses.",
    problema: "Sabe que devia publicar, mas falta-lhe tempo e ideias.",
    solucao:
      "Pesquisa tendências, escreve, revê-se a si próprio e entrega um calendário editorial pronto a aprovar.",
    beneficios: [
      "Mais publicações no mesmo tempo",
      "Marca ativa e relevante",
      "Atração de seguidores que viram clientes",
    ],
    funcionalidades: [
      "Pesquisa de tendências",
      "Escritor + crítico (revisão automática)",
      "Calendário editorial e fluxo de aprovação",
    ],
    casosDeUso: ["Negócios que querem presença constante"],
  },
  {
    slug: "monitor-concorrencia",
    nome: "Monitor de Concorrência",
    tipo: "agente",
    familia: "F3",
    corPlaceholder: CORES_FAMILIA.F3,
    headline: "Saiba, toda a semana, o que a concorrência anda a fazer.",
    problema: "Decisões tomadas tarde, com base em palpites.",
    solucao:
      "Vigia preços, redes e novidades dos concorrentes e entrega um relatório claro e acionável.",
    beneficios: [
      "Antecipa movimentos do mercado",
      "Decisões com base em informação real",
      "Visão competitiva dos grandes",
    ],
    funcionalidades: [
      "Monitorização semanal",
      "Síntese acionável",
      "Histórico de relatórios",
    ],
    casosDeUso: ["Setores de alta concorrência local"],
  },
  {
    slug: "relatorio-performance",
    nome: "Relatório de Performance de Marketing",
    tipo: "agente",
    familia: "F3",
    corPlaceholder: CORES_FAMILIA.F3,
    headline: "Veja o retorno real dos seus anúncios num minuto.",
    problema: "Investe em anúncios sem saber o que dá retorno.",
    solucao: "Liga Google Analytics e Meta Ads e traduz os números num PDF claro.",
    beneficios: [
      "Investimento com confiança",
      "Mais orçamento no que funciona",
      "Clareza que transforma gasto em lucro",
    ],
    funcionalidades: [
      "Integração GA4 + Meta Ads",
      "Insights em linguagem natural",
      "Relatório PDF automático",
    ],
    casosDeUso: ["Quem já faz anúncios pagos"],
  },
  {
    slug: "qualificacao-leads",
    nome: "Qualificação de Leads",
    tipo: "agente",
    familia: "F3",
    corPlaceholder: CORES_FAMILIA.F3,
    headline: "Nenhum lead fica sem resposta — você fala só com quem decide.",
    problema:
      "Nem todos os contactos valem o seu tempo, mas todos merecem resposta imediata.",
    solucao:
      "Recebe cada lead do site, conversa, qualifica e avisa-o no momento exato em que está pronto para comprar.",
    beneficios: [
      "Mais conversões, menos tempo desperdiçado",
      "Funil que trabalha sozinho",
      "Resposta antes da concorrência",
    ],
    funcionalidades: [
      "Sequências de qualificação",
      "Scoring de leads",
      "Notificação no momento certo",
    ],
    casosDeUso: ["Negócios com fluxo de leads pelo site"],
  },

  // ===================== AGENTES DE IA — Bloco 4: Premium / Custom (F4) =====================
  {
    slug: "grafos-personalizados",
    nome: "Grafos Personalizados (Premium)",
    tipo: "agente",
    familia: "F4",
    corPlaceholder: CORES_FAMILIA.F4,
    headline: "Automação feita à medida do seu processo mais complexo.",
    problema:
      "Tem um processo complexo e repetitivo que consome a sua equipa todos os dias.",
    solucao:
      "Mapeamos cada etapa e transformamo-la numa solução automatizada que corre sem falhas.",
    beneficios: [
      "Liberta pessoas para tarefas que rendem",
      "Elimina erros repetidos",
      "Cresce sem contratar na mesma proporção",
    ],
    funcionalidades: [
      "Fase de descoberta / mapeamento",
      "Solução sob medida",
      "Observabilidade e suporte",
    ],
    casosDeUso: ["Empresas com processos internos pesados"],
  },
  {
    slug: "onboarding-clientes",
    nome: "Onboarding de Clientes",
    tipo: "agente",
    familia: "F4",
    corPlaceholder: CORES_FAMILIA.F4,
    headline:
      "Um onboarding que corre sozinho, impecável desde o primeiro minuto.",
    problema: "Um onboarding confuso afasta clientes logo à partida.",
    solucao:
      "Automatiza a entrada de cada novo cliente: recolhe dados, configura tudo, gera o contrato e confirma.",
    beneficios: [
      "Mais clientes sem esforço manual",
      "Imagem moderna e organizada",
      "Relações que começam com o pé direito",
    ],
    funcionalidades: [
      "Coleta de dados via chat",
      "Geração de contrato",
      "Cobrança e confirmação",
    ],
    casosDeUso: ["Negócios com alto volume de novos clientes"],
  },

  // ===================== MARKETING DIGITAL — Pacotes (MKT) =====================
  {
    slug: "pacote-essencial",
    nome: "Pacote Essencial",
    tipo: "pacote",
    familia: "MKT",
    corPlaceholder: CORES_FAMILIA.MKT,
    headline: "Para pequenas empresas a iniciar a presença digital.",
    problema:
      "O seu negócio existe, mas online quase não aparece — e quem não aparece perde os clientes para quem aparece primeiro.",
    solucao: "",
    beneficios: [
      "Identidade e presença desde a primeira semana",
      "Publicações consistentes sem esforço seu",
      "Uma marca que parece o que já é: séria e presente",
    ],
    funcionalidades: [
      "Identidade visual básica (logótipo, cores, tipografia)",
      "Criação e configuração de perfis (Instagram e Facebook)",
      "3 publicações por semana (imagens e vídeos curtos)",
      "Gestão básica de redes sociais",
      "Planeamento mensal de conteúdo",
      "Suporte contínuo via WhatsApp",
    ],
    casosDeUso: [],
  },
  {
    slug: "pacote-crescimento",
    nome: "Pacote Crescimento",
    tipo: "pacote",
    familia: "MKT",
    corPlaceholder: CORES_FAMILIA.MKT,
    headline: "Para empresas já online que querem expandir.",
    problema:
      "Já está online, mas o crescimento estagnou. Mais publicações não chegam quando falta estratégia, publicidade e um site que converte.",
    solucao: "Inclui tudo do Essencial, mais:",
    beneficios: [
      "Presença, tráfego pago e site a trabalhar juntos",
      "Decisões guiadas por dados reais",
      "Crescimento com direção, não ao acaso",
    ],
    funcionalidades: [
      "Website profissional (landing page ou institucional)",
      "Estratégia de conteúdo personalizada",
      "5 publicações/semana + 4 vídeos/mês",
      "Publicidade paga (Meta Ads ou Google Ads)",
      "Google Analytics e rastreamento",
      "Relatórios mensais de performance",
      "SEO básico",
    ],
    casosDeUso: [],
  },
  {
    slug: "pacote-premium",
    nome: "Pacote Premium",
    tipo: "pacote",
    familia: "MKT",
    corPlaceholder: CORES_FAMILIA.MKT,
    headline: "Para empresas que querem dominar o digital.",
    problema:
      "Quer dominar o digital no seu setor, não apenas marcar presença — ser a referência, não mais um nome.",
    solucao: "Inclui tudo do Crescimento, mais:",
    beneficios: [
      "Todos os canais a trabalhar em conjunto",
      "Tecnologia de IA a poupar tempo e a multiplicar qualidade",
      "A referência do setor na cabeça dos clientes",
    ],
    funcionalidades: [
      "Chatbot inteligente (WhatsApp, site ou Telegram)",
      "Branding completo (valores, visão, missão, posicionamento)",
      "Conteúdo intensivo (vídeos profissionais, artigos, carrosséis)",
      "Gestão completa de múltiplos canais",
      "Campanhas em Meta Ads + Google Ads",
      "SEO avançado contínuo",
      "Automação de marketing e atendimento",
      "Assistente virtual personalizado",
      "Suporte prioritário e reuniões regulares",
    ],
    casosDeUso: [],
  },

  // ===================== SERVIÇOS AVULSOS (AV) =====================
  {
    slug: "criacao-conteudo-avulso",
    nome: "Criação de Conteúdo",
    tipo: "avulso",
    familia: "AV",
    corPlaceholder: CORES_FAMILIA.AV,
    headline: "Conteúdo profissional, pronto a publicar, sem lhe ocupar uma hora.",
    problema:
      "Criar vídeos, carrosséis e artigos de qualidade todos os meses consome o tempo que não tem — e cada semana sem publicar é visibilidade que a concorrência aproveita.",
    solucao:
      "Produzimos o conteúdo que o seu negócio precisa, do design ao vídeo curto para redes sociais, ao artigo que posiciona no LinkedIn e no Google — entregue pronto a publicar, com a sua identidade.",
    beneficios: [
      "Presença constante sem esforço seu",
      "Conteúdo com a sua identidade e a mensagem certa",
      "Mais alcance enquanto poupa tempo",
    ],
    funcionalidades: [
      "Vídeos curtos para redes sociais",
      "Carrosséis para Instagram",
      "Artigos para blog ou LinkedIn",
      "Design gráfico (banners, posts, stories)",
      "Fotografia e produção visual",
    ],
    casosDeUso: [],
    homeOverlay: {
      body: "Sabe que o conteúdo é o que atrai, mas criar vídeos, carrosséis e artigos de qualidade todos os meses consome tempo que não tem. Cada semana sem publicar é visibilidade que a concorrência aproveita. Produzimos o conteúdo que o seu negócio precisa, do design ao vídeo curto para redes sociais, ao artigo que posiciona no LinkedIn ou no Google. Entregamos pronto a publicar, com a sua identidade e a mensagem certa para quem você quer alcançar. O seu negócio aparece, você não perde uma hora a criar.",
      cta: "Quer ver o que produzimos para marcas como a sua?",
    },
  },
  {
    slug: "publicidade-digital",
    nome: "Publicidade Digital",
    tipo: "avulso",
    familia: "AV",
    corPlaceholder: CORES_FAMILIA.AV,
    headline: "Anúncios que trabalham por um único número: o retorno.",
    problema:
      "Já gastou dinheiro em anúncios sem perceber se resultou. O problema raramente é o orçamento — é a campanha mal configurada que come o dinheiro sem trazer clientes.",
    solucao:
      "Configuramos, gerimos e otimizamos campanhas no Meta Ads e no Google Ads, ajustando audiências, criativos e lances de forma contínua para cada euro render mais.",
    beneficios: [
      "Campanhas focadas em leads e vendas",
      "Otimização contínua do investimento",
      "Cada euro a trabalhar mais",
    ],
    funcionalidades: [
      "Configuração de campanha Meta Ads",
      "Configuração de campanha Google Ads",
      "Gestão mensal de tráfego pago",
      "Otimização de campanhas existentes",
      "Geração e qualificação de leads",
    ],
    casosDeUso: [],
    homeOverlay: {
      body: "Já gastou dinheiro em anúncios sem perceber se resultou. O problema raramente é o orçamento — é a campanha mal configurada que come o dinheiro sem trazer clientes. Configuramos, gerimos e otimizamos campanhas no Meta Ads e no Google Ads com foco num único número: o retorno. Desde a estrutura inicial ao ajuste contínuo de audiências, criativos e lances, cada euro trabalha mais. Campanhas que geram leads, campanhas que geram vendas, ou as duas ao mesmo tempo. Você define o objetivo, nós fazemos os anúncios trabalhar por ele.",
      cta: "Quer uma análise das suas campanhas atuais, sem compromisso?",
    },
  },
  {
    slug: "branding-estrategia",
    nome: "Branding & Estratégia",
    tipo: "avulso",
    familia: "AV",
    corPlaceholder: CORES_FAMILIA.AV,
    headline: "Uma marca alinhada faz o marketing render o dobro.",
    problema:
      "Uma identidade visual inconsistente e um posicionamento indefinido custam clientes antes de eles sequer entrarem em contacto.",
    solucao:
      "Criamos ou refinamos a sua identidade completa — logótipo, cores, tipografia, valores, missão e visão — e a estratégia que liga tudo isso ao crescimento real.",
    beneficios: [
      "Identidade coerente em todos os pontos de contacto",
      "Posicionamento claro e com propósito",
      "Marketing mais eficaz com o mesmo esforço",
    ],
    funcionalidades: [
      "Identidade visual completa",
      "Refinamento de branding existente",
      "Definição de valores, visão e missão",
      "Estratégia de marketing digital",
      "Consultoria estratégica (sessões)",
    ],
    casosDeUso: [],
    homeOverlay: {
      body: "A sua marca já existe — mas os clientes veem-na como você quer que a vejam? Uma identidade visual inconsistente e um posicionamento indefinido custam clientes antes de eles sequer entrarem em contacto. Criamos ou refinamos a sua identidade completa: logótipo, cores, tipografia, valores, missão e visão, e a estratégia que liga tudo isso ao crescimento real. Da consultoria pontual à transformação completa do branding, cada decisão é tomada com propósito. Quando a marca está alinhada, o marketing rende o dobro com o mesmo esforço.",
      cta: "Quer perceber onde o seu branding está a perder dinheiro?",
    },
  },
  {
    slug: "websites",
    nome: "Websites",
    tipo: "avulso",
    familia: "AV",
    corPlaceholder: CORES_FAMILIA.AV,
    headline: "Um site que carrega rápido, aparece no Google e converte.",
    problema:
      "O seu site ou não existe, ou existe mas não converte. Cada visitante que sai sem contactar é um cliente que foi à concorrência a seguir.",
    solucao:
      "Criamos landing pages e sites institucionais rápidos e otimizados — WordPress, SEO, velocidade e performance — para transformar visitas em contactos.",
    beneficios: [
      "Presença que trabalha enquanto você dorme",
      "Velocidade e SEO cuidados ao detalhe",
      "Visitas transformadas em contactos",
    ],
    funcionalidades: [
      "Landing page",
      "Site institucional",
      "Manutenção WordPress",
      "Otimização de velocidade e performance",
      "SEO",
    ],
    casosDeUso: [],
    homeOverlay: {
      body: "O seu site ou não existe, ou existe mas não converte. Cada visitante que sai sem contactar é um potencial cliente que foi ao site da concorrência a seguir. Criamos landing pages e sites institucionais que carregam rápido, aparecem no Google e transformam visitas em contactos. WordPress, SEO, velocidade e performance — tudo cuidado para que o seu site trabalhe enquanto você dorme. Não é só uma montra: é a peça central da sua presença digital a puxar clientes todos os dias.",
      cta: "Quer ver exemplos do que construímos?",
    },
  },
  {
    slug: "inteligencia-artificial",
    nome: "Inteligência Artificial",
    tipo: "avulso",
    familia: "AV",
    corPlaceholder: CORES_FAMILIA.AV,
    headline: "Assistentes virtuais que parecem parte da sua equipa.",
    problema:
      "Quer automatizar o atendimento mas não sabe por onde começar. Um chatbot mal feito frustra os clientes; um bem feito parece parte da sua equipa.",
    solucao:
      "Desenvolvemos assistentes virtuais para WhatsApp, website e Telegram, ligados ao conhecimento do seu negócio, para responder, qualificar e encaminhar clientes em segundos.",
    beneficios: [
      "Atendimento imediato, dia e noite",
      "Configurado à medida do seu processo",
      "Nunca perde um contacto por falta de disponibilidade",
    ],
    funcionalidades: [
      "Chatbot para WhatsApp",
      "Chatbot para website",
      "Chatbot para Telegram",
      "Assistente virtual personalizado",
      "Automação de atendimento",
    ],
    casosDeUso: [],
    homeOverlay: {
      body: "Quer automatizar o atendimento mas não sabe por onde começar? Um chatbot mal feito frustra os clientes; um bem feito parece parte da sua equipa. Desenvolvemos assistentes virtuais para WhatsApp, website e Telegram, ligados ao conhecimento do seu negócio e capazes de responder, qualificar e encaminhar clientes em segundos. Cada solução é configurada à medida do seu processo, testada antes de ir a ar e entregue com suporte. Você atende mais, com menos esforço, e nunca perde um contacto por falta de disponibilidade.",
      cta: "Quer um chatbot adaptado ao seu negócio?",
    },
  },
  {
    slug: "analytics-otimizacao",
    nome: "Analytics & Otimização",
    tipo: "avulso",
    familia: "AV",
    corPlaceholder: CORES_FAMILIA.AV,
    headline: "Decisões de marketing com dados reais, não palpites.",
    problema:
      "Sem tracking correto, o Google Analytics mente, o Meta Pixel perde conversões e o dinheiro investido em anúncios desaparece sem rasto.",
    solucao:
      "Configuramos o GA4, o Tag Manager e o Meta Pixel corretamente, auditamos o que já tem e entregamos relatórios claros sobre onde está o retorno e o desperdício.",
    beneficios: [
      "Tracking fiável e completo",
      "Relatórios que mostram o retorno real",
      "Marketing gerido como um ativo, não uma despesa",
    ],
    funcionalidades: [
      "Configuração Google Analytics 4",
      "Configuração Google Tag Manager",
      "Configuração Meta Pixel",
      "Auditoria de marketing digital",
      "Relatórios personalizados de performance",
    ],
    casosDeUso: [],
    homeOverlay: {
      body: "Está a tomar decisões de marketing sem saber o que realmente está a acontecer. Sem tracking correto, o Google Analytics mente, o Meta Pixel perde conversões e o dinheiro investido em anúncios desaparece sem rasto. Configuramos o GA4, o Tag Manager e o Meta Pixel corretamente, auditamos o que já tem e entregamos relatórios que mostram, de forma clara, onde está o retorno e onde está o desperdício. Com dados reais, cada decisão passa a ser uma aposta informada. O seu marketing começa a ser gerido como um ativo, não como uma despesa.",
      cta: "Quer saber o que o seu tracking atual está a perder?",
    },
  },
];

export function getServicoBySlug(slug: string): Servico | undefined {
  return servicos.find((s) => s.slug === slug);
}

/** Serviço anterior/próximo na ordem de `servicos` (lista completa, loop circular). */
export function getAdjacentServicos(slug: string): {
  prev: Servico;
  next: Servico;
} {
  const index = servicos.findIndex((s) => s.slug === slug);
  if (index === -1) {
    throw new Error(`Serviço não encontrado: ${slug}`);
  }
  const len = servicos.length;
  return {
    prev: servicos[(index - 1 + len) % len],
    next: servicos[(index + 1) % len],
  };
}

export const agentes = servicos.filter((s) => s.tipo === "agente");
export const pacotes = servicos.filter((s) => s.tipo === "pacote");
export const avulsos = servicos.filter((s) => s.tipo === "avulso");
