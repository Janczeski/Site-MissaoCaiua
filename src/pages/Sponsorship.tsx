import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Modal from '@/components/Modal';
import { children, testimonials } from '@/data/mockData';
import { Heart, Users, Calendar, MapPin, Mail, Phone, User, CheckCircle, Star } from 'lucide-react';

interface Child {
  id: number;
  name: string;
  age: number;
  location: string;
  story: string;
  image: string;
  needs: string[];
}

const Sponsorship = () => {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    occupation: '',
    monthlyIncome: '',
    motivation: '',
    previousExperience: false,
    agreeTerms: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Formulário enviado com sucesso! Entraremos em contato em breve.');
    setShowForm(false);
    setFormData({
      name: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '',
      occupation: '', monthlyIncome: '', motivation: '', previousExperience: false, agreeTerms: false
    });
  };

  const benefits = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Impacto Direto",
      description: "Acompanhe de perto o desenvolvimento da criança que você apadrinhou"
    },
    {
      icon: <Mail className="h-8 w-8 text-blue-500" />,
      title: "Comunicação Regular",
      description: "Receba cartas, fotos e relatórios sobre o progresso do seu afilhado"
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Comunidade",
      description: "Faça parte de uma rede de padrinhos comprometidos com a transformação social"
    },
    {
      icon: <Calendar className="h-8 w-8 text-purple-500" />,
      title: "Flexibilidade",
      description: "Escolha o valor mensal que cabe no seu orçamento, a partir de R$ 50"
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Escolha uma Criança",
      description: "Navegue pelos perfis e escolha a criança que você gostaria de apadrinhar"
    },
    {
      step: 2,
      title: "Preencha o Cadastro",
      description: "Complete o formulário com suas informações pessoais e motivações"
    },
    {
      step: 3,
      title: "Confirmação",
      description: "Nossa equipe entrará em contato para confirmar o apadrinhamento"
    },
    {
      step: 4,
      title: "Comece a Transformar",
      description: "Receba atualizações regulares e acompanhe o crescimento do seu afilhado"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">
              Programa de Apadrinhamento
            </h1>
            <p className="text-xl md:text-2xl font-nunito opacity-90 mb-8">
              Transforme uma vida e seja transformado. Apadrinhe uma criança e acompanhe sua jornada de crescimento.
            </p>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600" onClick={() => setShowForm(true)}>
              Quero Apadrinhar
            </Button>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center font-montserrat">
              Como Funciona o Apadrinhamento
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 font-montserrat">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 font-nunito">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center font-montserrat">
              Por Que Apadrinhar?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="mb-4 flex justify-center">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 font-montserrat">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 font-nunito">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Crianças Disponíveis */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center font-montserrat">
              Conheça as Crianças
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {children.map((child) => (
                <div key={child.id} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors duration-300">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={child.image}
                      alt={child.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 font-montserrat">
                      {child.name}, {child.age} anos
                    </h3>
                    
                    <div className="flex items-center text-gray-500 mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="font-nunito">{child.location}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 font-nunito leading-relaxed">
                      {child.story}
                    </p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 font-montserrat">Necessidades:</h4>
                      <div className="flex flex-wrap gap-1">
                        {child.needs.map((need, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            {need}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setSelectedChild(child);
                        setShowForm(true);
                      }}
                    >
                      Apadrinhar {child.name}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center font-montserrat">
              Depoimentos de Padrinhos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 font-montserrat">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm font-nunito">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 font-nunito italic">
                    "{testimonial.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal do Formulário */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Formulário de Apadrinhamento"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {selectedChild && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Criança Selecionada:</h3>
              <p className="text-blue-800">{selectedChild.name}, {selectedChild.age} anos - {selectedChild.location}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="occupation">Profissão</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Endereço Completo</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="state">Estado</Label>
              <Select onValueChange={(value) => handleInputChange('state', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="BA">Bahia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="monthlyIncome">Renda Mensal</Label>
            <Select onValueChange={(value) => handleInputChange('monthlyIncome', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione sua faixa de renda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3">1 a 3 salários mínimos</SelectItem>
                <SelectItem value="3-5">3 a 5 salários mínimos</SelectItem>
                <SelectItem value="5-10">5 a 10 salários mínimos</SelectItem>
                <SelectItem value="10+">Acima de 10 salários mínimos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="motivation">O que te motiva a apadrinhar uma criança?</Label>
            <Textarea
              id="motivation"
              value={formData.motivation}
              onChange={(e) => handleInputChange('motivation', e.target.value)}
              rows={4}
              placeholder="Conte-nos sobre sua motivação..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="previousExperience"
              checked={formData.previousExperience}
              onCheckedChange={(checked) => handleInputChange('previousExperience', checked as boolean)}
            />
            <Label htmlFor="previousExperience">
              Já tive experiência anterior com apadrinhamento ou trabalho voluntário
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreeTerms"
              checked={formData.agreeTerms}
              onCheckedChange={(checked) => handleInputChange('agreeTerms', checked as boolean)}
              required
            />
            <Label htmlFor="agreeTerms">
              Concordo com os termos e condições do programa de apadrinhamento *
            </Label>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={!formData.agreeTerms}>
            Enviar Formulário
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Sponsorship;