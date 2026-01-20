import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/hooks/useCart';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Building2, CheckCircle } from 'lucide-react';
import type { Branch } from '@/lib/types';

interface BranchSelectorProps {
  onBranchSelected: () => void;
}

export function BranchSelector({ onBranchSelected }: BranchSelectorProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedBranch, setSelectedBranch } = useCart();

  useEffect(() => {
    const fetchBranches = async () => {
      const { data } = await supabase
        .from('branches')
        .select('*')
        .order('is_headquarter', { ascending: false });

      if (data) {
        setBranches(data as Branch[]);
      }
      setLoading(false);
    };

    fetchBranches();
  }, []);

  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    onBranchSelected();
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Select Your Branch</h2>
        <p className="text-muted-foreground mt-2">
          Choose the branch nearest to you to start shopping
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch) => (
          <Card
            key={branch.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-soft hover:scale-[1.02] ${
              selectedBranch?.id === branch.id
                ? 'ring-2 ring-primary shadow-glow'
                : ''
            }`}
            onClick={() => handleSelectBranch(branch)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {branch.is_headquarter ? (
                    <Building2 className="h-8 w-8 text-primary" />
                  ) : (
                    <MapPin className="h-8 w-8 text-accent" />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{branch.display_name}</h3>
                    {branch.is_headquarter && (
                      <span className="text-xs text-primary font-medium">
                        Headquarters
                      </span>
                    )}
                  </div>
                </div>
                {selectedBranch?.id === branch.id && (
                  <CheckCircle className="h-6 w-6 text-primary" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
