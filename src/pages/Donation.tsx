import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SmartLink from '@/components/SmartLink';
import { lines, paragraphs, useContent } from '@/content/SiteContentContext';
import { usePublicProjects } from '@/hooks/use-public-data';
import { Heart, CreditCard, Smartphone, Building, Shield, CheckCircle, Gift } from 'lucide-react';

const predefinedAmounts = {
  monthly: [50, 100, 200, 500],
  single: [25, 50, 100, 250, 500, 1000],
};

const usageColors = ['#3b660a', '#81a425', '#e8440d', '#47623d'];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatCPF = (value: string) =>
  value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');

const Donation = () => {
  const t = useContent('donation');
  const { data: projects = [] } = usePublicProjects();
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
    newsletter: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t.successMessage);
  };

  const selectedAmount = customAmount ? parseFloat(customAmount) : parseFloat(amount);
  const impactText =
    t.impactExamples.find((ex) => parseFloat(ex.amount) === selectedAmount)?.text ||
    t.impactDefault.replace('{valor}', formatCurrency(selectedAmount || 0));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundColor: '#a0c93a' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">{t.heroTitle}</h1>
            <p className="text-xl md:text-2xl font-nunito opacity-90 mb-8">{t.heroSubtitle}</p>
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-lg">
              {t.badge1 && (
                <div className="flex items-center">
                  <Shield className="h-6 w-6 mr-2" />
                  <span>{t.badge1}</span>
                </div>
              )}
              {t.badge2 && (
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  <span>{t.badge2}</span>
                </div>
              )}
              {t.badge3 && (
                <div className="flex items-center">
                  <Heart className="h-6 w-6 mr-2" />
                  <span>{t.badge3}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="donate" className="w-full">
            {projects.length > 0 && (
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="donate">{t.tabDonate}</TabsTrigger>
                <TabsTrigger value="projects">{t.tabProjects}</TabsTrigger>
              </TabsList>
            )}

            {/* Aba de Doação */}
            <TabsContent value="donate" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Formulário de Doação */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-montserrat">{t.formTitle}</CardTitle>
                    <CardDescription>{t.formDescription}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Tipo de Doação */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block">{t.typeLabel}</Label>
                        <RadioGroup value={donationType} onValueChange={setDonationType}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="monthly" id="monthly" />
                            <Label htmlFor="monthly">{t.monthlyLabel}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="single" id="single" />
                            <Label htmlFor="single">{t.singleLabel}</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Valores Predefinidos */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block">{t.amountLabel}</Label>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {predefinedAmounts[donationType as keyof typeof predefinedAmounts].map((value) => (
                            <Button
                              key={value}
                              type="button"
                              variant={amount === value.toString() ? 'default' : 'outline'}
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
                          <Label htmlFor="customAmount">{t.otherAmountLabel}</Label>
                          <Input
                            id="customAmount"
                            type="number"
                            placeholder={t.otherAmountPlaceholder}
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
                      {!!selectedAmount && (
                        <div className="p-4 rounded-lg" style={{ backgroundColor: '#a0c93a20' }}>
                          <h4 className="font-semibold mb-2" style={{ color: '#3b660a' }}>{t.impactTitle}</h4>
                          <p style={{ color: '#2b4744' }}>{impactText}</p>
                        </div>
                      )}

                      {/* Dados Pessoais */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">{t.yourDataTitle}</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">{t.nameLabel}</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">{t.emailLabel}</Label>
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
                            <Label htmlFor="phone">{t.phoneLabel}</Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cpf">{t.cpfLabel}</Label>
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
                            <Label htmlFor="anonymous">{t.anonymousLabel}</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="newsletter"
                              checked={formData.newsletter}
                              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, newsletter: checked as boolean }))}
                            />
                            <Label htmlFor="newsletter">{t.newsletterLabel}</Label>
                          </div>
                        </div>
                      </div>

                      {/* Método de Pagamento */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block">{t.paymentLabel}</Label>
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="credit-card" id="credit-card" />
                            <CreditCard className="h-4 w-4" />
                            <Label htmlFor="credit-card">{t.cardLabel}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pix" id="pix" />
                            <Smartphone className="h-4 w-4" />
                            <Label htmlFor="pix">{t.pixLabel}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                            <Building className="h-4 w-4" />
                            <Label htmlFor="bank-transfer">{t.transferLabel}</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Button type="submit" className="w-full h-12 text-lg" style={{ backgroundColor: '#e8440d' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d63c0b'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8440d'}>
                        {donationType === 'monthly' ? t.monthlyButton : t.singleButton} {selectedAmount ? formatCurrency(selectedAmount) : ''}
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
                        {t.securityTitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 font-nunito">
                      {lines(t.securityItems).map((item, index) => (
                        <p key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: '#3b660a' }} />
                          {item}
                        </p>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Benefícios Fiscais */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center font-montserrat">
                        <Gift className="h-5 w-5 mr-2" style={{ color: '#81a425' }} />
                        {t.fiscalTitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="font-nunito space-y-3">
                      {paragraphs(t.fiscalText).map((p, index) => (
                        <p key={index} className="text-sm text-gray-600">{p}</p>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Transparência */}
                  {t.usage.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-montserrat">{t.usageTitle}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {t.usage.map((item, index) => {
                          const percent = Math.max(0, Math.min(100, parseFloat(item.percent) || 0));
                          return (
                            <div key={index} className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-nunito">{item.label}</span>
                                <span className="font-semibold">{percent}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full"
                                  style={{ width: `${percent}%`, backgroundColor: usageColors[index % usageColors.length] }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Aba de Projetos Específicos */}
            {projects.length > 0 && (
              <TabsContent value="projects" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project) => {
                    const showGoal = project.show_goal && project.goal > 0;
                    const percent = showGoal ? (project.raised / project.goal) * 100 : 0;
                    return (
                      <Card key={project.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="flex items-center font-montserrat">
                            <Heart className="h-8 w-8 flex-shrink-0" style={{ color: '#3b660a' }} />
                            <span className="ml-3">{project.title}</span>
                          </CardTitle>
                          <CardDescription className="font-nunito line-clamp-3">{project.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {showGoal && (
                              <div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span>{t.projectRaised}: {formatCurrency(project.raised)}</span>
                                  <span>{t.projectGoal}: {formatCurrency(project.goal)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div
                                    className="h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: '#3b660a' }}
                                  />
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                  {Math.round(percent)}% {t.projectReached}
                                </p>
                              </div>
                            )}

                            <Button asChild className="w-full" variant="outline">
                              <SmartLink to={project.donation_link || '/projetos'}>{t.projectButton}</SmartLink>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Donation;
