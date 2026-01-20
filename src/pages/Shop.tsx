import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Header } from '@/components/layout/Header';
import { BranchSelector } from '@/components/customer/BranchSelector';
import { ProductList } from '@/components/customer/ProductList';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export default function Shop() {
  const { user, role, loading } = useAuth();
  const { selectedBranch, setSelectedBranch } = useCart();
  const [showBranchSelector, setShowBranchSelector] = useState(!selectedBranch);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || role !== 'customer')) {
      navigate('/login');
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
      <main className="container mx-auto px-4 py-8">
        {showBranchSelector || !selectedBranch ? (
          <BranchSelector
            onBranchSelected={() => setShowBranchSelector(false)}
          />
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium">{selectedBranch.display_name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedBranch(null);
                  setShowBranchSelector(true);
                }}
              >
                Change Branch
              </Button>
            </div>
            <ProductList />
          </div>
        )}
      </main>
    </div>
  );
}
