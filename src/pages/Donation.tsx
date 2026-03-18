import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, CreditCard, Smartphone, Building, Shield, CheckCircle, Gift, Users, GraduationCap } from 'lucide-react';

const Donation = () => {
  const [donationType, setDonationType] = useState('monthly');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    anonymous: false,
    newsletter: true
  });

  const predefinedAmounts = {
    monthly: [50, 100, 200, 500],
    single: [25, 50, 100, 250, 500, 1000]
  };

  const impactExamples = {
    50: "Medicamentos para 5 famílias indígenas",
    100: "Material de evangelização em língua indígena",
    200: "Cesta básica para 4 famílias nas aldeias",
    500: "Apoio educacional para 10 crianças indígenas"
  };

  const projects = [
    {
      id: 'hospital',
      name: 'Hospital Indígena',
      description: 'Medicamentos, equipamentos e atendimento médico gratuito',
      icon: <Shield className="h-8 w-8" style={{ color: '#3b660a' }} />,
      goal: 250000,
      raised: 185000
    },
    {
      id: 'evangelization',
      name: 'Evangelização nas Aldeias',
      description: 'Materiais bíblicos em línguas indígenas e visitas às aldeias',
      icon: <Heart className="h-8 w-8" style={{ color: '#81a425' }} />,
      goal: 150000,
      raised: 95000
    },
    {
      id: 'social',
      name: 'Assistência Social',
      description: 'Cestas básicas, roupas e itens de necessidade',
      icon: <Gift className="h-8 w-8" style={{ color: '#e8440d' }} />,
      goal: 180000,
      raised: 120000
    },
    {
      id: 'education',
      name: 'Apoio Educacional',
      description: 'Reforço escolar e capacitação para jovens indígenas',
      icon: <GraduationCap className="h-8 w-8" style={{ color: '#47623d' }} />,
      goal: 120000,
      raised: 78000
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Doação processada com sucesso! Obrigado por sua generosidade.');
  };

  const selectedAmount = customAmount ? parseFloat(customAmount) : parseFloat(amount);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundColor: '#a0c93a' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">
              Faça sua Doação
            </h1>
            <p className="text-xl md:text-2xl font-nunito opacity-90 mb-8">
              Sua generosidade transforma vidas. Ajude-nos a continuar servindo os povos indígenas.
            </p>
            <div className="flex justify-center items-center space-x-8 text-lg">
              <div className="flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                <span>100% Seguro</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-2" />
                <span>Transparente</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-6 w-6 mr-2" />
                <span>96 Anos de História</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="donate" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="donate">Fazer Doação</TabsTrigger>
              <TabsTrigger value="projects">Projetos Específicos</TabsTrigger>
            </TabsList>

            {/* Aba de Doação */}
            <TabsContent value="donate" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Formulário de Doação */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-montserrat">Dados da Doação</CardTitle>
                    <CardDescription>
                      Escolha o valor e a frequência da sua contribuição
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Tipo de Doação */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block">Tipo de Doação</Label>
                        <RadioGroup value={donationType} onValueChange={setDonationType}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="monthly" id="monthly" />
                            <Label htmlFor="monthly">Doação Mensal (Recomendado)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="single" id="single" />
                            <Label htmlFor="single">Doação Única</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Valores Predefinidos */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block">Valor da Doação</Label>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {predefinedAmounts[donationType as keyof typeof predefinedAmounts].map((value) => (
                            <Button
                              key={value}
                              type="button"
                              variant={amount === value.toString() ? "default" : "outline"}
                              onClick={() => {
                                setAmount(value.toString());
                                setCustomAmount('');
                              }}
                              className="h-12"
                            >
                              {formatCurrency(value)}
                            </Button>
                          ))}
                        </div>
                        
                        <div>
                          <Label htmlFor="customAmount">Outro valor</Label>
                          <Input
                            id="customAmount"
                            type="number"
                            placeholder="Digite o valor"
                            value={customAmount}
                            onChange={(e) => {
                              setCustomAmount(e.target.value);
                              setAmount('');
                            }}
                            min="1"
                          />
                        </div>
                      </div>

                      {/* Impacto da Doação */}
                      {selectedAmount && (
                        <div className="p-4 rounded-lg" style={{ backgroundColor: '#a0c93a20' }}>
                          <h4 className="font-semibold mb-2" style={{ color: '#3b660a' }}>Impacto da sua doação:</h4>
                          <p style={{ color: '#2b4744' }}>
                            {impactExamples[selectedAmount as keyof typeof impactExamples] || 
                             `Com ${formatCurrency(selectedAmount)} você ajuda famílias indígenas em nossos programas`}
                          </p>
                        </div>
                      )}

                      {/* Dados Pessoais */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">Seus Dados</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Nome Completo *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">E-mail *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                              id="cpf"
                              value={formData.cpf}
                              onChange={(e) => setFormData(prev => ({ ...prev, cpf: formatCPF(e.target.value) }))}
                              maxLength={14}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="anonymous"
                              checked={formData.anonymous}
                              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, anonymous: checked as boolean }))}
                            />
                            <Label htmlFor="anonymous">Fazer doação anônima</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="newsletter"
                              checked={formData.newsletter}
                              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, newsletter: checked as boolean }))}
                            />
                            <Label htmlFor="newsletter">Receber atualizações sobre nossos projetos</Label>
                          </div>
                        </div>
                      </div>

                      {/* Método de Pagamento */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block">Método de Pagamento</Label>
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="credit-card" id="credit-card" />
                            <CreditCard className="h-4 w-4" />
                            <Label htmlFor="credit-card">Cartão de Crédito</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pix" id="pix" />
                            <Smartphone className="h-4 w-4" />
                            <Label htmlFor="pix">PIX</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                            <Building className="h-4 w-4" />
                            <Label htmlFor="bank-transfer">Transferência Bancária</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Button type="submit" className="w-full h-12 text-lg" style={{ backgroundColor: '#e8440d' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d63c0b'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8440d'}>
                        {donationType === 'monthly' ? 'Doar Mensalmente' : 'Doar Agora'} {selectedAmount ? formatCurrency(selectedAmount) : ''}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Informações Adicionais */}
                <div className="space-y-6">
                  {/* Segurança */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center font-montserrat">
                        <Shield className="h-5 w-5 mr-2" style={{ color: '#3b660a' }} />
                        Doação 100% Segura
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 font-nunito">
                      <p className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 mr-2" style={{ color: '#3b660a' }} />
                        Certificado SSL de segurança
                      </p>
                      <p className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 mr-2" style={{ color: '#3b660a' }} />
                        Dados protegidos e criptografados
                      </p>
                      <p className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 mr-2" style={{ color: '#3b660a' }} />
                        Transparência total no uso dos recursos
                      </p>
                    </CardContent>
                  </Card>

                  {/* Benefícios Fiscais */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center font-montserrat">
                        <Gift className="h-5 w-5 mr-2" style={{ color: '#81a425' }} />
                        Benefícios Fiscais
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="font-nunito">
                      <p className="text-sm text-gray-600 mb-3">
                        Suas doações podem ser deduzidas do Imposto de Renda em até 6% da renda bruta anual.
                      </p>
                      <p className="text-sm text-gray-600">
                        Enviaremos o recibo para sua declaração anual.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Transparência */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-montserrat">Como Usamos sua Doação</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-nunito">Programas Diretos</span>
                        <span className="font-semibold">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: '85%', backgroundColor: '#3b660a' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-nunito">Administração</span>
                        <span className="font-semibold">10%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: '10%', backgroundColor: '#81a425' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-nunito">Captação de Recursos</span>
                        <span className="font-semibold">5%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: '5%', backgroundColor: '#e8440d' }}></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Aba de Projetos Específicos */}
            <TabsContent value="projects" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center font-montserrat">
                        {project.icon}
                        <span className="ml-3">{project.name}</span>
                      </CardTitle>
                      <CardDescription className="font-nunito">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Arrecadado: {formatCurrency(project.raised)}</span>
                            <span>Meta: {formatCurrency(project.goal)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="h-3 rounded-full transition-all duration-300" 
                              style={{ width: `${(project.raised / project.goal) * 100}%`, backgroundColor: '#3b660a' }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {Math.round((project.raised / project.goal) * 100)}% da meta alcançada
                          </p>
                        </div>
                        
                        <Button className="w-full" variant="outline">
                          Apoiar este Projeto
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Donation;