import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Users, Heart } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactReason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envio
    setTimeout(() => {
      alert('Mensagem enviada com sucesso! Retornaremos em breve.');
      setFormData({
        name: '', email: '', phone: '', subject: '', message: '', contactReason: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactReasons = [
    { value: 'donation', label: 'Informações sobre Doações' },
    { value: 'sponsorship', label: 'Programa de Apadrinhamento' },
    { value: 'volunteer', label: 'Trabalho Voluntário' },
    { value: 'partnership', label: 'Parcerias Empresariais' },
    { value: 'press', label: 'Imprensa' },
    { value: 'general', label: 'Informações Gerais' },
    { value: 'other', label: 'Outros Assuntos' }
  ];

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6 text-blue-600" />,
      title: "Endereço Principal",
      details: [
        "Rua das Flores, 123",
        "Centro, São Paulo - SP",
        "CEP: 01234-567"
      ]
    },
    {
      icon: <Phone className="h-6 w-6 text-green-600" />,
      title: "Telefones",
      details: [
        "(11) 1234-5678",
        "(11) 9876-5432",
        "0800 123 4567 (Gratuito)"
      ]
    },
    {
      icon: <Mail className="h-6 w-6 text-orange-600" />,
      title: "E-mails",
      details: [
        "contato@esperancaviva.org.br",
        "doacao@esperancaviva.org.br",
        "apadrinhamento@esperancaviva.org.br"
      ]
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-600" />,
      title: "Horário de Atendimento",
      details: [
        "Segunda a Sexta: 8h às 18h",
        "Sábados: 8h às 12h",
        "Domingos e Feriados: Fechado"
      ]
    }
  ];

  const offices = [
    {
      city: "São Paulo - SP",
      address: "Rua das Flores, 123 - Centro",
      phone: "(11) 1234-5678",
      email: "sp@esperancaviva.org.br"
    },
    {
      city: "Rio de Janeiro - RJ",
      address: "Av. Copacabana, 456 - Copacabana",
      phone: "(21) 2345-6789",
      email: "rj@esperancaviva.org.br"
    },
    {
      city: "Belo Horizonte - MG",
      address: "Rua da Liberdade, 789 - Centro",
      phone: "(31) 3456-7890",
      email: "mg@esperancaviva.org.br"
    },
    {
      city: "Salvador - BA",
      address: "Av. Sete de Setembro, 321 - Pelourinho",
      phone: "(71) 4567-8901",
      email: "ba@esperancaviva.org.br"
    }
  ];

  const faqs = [
    {
      question: "Como posso fazer uma doação?",
      answer: "Você pode fazer doações através do nosso site, por transferência bancária, PIX ou cartão de crédito. Acesse nossa página de doações para mais informações."
    },
    {
      question: "Qual o valor mínimo para apadrinhar uma criança?",
      answer: "O valor mínimo para apadrinhamento é de R$ 50,00 mensais, mas você pode contribuir com qualquer valor acima disso."
    },
    {
      question: "Como posso me tornar voluntário?",
      answer: "Entre em contato conosco através do formulário ou telefone. Temos diversas oportunidades de voluntariado adequadas a diferentes perfis e disponibilidades."
    },
    {
      question: "Vocês emitem recibo para dedução no IR?",
      answer: "Sim, todas as doações recebem recibo oficial que pode ser usado para dedução no Imposto de Renda, conforme legislação vigente."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">
              Entre em Contato
            </h1>
            <p className="text-xl md:text-2xl font-nunito opacity-90">
              Estamos aqui para esclarecer suas dúvidas e ajudá-lo a fazer parte da nossa missão
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulário de Contato */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center font-montserrat">
                    <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                    Envie sua Mensagem
                  </CardTitle>
                  <CardDescription>
                    Preencha o formulário abaixo e retornaremos em até 24 horas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactReason">Motivo do Contato</Label>
                        <Select onValueChange={(value) => handleInputChange('contactReason', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o motivo" />
                          </SelectTrigger>
                          <SelectContent>
                            {contactReasons.map((reason) => (
                              <SelectItem key={reason.value} value={reason.value}>
                                {reason.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Assunto *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        rows={5}
                        placeholder="Descreva sua dúvida ou solicitação..."
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Enviando...'
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Informações de Contato */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        {info.icon}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2 font-montserrat">
                            {info.title}
                          </h3>
                          <div className="space-y-1">
                            {info.details.map((detail, idx) => (
                              <p key={idx} className="text-gray-600 text-sm font-nunito">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Mapa Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-montserrat">Localização</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="h-12 w-12 mx-auto mb-2" />
                      <p className="font-nunito">Mapa Interativo</p>
                      <p className="text-sm">Sede Principal - São Paulo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Escritórios */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center font-montserrat">
              Nossos Escritórios
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {offices.map((office, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 font-montserrat">
                      {office.city}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 font-nunito">
                      <p className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        {office.address}
                      </p>
                      <p className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                        {office.phone}
                      </p>
                      <p className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                        {office.email}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center font-montserrat">
              Perguntas Frequentes
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 font-montserrat">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 font-nunito leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="mt-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4 font-montserrat">
              Pronto para Fazer a Diferença?
            </h2>
            <p className="text-xl mb-6 font-nunito opacity-90">
              Junte-se a nós e transforme vidas através da solidariedade
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                <Heart className="h-4 w-4 mr-2" />
                Fazer Doação
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Users className="h-4 w-4 mr-2" />
                Ser Voluntário
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact;