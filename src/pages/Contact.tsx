import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SmartLink from '@/components/SmartLink';
import { lines, useContent } from '@/content/SiteContentContext';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Users, Heart } from 'lucide-react';

const Contact = () => {
  const t = useContent('contact');
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
      alert(t.successMessage);
      setFormData({
        name: '', email: '', phone: '', subject: '', message: '', contactReason: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactIcons = [
    <MapPin className="h-6 w-6 flex-shrink-0" style={{ color: '#3b660a' }} />,
    <Phone className="h-6 w-6 flex-shrink-0" style={{ color: '#81a425' }} />,
    <Mail className="h-6 w-6 flex-shrink-0" style={{ color: '#e8440d' }} />,
    <Clock className="h-6 w-6 flex-shrink-0" style={{ color: '#47623d' }} />,
  ];

  // Aceita o link do "Incorporar mapa" do Google Maps ou o código <iframe> inteiro
  const mapSrc = (t.mapEmbedUrl.match(/src="([^"]+)"/)?.[1] || t.mapEmbedUrl).trim();
  const isGoogleMap = /^https:\/\/(www\.)?google\.[a-z.]+\/maps/.test(mapSrc);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundColor: '#a0c93a' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">
              {t.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl font-nunito opacity-90">
              {t.heroSubtitle}
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
                    {t.formTitle}
                  </CardTitle>
                  <CardDescription>
                    {t.formDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">{t.nameLabel}</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">{t.emailLabel}</Label>
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
                        <Label htmlFor="phone">{t.phoneLabel}</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactReason">{t.reasonLabel}</Label>
                        <Select onValueChange={(value) => handleInputChange('contactReason', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={t.reasonPlaceholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {lines(t.reasons).map((reason) => (
                              <SelectItem key={reason} value={reason}>
                                {reason}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">{t.subjectLabel}</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">{t.messageLabel}</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        rows={5}
                        placeholder={t.messagePlaceholder}
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
                        t.sendingButton
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {t.sendButton}
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
                {t.info.map((info, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        {contactIcons[index % contactIcons.length]}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2 font-montserrat">
                            {info.title}
                          </h3>
                          <div className="space-y-1">
                            {lines(info.lines).map((detail, idx) => (
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
                  <CardTitle className="font-montserrat">{t.mapTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  {isGoogleMap ? (
                    <iframe
                      src={mapSrc}
                      title={t.mapTitle}
                      className="w-full h-64 rounded-lg border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  ) : (
                    <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <MapPin className="h-12 w-12 mx-auto mb-2" />
                        <p className="font-nunito">{t.mapPlaceholder}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Locais de Atendimento */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center font-montserrat">
              {t.locationsTitle}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.locations.map((location, index) => (
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
              {t.faqTitle}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.faqs.map((faq, index) => (
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
              {t.ctaTitle}
            </h2>
            <p className="text-xl mb-6 font-nunito opacity-90">
              {t.ctaText}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {t.ctaPrimaryText && (
                <Button asChild size="lg" style={{ backgroundColor: '#e8440d' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d63c0b'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8440d'}>
                  <SmartLink to={t.ctaPrimaryLink || '/doacao'}>
                    <Heart className="h-4 w-4 mr-2" />
                    {t.ctaPrimaryText}
                  </SmartLink>
                </Button>
              )}
              {t.ctaSecondaryText && (
                <Button asChild size="lg" variant="outline" className="border-white text-white bg-transparent" onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#2b4744'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'white'; }}>
                  <SmartLink to={t.ctaSecondaryLink || '/como-ajudar'}>
                    <Users className="h-4 w-4 mr-2" />
                    {t.ctaSecondaryText}
                  </SmartLink>
                </Button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact;