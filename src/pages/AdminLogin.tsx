import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const success = login(password);
      if (success) {
        navigate('/admin');
      } else {
        setError('Senha incorreta. Tente novamente.');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full" style={{ backgroundColor: '#a0c93a' }}>
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-montserrat">Admin - Missão Caiuá</CardTitle>
          <CardDescription className="text-center font-nunito">
            Digite a senha para acessar o painel administrativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite a senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              style={{ backgroundColor: '#3b660a' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2b4744'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b660a'}
              disabled={isLoading}
            >
              {isLoading ? 'Verificando...' : 'Entrar'}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-4">
              Senha padrão: password
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
