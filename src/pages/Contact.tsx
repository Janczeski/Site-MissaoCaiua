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
    { value: 'volunteer', label: 'Trabalho Voluntário / Missões' },
    { value: 'partnership', label: 'Parcerias Empresariais' },
    { value: 'prayer', label: 'Pedidos de Oração' },
    { value: 'hospital', label: 'Hospital Indígena' },
    { value: 'general', label: 'Informações Gerais' },
    { value: 'other', label: 'Outros Assuntos' }
  ];

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6" style={{ color: '#3b660a' }} />,
      title: "Endereço Principal",
      details: [
        "Av. Marcelino Pires, 1234",
        "Dourados - MS",
        "CEP: 79800-000"
      ]
    },
    {
      icon: <Phone className="h-6 w-6" style={{ color: '#81a425' }} />,
      title: "Telefones",
      details: [
        "(67) 3421-0000",
        "(67) 99999-0000",
        "Hospital: (67) 3421-0001"
      ]
    },
    {
      icon: <Mail className="h-6 w-6" style={{ color: '#e8440d' }} />,
      title: "E-mails",
      details: [
        "contato@missaocaiua.org.br",
        "doacao@missaocaiua.org.br",
        "hospital@missaocaiua.org.br"
      ]
    },
    {
      icon: <Clock className="h-6 w-6" style={{ color: '#47623d' }} />,
      title: "Horário de Atendimento",
      details: [
        "Segunda a Sexta: 8h às 17h",
        "Sábados: 8h às 12h",
        "Hospital: 24 horas"
      ]
    }
  ];

  const locations = [
    {
      title: "Sede Principal",
      description: "Administração, Atendimento Social e Projetos de Evangelização",
      address: "Av. Marcelino Pires, 1234 - Dourados, MS",
      phone: "(67) 3421-0000"
    },
    {
      title: "Hospital Indígena",
      description: "Atendimento médico, odontológico e farmácia",
      address: "Rua Caiuá, 567 - Dourados, MS",
      phone: "(67) 3421-0001"
    },
    {
      title: "Aldeias Atendidas",
      description: "Visitas e cultos em 15+ aldeias da região de Dourados",
      address: "Reserva Indígena - Dourados, MS",
      phone: "(67) 99999-0000"
    }
  ];

  const faqs = [
    {
      question: "Como posso fazer uma doação?",
      answer: "Você pode fazer doações através do nosso site, por transferência bancária, PIX ou cartão de crédito para apoiar nosso trabalho nas aldeias indígenas."
    },
    {
      question: "Como funciona o Hospital Indígena?",
      answer: "O Hospital atende gratuitamente a população indígena com médicos, dentistas e farmácia. Funciona 24 horas com equipe especializada em saúde indígena."
    },
    {
      question: "Posso visitar a Missão e as aldeias?",
      answer: "Sim! Entre em contato para agendar uma visita. As visitas às aldeias precisam ser agendadas com antecedência e acompanhadas por nossa equipe."
    },
    {
      question: "Como posso servir como missionário?",
      answer: "Temos oportunidades para missionários de curto e longo prazo. Entre em contato para conhecer as necessidades atuais e requisitos."
    },
    {
      question: "Vocês emitem recibo para dedução no IR?",
      answer: "Sim, todas as doações recebem recibo oficial que pode ser usado para dedução no Imposto de Renda, conforme legislação vigente."
    },
    {
      question: "Como posso orar pela Missão?",
      answer: "Você pode se inscrever em nossa lista de oração para receber atualizações mensais sobre nosso trabalho e pedidos específicos de oração."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundColor: '#a0c93a' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">
              Entre em Contato
            </h1>
            <p className="text-xl md:text-2xl font-nunito opacity-90">
              Estamos aqui para esclarecer suas dúvidas e ajudá-lo a fazer parte desta missão
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
                    <MessageCircle className="h-5 w-5 mr-2" style={{ color: '#3b660a' }} />
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
                      className="w-full"
                      style={{ backgroundColor: '#3b660a' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2b4744'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b660a'}
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
                      <p className="text-sm">Dourados - MS</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Locais de Atendimento */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center font-montserrat">
              Onde Atuamos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {locations.map((location, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 font-montserrat">
                      {location.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 font-nunito">
                      {location.description}
                    </p>
                    <div className="space-y-2 text-sm text-gray-600 font-nunito">
                      <p className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: '#81a425' }} />
                        {location.address}
                      </p>
                      <p className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: '#81a425' }} />
                        {location.phone}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <section className="mt-16 rounded-lg p-8 text-white text-center" style={{ backgroundColor: '#2b4744' }}>
            <h2 className="text-3xl font-bold mb-4 font-montserrat">
              Faça Parte Desta Missão
            </h2>
            <p className="text-xl mb-6 font-nunito opacity-90">
              Juntos podemos levar esperança e amor aos povos indígenas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" style={{ backgroundColor: '#e8440d' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d63c0b'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8440d'}>
                <Heart className="h-4 w-4 mr-2" />
                Fazer Doação
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white" onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#2b4744'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'white'; }}>
                <Users className="h-4 w-4 mr-2" />
                Servir como Missionário
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact;