import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Header } from '@/components/layout/Header';
import { Shield } from 'lucide-react';

export default function AdminLogin() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && role === 'admin') {
      navigate('/admin/dashboard');
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
            <Shield className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-3xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-muted-foreground">FreshSip Management System</p>
          </div>
          <LoginForm onToggle={() => {}} isAdmin />
        </div>
      </main>
    </div>
  );
}
