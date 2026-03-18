import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsLoading(true);
    
    // Simular envio
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail('');
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <div className="py-12" style={{ backgroundColor: '#2b4744' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <CheckCircle className="h-16 w-16 mx-auto mb-4" style={{ color: '#3b660a' }} />
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-montserrat">
                Obrigado por se inscrever!
              </h3>
              <p className="text-gray-600 font-nunito">
                Você receberá nossas atualizações e novidades sobre nossos projetos.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12" style={{ backgroundColor: '#2b4744' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <Mail className="h-12 w-12 text-white mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 font-montserrat">
              Fique por dentro das nossas ações
            </h3>
            <p className="text-white opacity-90 font-nunito">
              Receba atualizações sobre nossos projetos, histórias inspiradoras e como você pode ajudar ainda mais.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Seu melhor e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white border-0 h-12 text-gray-900 placeholder-gray-500"
              required
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="text-white h-12 px-8 whitespace-nowrap"
              style={{ backgroundColor: '#e8440d' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d63c0b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8440d'}
            >
              {isLoading ? 'Inscrevendo...' : 'Inscrever-se'}
            </Button>
          </form>
          
          <p className="text-white opacity-80 text-sm mt-4 font-nunito">
            Respeitamos sua privacidade. Você pode cancelar a inscrição a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;