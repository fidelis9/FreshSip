import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CartSummary() {
  const { items, updateQuantity, removeFromCart, totalAmount, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <Card className="shadow-soft">
        <CardContent className="p-12 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground mb-6">
            Add some delicious drinks to get started
          </p>
          <Link to="/shop">
            <Button>Browse Drinks</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Your Cart ({totalItems} items)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
          >
            <div className="flex-1">
              <h4 className="font-semibold">{item.product.name}</h4>
              <p className="text-sm text-muted-foreground">
                KSh {item.product.price.toFixed(0)} each
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="w-24 text-right font-semibold">
                KSh {(item.product.price * item.quantity).toFixed(0)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => removeFromCart(item.product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="border-t pt-4 mt-4">
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">KSh {totalAmount.toFixed(0)}</span>
          </div>
        </div>

        <Link to="/checkout">
          <Button className="w-full" size="lg">
            Proceed to Payment
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
