// Descreve os campos editáveis de cada página no admin (aba "Páginas").
// "key" é o caminho dentro do conteúdo da página (ex.: "about.title" em home).
import type { PageKey } from './defaults';

export type SimpleFieldType = 'text' | 'textarea' | 'image' | 'link';

export interface SimpleField {
  type: SimpleFieldType;
  key: string;
  label: string;
  help?: string;
  rows?: number;
}

export interface ListField {
  type: 'list';
  key: string;
  label: string;
  help?: string;
  itemLabel: string;
  titleKey?: string;
  fields: SimpleField[];
}

export type Field = SimpleField | ListField;

export interface Section {
  title: string;
  description?: string;
  fields: Field[];
}

export interface PageSchema {
  key: PageKey;
  label: string;
  path?: string;
  description: string;
  sections: Section[];
}

const text = (key: string, label: string, help?: string): SimpleField => ({ type: 'text', key, label, help });
const area = (key: string, label: string, help?: string, rows = 3): SimpleField => ({ type: 'textarea', key, label, help, rows });
const image = (key: string, label: string, help?: string): SimpleField => ({ type: 'image', key, label, help });
const link = (key: string, label: string, help?: string): SimpleField => ({ type: 'link', key, label, help });

const LINES = 'Uma informação por linha.';
const PARAGRAPHS = 'Deixe uma linha em branco para separar parágrafos.';
const HIDE_IF_EMPTY = 'Deixe em branco para esconder.';

const cta = (prefix = 'cta'): Field[] => [
  text(`${prefix}Title`, 'Título'),
  area(`${prefix}Text`, 'Texto', undefined, 2),
  text(`${prefix}PrimaryText`, 'Botão principal', HIDE_IF_EMPTY),
  link(`${prefix}PrimaryLink`, 'Link do botão principal'),
  text(`${prefix}SecondaryText`, 'Botão secundário', HIDE_IF_EMPTY),
  link(`${prefix}SecondaryLink`, 'Link do botão secundário'),
];

const hero = (): Section => ({
  title: 'Topo da página',
  fields: [text('heroTitle', 'Título'), area('heroSubtitle', 'Subtítulo', undefined, 2)],
});

export const PAGE_SCHEMAS: PageSchema[] = [
  {
    key: 'home',
    label: 'Início',
    path: '/',
    description: 'Carrossel, textos de apresentação, números e chamadas da página inicial.',
    sections: [
      {
        title: 'Carrossel',
        description: 'Imagens grandes do topo da página. Recomendado: imagens na horizontal, com pelo menos 1600px de largura.',
        fields: [
          {
            type: 'list',
            key: 'slides',
            label: 'Slides',
            itemLabel: 'Slide',
            titleKey: 'title',
            fields: [
              image('image', 'Imagem'),
              text('title', 'Título'),
              area('subtitle', 'Subtítulo', undefined, 2),
              text('buttonText', 'Texto do botão', 'Deixe em branco para não mostrar botão.'),
              link('buttonLink', 'Link do botão'),
            ],
          },
        ],
      },
      {
        title: 'Apresentação',
        fields: [
          text('about.title', 'Título'),
          area('about.text', 'Texto', undefined, 4),
          text('about.missionTitle', 'Título — Missão'),
          area('about.missionText', 'Texto — Missão'),
          text('about.visionTitle', 'Título — Visão'),
          area('about.visionText', 'Texto — Visão'),
          text('about.valuesTitle', 'Título — Valores'),
          area('about.valuesText', 'Texto — Valores'),
          text('about.buttonText', 'Texto do botão', HIDE_IF_EMPTY),
          link('about.buttonLink', 'Link do botão'),
        ],
      },
      {
        title: 'Impacto em números',
        fields: [
          text('impact.title', 'Título'),
          text('impact.subtitle', 'Subtítulo'),
          {
            type: 'list',
            key: 'impact.items',
            label: 'Números',
            help: 'Use {anos} no número para mostrar a idade da Missão, atualizada automaticamente.',
            itemLabel: 'Número',
            titleKey: 'label',
            fields: [
              text('icon', 'Ícone (emoji)'),
              text('number', 'Número'),
              text('label', 'Descrição'),
            ],
          },
        ],
      },
      {
        title: 'Seção de projetos',
        description: 'Só aparece quando há projetos ativos.',
        fields: [
          text('projects.title', 'Título'),
          text('projects.subtitle', 'Subtítulo'),
          text('projects.cardButton', 'Botão dos cards'),
          text('projects.button', 'Botão "ver todos"'),
        ],
      },
      {
        title: 'Como ajudar',
        fields: [
          text('help.title', 'Título'),
          text('help.subtitle', 'Subtítulo'),
          text('help.donationTitle', 'Card 1 — Título'),
          area('help.donationText', 'Card 1 — Texto'),
          text('help.donationButton', 'Card 1 — Botão'),
          link('help.donationLink', 'Card 1 — Link'),
          text('help.missionaryTitle', 'Card 2 — Título'),
          area('help.missionaryText', 'Card 2 — Texto'),
          text('help.missionaryButton', 'Card 2 — Botão'),
          link('help.missionaryLink', 'Card 2 — Link'),
        ],
      },
      {
        title: 'Seção de notícias',
        description: 'Só aparece quando há notícias ativas.',
        fields: [
          text('news.title', 'Título'),
          text('news.subtitle', 'Subtítulo'),
          text('news.cardButton', 'Botão dos cards'),
          text('news.button', 'Botão "ver todas"'),
        ],
      },
    ],
  },
  {
    key: 'about',
    label: 'Quem Somos',
    path: '/quem-somos',
    description: 'História, missão, linha do tempo, equipe e transparência.',
    sections: [
      hero(),
      {
        title: 'Nossa história',
        fields: [
          text('historyTitle', 'Título'),
          area('historyText', 'Texto', PARAGRAPHS, 8),
          text('missionTitle', 'Título — Missão'),
          area('missionText', 'Texto — Missão'),
          text('visionTitle', 'Título — Visão'),
          area('visionText', 'Texto — Visão'),
          text('valuesTitle', 'Título — Valores'),
          area('valuesText', 'Texto — Valores'),
        ],
      },
      {
        title: 'Linha do tempo',
        fields: [
          text('timelineTitle', 'Título'),
          text('timelineHint', 'Dica abaixo da linha do tempo'),
          {
            type: 'list',
            key: 'timeline',
            label: 'Marcos',
            itemLabel: 'Marco',
            titleKey: 'year',
            fields: [text('year', 'Ano'), text('title', 'Título'), area('description', 'Descrição', undefined, 2)],
          },
        ],
      },
      {
        title: 'Nossa equipe',
        description: 'Fotos quadradas ficam melhores (são exibidas em círculo).',
        fields: [
          text('teamTitle', 'Título'),
          {
            type: 'list',
            key: 'team',
            label: 'Membros',
            itemLabel: 'Membro',
            titleKey: 'name',
            fields: [
              image('image', 'Foto'),
              text('name', 'Nome'),
              text('role', 'Cargo'),
              area('description', 'Descrição', undefined, 2),
            ],
          },
        ],
      },
      {
        title: 'Transparência',
        fields: [
          text('transparencyTitle', 'Título'),
          area('transparencyText', 'Texto'),
          {
            type: 'list',
            key: 'transparencyCards',
            label: 'Cards',
            itemLabel: 'Card',
            titleKey: 'title',
            fields: [text('title', 'Título'), area('text', 'Texto', undefined, 2)],
          },
          text('transparencyButton', 'Botão para a página de Transparência', HIDE_IF_EMPTY),
        ],
      },
      { title: 'Chamada final', fields: cta() },
    ],
  },
  {
    key: 'projects',
    label: 'Projetos',
    path: '/projetos',
    description: 'Textos da página de projetos. Os projetos em si são cadastrados na aba "Projetos".',
    sections: [
      hero(),
      {
        title: 'Lista de projetos',
        fields: [
          text('allLabel', 'Filtro "todos"'),
          text('gridLabel', 'Botão "grade"'),
          text('mapLabel', 'Botão "mapa"'),
          text('mapTitle', 'Título do mapa'),
          text('mapSubtitle', 'Subtítulo do mapa'),
          text('mapLegend', 'Legenda do mapa'),
          text('countLabel', 'Texto após a contagem'),
          text('goalLabel', 'Título da meta'),
          text('raisedLabel', 'Rótulo "arrecadado"'),
          text('goalShortLabel', 'Rótulo "meta"'),
          text('supportButton', 'Botão de apoio'),
          link('supportLink', 'Link padrão do botão de apoio', 'Usado quando o projeto não tem link de doação próprio.'),
          text('emptyTitle', 'Título quando não há projetos'),
          area('emptyText', 'Texto quando não há projetos', undefined, 2),
        ],
      },
      {
        title: 'Impacto geral',
        fields: [
          text('statsTitle', 'Título'),
          {
            type: 'list',
            key: 'stats',
            label: 'Números',
            help: 'Use {anos} para a idade da Missão.',
            itemLabel: 'Número',
            titleKey: 'label',
            fields: [text('number', 'Número'), text('label', 'Descrição')],
          },
        ],
      },
      { title: 'Chamada final', fields: cta() },
    ],
  },
  {
    key: 'news',
    label: 'Notícias',
    path: '/noticias',
    description: 'Textos das páginas de notícias. As notícias em si são cadastradas na aba "Notícias".',
    sections: [
      hero(),
      {
        title: 'Lista de notícias',
        fields: [
          text('searchPlaceholder', 'Campo de busca'),
          text('allCategories', 'Filtro "todas"'),
          text('featuredTitle', 'Título do destaque'),
          text('featuredButton', 'Botão do destaque'),
          text('othersTitle', 'Título "outras notícias"'),
          text('listTitle', 'Título da lista (demais páginas)'),
          text('countLabel', 'Texto após a contagem'),
          text('cardButton', 'Botão dos cards'),
          text('noResults', 'Mensagem sem resultados na busca'),
          text('emptyTitle', 'Título quando não há notícias'),
          area('emptyText', 'Texto quando não há notícias', undefined, 2),
          text('previous', 'Botão "anterior"'),
          text('next', 'Botão "próxima"'),
        ],
      },
      {
        title: 'Chamada final (lista)',
        fields: [
          text('ctaTitle', 'Título'),
          area('ctaText', 'Texto', undefined, 2),
          text('ctaButton', 'Botão'),
          link('ctaLink', 'Link do botão'),
        ],
      },
      {
        title: 'Página da notícia',
        fields: [
          text('detailBack', 'Botão "voltar"'),
          text('detailShare', 'Rótulo "compartilhar"'),
          text('detailRelated', 'Título "outras notícias"'),
          text('detailNotFound', 'Mensagem de notícia não encontrada'),
          ...cta('detailCta'),
        ],
      },
    ],
  },
  {
    key: 'help',
    label: 'Como Ajudar',
    path: '/como-ajudar',
    description: 'Formas de contribuir, voluntariado e formulário de interesse.',
    sections: [
      hero(),
      {
        title: 'Formas de contribuir',
        fields: [
          text('waysTitle', 'Título'),
          text('waysSubtitle', 'Subtítulo'),
          {
            type: 'list',
            key: 'ways',
            label: 'Cards',
            itemLabel: 'Card',
            titleKey: 'title',
            fields: [
              text('title', 'Título'),
              area('description', 'Descrição', undefined, 2),
              text('buttonText', 'Botão', HIDE_IF_EMPTY),
              link('buttonLink', 'Link do botão'),
            ],
          },
        ],
      },
      {
        title: 'Como a doação é utilizada',
        fields: [
          text('usageTitle', 'Título'),
          {
            type: 'list',
            key: 'usage',
            label: 'Itens',
            itemLabel: 'Item',
            titleKey: 'title',
            fields: [text('title', 'Título'), text('description', 'Descrição')],
          },
        ],
      },
      {
        title: 'Voluntariado',
        fields: [
          text('volunteerTitle', 'Título'),
          text('volunteerSubtitle', 'Subtítulo'),
          {
            type: 'list',
            key: 'volunteer',
            label: 'Oportunidades',
            itemLabel: 'Oportunidade',
            titleKey: 'title',
            fields: [text('title', 'Título'), area('description', 'Descrição', undefined, 2)],
          },
        ],
      },
      {
        title: 'Formulário de interesse',
        fields: [
          text('formTitle', 'Título'),
          text('formName', 'Campo nome'),
          text('formEmail', 'Campo e-mail'),
          text('formPhone', 'Campo telefone'),
          text('formMessage', 'Campo mensagem'),
          text('formMessagePlaceholder', 'Dica do campo mensagem'),
          text('formButton', 'Botão'),
          text('formSuccess', 'Mensagem após enviar'),
        ],
      },
      {
        title: 'Chamada final',
        fields: [
          text('ctaTitle', 'Título'),
          area('ctaText', 'Texto', undefined, 2),
          text('ctaButton', 'Botão', HIDE_IF_EMPTY),
          link('ctaLink', 'Link do botão'),
        ],
      },
    ],
  },
  {
    key: 'donation',
    label: 'Doação',
    path: '/doacao',
    description: 'Formulário de doação, informações de segurança e uso dos recursos.',
    sections: [
      {
        title: 'Topo da página',
        fields: [
          text('heroTitle', 'Título'),
          area('heroSubtitle', 'Subtítulo', undefined, 2),
          text('badge1', 'Selo 1', HIDE_IF_EMPTY),
          text('badge2', 'Selo 2', HIDE_IF_EMPTY),
          text('badge3', 'Selo 3', `${HIDE_IF_EMPTY} Use {anos} para a idade da Missão.`),
          text('tabDonate', 'Aba "fazer doação"'),
          text('tabProjects', 'Aba "projetos específicos"', 'A aba só aparece quando há projetos ativos.'),
        ],
      },
      {
        title: 'Formulário',
        fields: [
          text('formTitle', 'Título'),
          text('formDescription', 'Descrição'),
          text('typeLabel', 'Rótulo "tipo de doação"'),
          text('monthlyLabel', 'Opção mensal'),
          text('singleLabel', 'Opção única'),
          text('amountLabel', 'Rótulo "valor"'),
          text('otherAmountLabel', 'Rótulo "outro valor"'),
          text('otherAmountPlaceholder', 'Dica do campo "outro valor"'),
          text('impactTitle', 'Título do impacto'),
          text('impactDefault', 'Impacto padrão', 'Use {valor} para o valor escolhido.'),
          {
            type: 'list',
            key: 'impactExamples',
            label: 'Impacto por valor',
            help: 'Texto mostrado quando a pessoa escolhe exatamente esse valor.',
            itemLabel: 'Valor',
            titleKey: 'amount',
            fields: [text('amount', 'Valor (somente números)'), text('text', 'Texto')],
          },
          text('yourDataTitle', 'Título "seus dados"'),
          text('nameLabel', 'Campo nome'),
          text('emailLabel', 'Campo e-mail'),
          text('phoneLabel', 'Campo telefone'),
          text('cpfLabel', 'Campo CPF'),
          text('anonymousLabel', 'Opção doação anônima'),
          text('newsletterLabel', 'Opção receber atualizações'),
          text('paymentLabel', 'Rótulo "método de pagamento"'),
          text('cardLabel', 'Opção cartão'),
          text('pixLabel', 'Opção PIX'),
          text('transferLabel', 'Opção transferência'),
          text('monthlyButton', 'Botão (mensal)'),
          text('singleButton', 'Botão (única)'),
          text('successMessage', 'Mensagem após enviar'),
        ],
      },
      {
        title: 'Informações laterais',
        fields: [
          text('securityTitle', 'Segurança — título'),
          area('securityItems', 'Segurança — itens', LINES),
          text('fiscalTitle', 'Benefícios fiscais — título'),
          area('fiscalText', 'Benefícios fiscais — texto', PARAGRAPHS, 4),
          text('usageTitle', 'Uso da doação — título'),
          {
            type: 'list',
            key: 'usage',
            label: 'Uso da doação',
            itemLabel: 'Item',
            titleKey: 'label',
            fields: [text('label', 'Descrição'), text('percent', 'Porcentagem (somente números)')],
          },
        ],
      },
      {
        title: 'Aba de projetos',
        fields: [
          text('projectRaised', 'Rótulo "arrecadado"'),
          text('projectGoal', 'Rótulo "meta"'),
          text('projectReached', 'Texto após a porcentagem'),
          text('projectButton', 'Botão'),
        ],
      },
    ],
  },
  {
    key: 'contact',
    label: 'Contato',
    path: '/contato',
    description: 'Formulário, telefones, endereços, mapa e perguntas frequentes.',
    sections: [
      hero(),
      {
        title: 'Formulário',
        fields: [
          text('formTitle', 'Título'),
          text('formDescription', 'Descrição'),
          text('nameLabel', 'Campo nome'),
          text('emailLabel', 'Campo e-mail'),
          text('phoneLabel', 'Campo telefone'),
          text('reasonLabel', 'Campo motivo'),
          text('reasonPlaceholder', 'Dica do campo motivo'),
          area('reasons', 'Opções de motivo', LINES, 6),
          text('subjectLabel', 'Campo assunto'),
          text('messageLabel', 'Campo mensagem'),
          text('messagePlaceholder', 'Dica do campo mensagem'),
          text('sendButton', 'Botão'),
          text('sendingButton', 'Botão enquanto envia'),
          text('successMessage', 'Mensagem após enviar'),
        ],
      },
      {
        title: 'Informações de contato',
        fields: [
          {
            type: 'list',
            key: 'info',
            label: 'Cards',
            itemLabel: 'Card',
            titleKey: 'title',
            fields: [text('title', 'Título'), area('lines', 'Informações', LINES, 3)],
          },
        ],
      },
      {
        title: 'Mapa',
        fields: [
          text('mapTitle', 'Título'),
          area(
            'mapEmbedUrl',
            'Mapa do Google',
            'No Google Maps: Compartilhar → Incorporar um mapa → copiar HTML, e cole aqui. Em branco mostra só o texto abaixo.',
            2,
          ),
          text('mapPlaceholder', 'Texto quando não há mapa'),
        ],
      },
      {
        title: 'Onde atuamos',
        fields: [
          text('locationsTitle', 'Título'),
          {
            type: 'list',
            key: 'locations',
            label: 'Locais',
            itemLabel: 'Local',
            titleKey: 'title',
            fields: [
              text('title', 'Nome'),
              area('description', 'Descrição', undefined, 2),
              text('address', 'Endereço'),
              text('phone', 'Telefone'),
            ],
          },
        ],
      },
      {
        title: 'Perguntas frequentes',
        fields: [
          text('faqTitle', 'Título'),
          {
            type: 'list',
            key: 'faqs',
            label: 'Perguntas',
            itemLabel: 'Pergunta',
            titleKey: 'question',
            fields: [text('question', 'Pergunta'), area('answer', 'Resposta')],
          },
        ],
      },
      { title: 'Chamada final', fields: cta() },
    ],
  },
  {
    key: 'transparency',
    label: 'Transparência',
    path: '/transparencia',
    description: 'Textos da página de transparência. Os PDFs são enviados na aba "Transparência".',
    sections: [
      hero(),
      {
        title: 'Lista de documentos',
        fields: [
          area('intro', 'Texto de introdução', undefined, 3),
          text('allCategories', 'Filtro "todos"'),
          text('openButton', 'Botão de abrir'),
          text('emptyText', 'Mensagem quando não há documentos'),
        ],
      },
    ],
  },
  {
    key: 'footer',
    label: 'Rodapé',
    description: 'Textos, redes sociais e contatos exibidos no rodapé de todas as páginas.',
    sections: [
      {
        title: 'Apresentação e redes sociais',
        fields: [
          area('description', 'Texto de apresentação'),
          link('facebook', 'Facebook', HIDE_IF_EMPTY),
          link('instagram', 'Instagram', HIDE_IF_EMPTY),
          link('twitter', 'X / Twitter', HIDE_IF_EMPTY),
          link('youtube', 'YouTube', HIDE_IF_EMPTY),
        ],
      },
      {
        title: 'Colunas de links',
        fields: [
          text('quickLinksTitle', 'Título "links rápidos"'),
          text('helpTitle', 'Título "como ajudar"'),
          {
            type: 'list',
            key: 'helpLinks',
            label: 'Links "como ajudar"',
            itemLabel: 'Link',
            titleKey: 'label',
            fields: [text('label', 'Texto'), link('link', 'Link')],
          },
        ],
      },
      {
        title: 'Contato',
        fields: [
          text('contactTitle', 'Título'),
          area('address', 'Endereço', `${LINES} ${HIDE_IF_EMPTY}`),
          text('phone', 'Telefone', HIDE_IF_EMPTY),
          text('email', 'E-mail', HIDE_IF_EMPTY),
        ],
      },
      {
        title: 'Rodapé inferior',
        fields: [
          text('copyright', 'Direitos autorais', 'Use {ano} para o ano atual.'),
          text('privacyLabel', 'Texto "política de privacidade"'),
          link('privacyLink', 'Link da política de privacidade', HIDE_IF_EMPTY),
          text('termsLabel', 'Texto "termos de uso"'),
          link('termsLink', 'Link dos termos de uso', HIDE_IF_EMPTY),
        ],
      },
    ],
  },
  {
    key: 'global',
    label: 'Geral',
    description: 'Nome do site, menu, WhatsApp, newsletter e página de erro.',
    sections: [
      {
        title: 'Identidade e menu',
        fields: [
          text('siteName', 'Nome do site'),
          text('nav.home', 'Menu — Início'),
          text('nav.about', 'Menu — Quem Somos'),
          text('nav.projects', 'Menu — Projetos'),
          text('nav.news', 'Menu — Notícias'),
          text('nav.help', 'Menu — Como Ajudar'),
          text('nav.contact', 'Menu — Contato'),
          text('nav.transparency', 'Rodapé — Transparência'),
          text('nav.donate', 'Botão de doação do topo'),
        ],
      },
      {
        title: 'WhatsApp',
        fields: [
          text(
            'whatsapp',
            'Número do WhatsApp',
            'Com DDD, ex.: (67) 99999-0000. Aparece como botão flutuante na página inicial. Em branco, o botão some.',
          ),
        ],
      },
      {
        title: 'Newsletter',
        fields: [
          text('newsletter.title', 'Título'),
          area('newsletter.text', 'Texto', undefined, 2),
          text('newsletter.placeholder', 'Dica do campo de e-mail'),
          text('newsletter.button', 'Botão'),
          text('newsletter.privacy', 'Aviso de privacidade'),
          text('newsletter.successTitle', 'Título após inscrição'),
          text('newsletter.successText', 'Texto após inscrição'),
        ],
      },
      {
        title: 'Página não encontrada (erro 404)',
        fields: [
          text('notFound.title', 'Título'),
          text('notFound.text', 'Texto'),
          text('notFound.homeButton', 'Botão "início"'),
          text('notFound.backButton', 'Botão "voltar"'),
        ],
      },
    ],
  },
];
