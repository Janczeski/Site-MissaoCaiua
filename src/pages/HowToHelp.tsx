import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Users, Gift, BookOpen, Home, Stethoscope, Check } from 'lucide-react';

const HowToHelp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interests: [] as string[]
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Obrigado pelo seu interesse! Entraremos em contato em breve.');
    setFormData({ name: '', email: '', phone: '', message: '', interests: [] });
  };

  const waysToDonate = [
    {
      icon: Heart,
      title: "Doação Única",
      description: "Contribua com qualquer valor através de PIX, transferência ou cartão de crédito.",
      action: "Doar Agora"
    },
    {
      icon: Users,
      title: "Doação Mensal",
      description: "Torne-se um apoiador regular e ajude a manter nossos projetos durante todo o ano.",
      action: "Ser Apoiador"
    },
    {
      icon: Gift,
      title: "Parcerias Empresariais",
      description: "Sua empresa pode fazer a diferença apoiando a evangelização e assistência indígena.",
      action: "Saiba Mais"
    }
  ];

  const volunteerOpportunities = [
    {
      icon: BookOpen,
      title: "Ensino e Discipulado",
      description: "Auxilie na evangelização e ensino bíblico nas aldeias"
    },
    {
      icon: Stethoscope,
      title: "Apoio ao Hospital Indígena",
      description: "Profissionais de saúde para atendimento voluntário"
    },
    {
      icon: Home,
      title: "Apoio Administrativo",
      description: "Auxílio em tarefas administrativas e gestão de projetos"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundColor: '#a0c93a' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">
              Como Você Pode Ajudar
            </h1>
            <p className="text-xl md:text-2xl font-nunito opacity-90">
              Sua contribuição faz a diferença na vida dos povos indígenas
            </p>
          </div>
        </div>
      </section>

      {/* Formas de Doar */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center font-montserrat">
              Formas de Contribuir
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 font-nunito">
              Escolha a melhor forma de apoiar nossa missão
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {waysToDonate.map((way, index) => {
                const IconComponent = way.icon;
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow flex flex-col">
                    <IconComponent className="h-16 w-16 mx-auto mb-4" style={{ color: '#3b660a' }} />
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-montserrat">
                      {way.title}
                    </h3>
                    <p className="text-gray-600 mb-6 font-nunito flex-grow">
                      {way.description}
                    </p>
                    <Button className="w-full" style={{ backgroundColor: '#e8440d' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d63c0b'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8440d'}>
                      {way.action}
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Impacto das Doações */}
            <div className="rounded-lg p-8" style={{ backgroundColor: '#a0c93a20' }}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center font-montserrat">
                Como Sua Doação é Utilizada
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Check className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: '#3b660a' }} />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Hospital Indígena</h4>
                    <p className="text-gray-600 text-sm">Medicamentos, equipamentos e atendimento médico gratuito</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: '#3b660a' }} />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Evangelização</h4>
                    <p className="text-gray-600 text-sm">Materiais bíblicos, treinamento de líderes e discipulado</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: '#3b660a' }} />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Assistência Social</h4>
                    <p className="text-gray-600 text-sm">Cestas básicas, roupas e itens de necessidade</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: '#3b660a' }} />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Educação</h4>
                    <p className="text-gray-600 text-sm">Material escolar e apoio educacional</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voluntariado */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center font-montserrat">
              Seja um Voluntário
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 font-nunito">
              Doe seu tempo e talentos para transformar vidas
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {volunteerOpportunities.map((opportunity, index) => {
                const IconComponent = opportunity.icon;
                return (
                  <div key={index} className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-green-600 transition-colors">
                    <IconComponent className="h-12 w-12 mb-4" style={{ color: '#81a425' }} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">
                      {opportunity.title}
                    </h3>
                    <p className="text-gray-600 font-nunito">
                      {opportunity.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Formulário de Interesse */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center font-montserrat">
                Manifeste seu Interesse
              </h3>
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>

                <div className="mb-6">
                  <Label htmlFor="message">Como você gostaria de ajudar?</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Conte-nos sobre suas habilidades, disponibilidade e como você gostaria de contribuir..."
                  />
                </div>

                <Button type="submit" className="w-full" style={{ backgroundColor: '#3b660a' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2b4744'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b660a'}>
                  Enviar Interesse
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 text-white" style={{ backgroundColor: '#2b4744' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">
            Juntos Podemos Fazer Mais
          </h2>
          <p className="text-xl mb-8 font-nunito max-w-2xl mx-auto">
            Cada contribuição, por menor que seja, faz uma diferença real na vida dos povos indígenas
          </p>
          <Button size="lg" className="text-lg px-8 py-6" style={{ backgroundColor: '#e8440d' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d63c0b'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8440d'}>
            <Heart className="mr-2 h-5 w-5" />
            Fazer uma Doação
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HowToHelp;
