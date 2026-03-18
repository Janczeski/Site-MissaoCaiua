// Dados simulados para o site da ONG

export const heroSlides = [
  {
    id: 1,
    title: "Transforme Vidas Através da Fé",
    subtitle: "Único hospital indígena do Brasil, de média complexidade!",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=600&fit=crop",
    ctaText: "Apoie a Missão",
    ctaLink: "/como-ajudar"
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
  { number: "5,000+", label: "Indígenas Atendidos", icon: "👥" },
  { number: "96", label: "Anos de História", icon: "📅" },
  { number: "1", label: "Hospital Indígena", icon: "🏥" },
  { number: "15+", label: "Aldeias Alcançadas", icon: "🏘️" }
];

export const projects = [
  {
    id: 1,
    title: "Hospital Indígena",
    description: "Único hospital indígena de média complexidade do Brasil, oferecendo atendimento médico gratuito.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop",
    location: "Dourados, MS",
    beneficiaries: 2500,
    coordinates: [-22.2211, -54.8056] as [number, number]
  },
  {
    id: 2,
    title: "Evangelização nas Aldeias",
    description: "Trabalho missionário de evangelização e discipulado junto aos povos indígenas.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop",
    location: "Dourados, MS",
    beneficiaries: 1500,
    coordinates: [-22.2211, -54.8056] as [number, number]
  },
  {
    id: 3,
    title: "Assistência Social",
    description: "Distribuição de cestas básicas, roupas e itens de necessidade para as comunidades indígenas.",
    image: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=400&h=300&fit=crop",
    location: "Dourados, MS",
    beneficiaries: 800,
    coordinates: [-22.2211, -54.8056] as [number, number]
  },
  {
    id: 4,
    title: "Apoio Educacional",
    description: "Material escolar e apoio pedagógico para crianças e jovens indígenas.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop",
    location: "Dourados, MS",
    beneficiaries: 600,
    coordinates: [-22.2211, -54.8056] as [number, number]
  }
];

export const news = [
  {
    id: 1,
    title: "Hospital Indígena Amplia Atendimento",
    excerpt: "Novas especialidades médicas disponíveis para atender melhor as comunidades indígenas.",
    content: "O Hospital Indígena da Missão Caiuá ampliou sua capacidade de atendimento com a chegada de novos profissionais especializados. Agora oferecemos consultas em cardiologia, pediatria e ginecologia, fortalecendo nosso compromisso com a saúde dos povos indígenas.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop",
    date: "2024-01-15",
    author: "Equipe Missão Caiuá"
  },
  {
    id: 2,
    title: "Campanha de Cestas Básicas Beneficia 200 Famílias",
    excerpt: "Graças à generosidade de parceiros, distribuímos alimentos para famílias indígenas.",
    content: "Nossa campanha mensal de distribuição de cestas básicas alcançou 200 famílias indígenas neste mês. Além de alimentos, também foram distribuídos kits de higiene e roupas, demonstrando o amor de Cristo através de ações práticas.",
    image: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=600&h=400&fit=crop",
    date: "2023-12-20",
    author: "Departamento Social"
  },
  {
    id: 3,
    title: "Encontro de Líderes Indígenas Cristãos",
    excerpt: "Realizado o 15º encontro anual de líderes indígenas cristãos em Dourados.",
    content: "Com a participação de mais de 80 líderes de diversas aldeias, o encontro promoveu capacitação bíblica, troca de experiências e fortalecimento da comunhão entre as igrejas indígenas. Um momento especial de crescimento espiritual.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop",
    date: "2023-11-10",
    author: "Pastor Carlos Mendes"
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Paulo Oliveira",
    role: "Apoiador há 5 anos",
    content: "Contribuir com a Missão Caiuá é uma forma de levar esperança e o evangelho aos nossos irmãos indígenas. Ver o impacto do trabalho é transformador.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    name: "Ana Martins",
    role: "Voluntária há 3 anos",
    content: "Servir no hospital indígena mudou minha vida. É gratificante poder usar meus conhecimentos médicos para abençoar essas comunidades.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop"
  }
];

// Array vazio mantido para compatibilidade com página legada
export const children: any[] = [];