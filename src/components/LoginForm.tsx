
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';

interface LoginFormProps {
  onBack?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signup(email, password, name);
      } else {
        await login(email, password);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message || 'Wystąpił błąd podczas logowania');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen summer-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-lg shadow-2xl border-0">
          {onBack && (
            <div className="p-6 pb-0">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Powróć
              </button>
            </div>
          )}
          
          <div className="text-center p-6 pb-6">
            <div className="text-6xl mb-4">☀️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Twój Plan na Lato
            </h1>
            <p className="text-lg text-gray-600">
              {isSignUp ? 'Załóż konto i stwórz swój idealny plan wakacyjny!' : 'Zaloguj się i stwórz swój idealny plan wakacyjny!'}
            </p>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <input
                    type="text"
                    placeholder="Twoje imię"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 px-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              )}
              <div>
                <input
                  type="email"
                  placeholder="Twój email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Hasło"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  minLength={6}
                />
                <div className='flex items-center mt-3 '>
                <input
                  type="checkbox"
                  className="mt-2"
                  value="Akceptuję regulamin i politykę prywatności"/>
                 <p className='text-sm ml-5'>Akceptuję regulamin i politykę prywatności</p></div>
                 </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <button 
                type="submit" 
                className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-md font-medium transition-colors"
                disabled={isLoading || !email.trim() || !password.trim() || (isSignUp && !name.trim())}
              >
                {isLoading ? 'Ładowanie...' : (isSignUp ? 'Załóż konto 🚀' : 'Zaloguj się 🚀')}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {isSignUp ? 'Masz już konto? Zaloguj się' : 'Nie masz konta? Załóż je tutaj'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
