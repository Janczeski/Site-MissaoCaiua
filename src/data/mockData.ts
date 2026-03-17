// Dados simulados para o site da ONG

export const heroSlides = [
  {
    id: 1,
    title: "Transforme Vidas Através da Fé",
    subtitle: "Único hospital indígena do Brasil, de média complexidade!",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=600&fit=crop",
    ctaText: "Apadrinhe Agora",
    ctaLink: "/apadrinhamento"
  },
  {
    id: 2,
    title: "Sua Doação Faz a Diferença",
    subtitle: "Juntos podemos construir um futuro melhor para milhares de pessoas",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&h=600&fit=crop",
    ctaText: "Doe Agora",
    ctaLink: "/doacao"
  },
  {
    id: 3,
    title: "Saúde é o Caminho",
    subtitle: "Investimos em saúde de qualidade para quebrar o ciclo da tristeza",
    image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200&h=600&fit=crop",
    ctaText: "Conheça Nossos Projetos",
    ctaLink: "/projetos"
  }
];

export const impactNumbers = [
  { number: "15,000+", label: "Crianças Atendidas", icon: "👶" },
  { number: "250+", label: "Projetos Ativos", icon: "🏗️" },
  { number: "50+", label: "Comunidades", icon: "🏘️" },
  { number: "25", label: "Anos de Experiência", icon: "📅" }
];

export const projects = [
  {
    id: 1,
    title: "Educação Transformadora",
    description: "Oferecemos educação de qualidade para crianças em situação de vulnerabilidade social.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
    location: "São Paulo, SP",
    beneficiaries: 500,
    coordinates: [-23.5505, -46.6333] as [number, number]
  },
  {
    id: 2,
    title: "Alimentação Saudável",
    description: "Programa de nutrição que garante refeições balanceadas para crianças carentes.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop",
    location: "Rio de Janeiro, RJ",
    beneficiaries: 800,
    coordinates: [-22.9068, -43.1729] as [number, number]
  },
  {
    id: 3,
    title: "Saúde Preventiva",
    description: "Cuidados médicos e odontológicos preventivos para comunidades carentes.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    location: "Belo Horizonte, MG",
    beneficiaries: 300,
    coordinates: [-19.9191, -43.9386] as [number, number]
  },
  {
    id: 4,
    title: "Desenvolvimento Comunitário",
    description: "Capacitação profissional e geração de renda para famílias em situação de pobreza.",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=300&fit=crop",
    location: "Salvador, BA",
    beneficiaries: 400,
    coordinates: [-12.9714, -38.5014] as [number, number]
  }
];

export const news = [
  {
    id: 1,
    title: "Nova Escola Inaugurada em São Paulo",
    excerpt: "Mais 200 crianças terão acesso à educação de qualidade com a inauguração da nossa nova unidade.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=400&fit=crop",
    date: "2024-01-15",
    author: "Equipe Missão Caiuá"
  },
  {
    id: 2,
    title: "Campanha de Natal Arrecada 10 Toneladas de Alimentos",
    excerpt: "Graças à generosidade de nossos apoiadores, conseguimos arrecadar alimentos para 1000 famílias.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop",
    date: "2023-12-20",
    author: "Maria Silva"
  },
  {
    id: 3,
    title: "Programa de Apadrinhamento Completa 5 Anos",
    excerpt: "Celebramos 5 anos transformando vidas através do programa de apadrinhamento de crianças.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
    date: "2023-11-10",
    author: "João Santos"
  }
];

export const children = [
  {
    id: 1,
    name: "Ana",
    age: 8,
    location: "São Paulo, SP",
    story: "Ana sonha em ser professora e adora matemática. Precisa de apoio para continuar seus estudos.",
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=300&h=300&fit=crop",
    needs: ["Material escolar", "Uniforme", "Alimentação"]
  },
  {
    id: 2,
    name: "Pedro",
    age: 10,
    location: "Rio de Janeiro, RJ",
    story: "Pedro é apaixonado por futebol e tem grande potencial. Busca oportunidades para desenvolver seu talento.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
    needs: ["Material esportivo", "Transporte", "Alimentação"]
  },
  {
    id: 3,
    name: "Lucia",
    age: 7,
    location: "Belo Horizonte, MG",
    story: "Lucia adora desenhar e tem um talento natural para as artes. Sonha em ser artista.",
    image: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=300&h=300&fit=crop",
    needs: ["Material de arte", "Livros", "Cuidados médicos"]
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Maria Oliveira",
    role: "Madrinha há 3 anos",
    content: "Apadrinhar a pequena Sofia foi uma das melhores decisões da minha vida. Ver seu crescimento e desenvolvimento é emocionante.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    name: "Carlos Santos",
    role: "Padrinho há 2 anos",
    content: "O programa de apadrinhamento me permitiu fazer a diferença na vida de uma criança de forma direta e significativa.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
  }
];