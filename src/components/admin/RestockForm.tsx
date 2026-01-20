import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PackagePlus } from 'lucide-react';
import type { Branch, Product } from '@/lib/types';

export function RestockForm() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const [branchesRes, productsRes] = await Promise.all([
        supabase.from('branches').select('*').order('is_headquarter', { ascending: false }),
        supabase.from('products').select('*'),
      ]);

      if (branchesRes.data) setBranches(branchesRes.data as Branch[]);
      if (productsRes.data) setProducts(productsRes.data as Product[]);
    };

    fetchData();
  }, []);

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedBranch || !selectedProduct || !quantity) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const qty = parseInt(quantity);
    if (qty <= 0) {
      toast({
        title: 'Error',
        description: 'Quantity must be greater than 0',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Get current stock
      const { data: currentStock } = await supabase
        .from('stock')
        .select('quantity')
        .eq('branch_id', selectedBranch)
        .eq('product_id', selectedProduct)
        .single();

      // Update stock
      const { error: stockError } = await supabase
        .from('stock')
        .update({ quantity: (currentStock?.quantity || 0) + qty })
        .eq('branch_id', selectedBranch)
        .eq('product_id', selectedProduct);

      if (stockError) throw stockError;

      // Log restock action
      const { error: logError } = await supabase.from('restock_logs').insert({
        admin_id: user.id,
        branch_id: selectedBranch,
        product_id: selectedProduct,
        quantity: qty,
      });

      if (logError) throw logError;

      const branchName = branches.find((b) => b.id === selectedBranch)?.display_name;
      const productName = products.find((p) => p.id === selectedProduct)?.name;

      toast({
        title: 'Stock Updated',
        description: `Added ${qty} units of ${productName} to ${branchName}`,
      });

      // Reset form
      setSelectedBranch('');
      setSelectedProduct('');
      setQuantity('');
    } catch (error) {
      console.error('Restock error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update stock. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PackagePlus className="h-5 w-5 text-primary" />
          Restock Branch
        </CardTitle>
        <CardDescription>
          Add inventory from Nairobi HQ to any branch
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRestock} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="branch">Select Branch</Label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Choose a branch" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product">Select Product</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Choose a product" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity to Add</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Stock...
              </>
            ) : (
              <>
                <PackagePlus className="mr-2 h-4 w-4" />
                Add Stock
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
