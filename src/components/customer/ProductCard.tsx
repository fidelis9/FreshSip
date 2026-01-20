import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  stock: number;
}

const productColors: Record<string, string> = {
  Coke: 'from-red-500 to-red-600',
  Fanta: 'from-orange-400 to-orange-500',
  Sprite: 'from-green-400 to-green-500',
};

export function ProductCard({ product, stock }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (quantity > stock) {
      toast({
        title: 'Insufficient Stock',
        description: `Only ${stock} units available`,
        variant: 'destructive',
      });
      return;
    }

    addToCart(product, quantity);
    toast({
      title: 'Added to Cart',
      description: `${quantity}x ${product.name} added to your cart`,
    });
    setQuantity(1);
  };

  const gradientClass = productColors[product.name] || 'from-primary to-primary/80';

  return (
    <Card className="overflow-hidden shadow-soft hover:shadow-glow transition-all duration-300 animate-fade-in">
      <div className={`h-32 bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
        <span className="text-4xl font-bold text-white drop-shadow-lg">
          {product.name}
        </span>
      </div>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              KSh {product.price.toFixed(0)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 text-center"
            min={1}
            max={stock}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            disabled={quantity >= stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}
