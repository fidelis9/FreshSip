import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle } from 'lucide-react';
import type { Branch, Product, Stock } from '@/lib/types';

interface StockData {
  branch: Branch;
  stocks: { product: Product; quantity: number }[];
}

export function StockOverview() {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStockData = async () => {
    const [branchesRes, productsRes, stocksRes] = await Promise.all([
      supabase.from('branches').select('*').order('is_headquarter', { ascending: false }),
      supabase.from('products').select('*'),
      supabase.from('stock').select('*'),
    ]);

    if (branchesRes.data && productsRes.data && stocksRes.data) {
      const branches = branchesRes.data as Branch[];
      const products = productsRes.data as Product[];
      const stocks = stocksRes.data as Stock[];

      const data: StockData[] = branches.map((branch) => ({
        branch,
        stocks: products.map((product) => {
          const stock = stocks.find(
            (s) => s.branch_id === branch.id && s.product_id === product.id
          );
          return { product, quantity: stock?.quantity || 0 };
        }),
      }));

      setStockData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStockData();

    // Subscribe to real-time stock updates
    const channel = supabase
      .channel('admin-stock-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stock' },
        () => {
          fetchStockData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStockBadge = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (quantity < 20) {
      return <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>;
    }
    return <Badge className="bg-success text-success-foreground">In Stock</Badge>;
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Stock Levels</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-success" /> In Stock
          <span className="h-2 w-2 rounded-full bg-warning ml-2" /> Low Stock
          <span className="h-2 w-2 rounded-full bg-destructive ml-2" /> Out of Stock
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stockData.map(({ branch, stocks }) => (
          <Card key={branch.id} className="shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-primary" />
                {branch.display_name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stocks.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <span className="font-medium">{product.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{quantity} units</span>
                      {quantity < 20 && quantity > 0 && (
                        <AlertTriangle className="h-4 w-4 text-warning" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
