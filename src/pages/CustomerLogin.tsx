import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Header } from '@/components/layout/Header';
import { Store } from 'lucide-react';

export default function CustomerLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && role === 'customer') {
      navigate('/shop');
    }
  }, [user, role, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="mb-8 text-center">
            <Store className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-3xl font-bold text-foreground">FreshSip</h1>
            <p className="text-muted-foreground">Customer Portal</p>
          </div>
          {isLogin ? (
            <LoginForm onToggle={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggle={() => setIsLogin(true)} />
          )}
        </div>
      </main>
    </div>
  );
}
