import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/hooks/useCart';
import { ProductCard } from './ProductCard';
import type { Product, Stock } from '@/lib/types';

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stocks, setStocks] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { selectedBranch } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*');
      if (data) {
        setProducts(data as Product[]);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!selectedBranch) return;

    const fetchStock = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('stock')
        .select('*')
        .eq('branch_id', selectedBranch.id);

      if (data) {
        const stockMap: Record<string, number> = {};
        data.forEach((s: Stock) => {
          stockMap[s.product_id] = s.quantity;
        });
        setStocks(stockMap);
      }
      setLoading(false);
    };

    fetchStock();

    // Subscribe to real-time stock updates
    const channel = supabase
      .channel('stock-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stock',
          filter: `branch_id=eq.${selectedBranch.id}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'product_id' in payload.new) {
            const newStock = payload.new as Stock;
            setStocks((prev) => ({
              ...prev,
              [newStock.product_id]: newStock.quantity,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedBranch]);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-72 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Our Drinks</h2>
        <p className="text-muted-foreground mt-2">
          Fresh beverages at great prices
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            stock={stocks[product.id] || 0}
          />
        ))}
      </div>
    </div>
  );
}
