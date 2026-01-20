import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Header } from '@/components/layout/Header';
import { MpesaPayment } from '@/components/customer/MpesaPayment';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Checkout() {
  const { user, role, loading } = useAuth();
  const { items, selectedBranch } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || role !== 'customer')) {
      navigate('/login');
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    if (!loading && (items.length === 0 || !selectedBranch)) {
      navigate('/shop');
    }
  }, [items, selectedBranch, loading, navigate]);

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
      <main className="container mx-auto px-4 py-8">
        <Link to="/cart">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <div className="max-w-md mx-auto">
          <MpesaPayment />
        </div>
      </main>
    </div>
  );
}
