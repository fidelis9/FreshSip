import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Smartphone, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MpesaPayment() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const { items, selectedBranch, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const simulateMpesaPayment = async () => {
    // Simulate M-Pesa API call with random success/failure
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // 80% success rate for demo
    return Math.random() < 0.8;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedBranch || items.length === 0) {
      toast({
        title: 'Error',
        description: 'Please ensure you have items in cart and selected a branch',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');

    try {
      // Simulate M-Pesa payment
      const paymentSuccess = await simulateMpesaPayment();

      if (paymentSuccess) {
        // Create order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            customer_id: user.id,
            branch_id: selectedBranch.id,
            total_amount: totalAmount,
            payment_status: 'completed',
            mpesa_reference: `MPESA${Date.now()}`,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = items.map((item) => ({
          order_id: order.id,
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price,
          subtotal: item.product.price * item.quantity,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;

        // Stock is automatically reduced by database trigger on order_items insert

        setPaymentStatus('success');
        toast({
          title: 'Payment Successful!',
          description: `Transaction reference: ${order.mpesa_reference}`,
        });

        // Clear cart and redirect after delay
        setTimeout(() => {
          clearCart();
          navigate('/shop');
        }, 3000);
      } else {
        setPaymentStatus('failed');
        toast({
          title: 'Payment Failed',
          description: 'The M-Pesa transaction was not completed. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      toast({
        title: 'Error',
        description: 'An error occurred during payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (paymentStatus === 'success') {
    return (
      <Card className="shadow-soft animate-scale-in">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-success mb-2">Payment Successful!</h3>
          <p className="text-muted-foreground mb-4">
            Your order has been placed successfully.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting to shop...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <Card className="shadow-soft animate-scale-in">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>
          <h3 className="text-2xl font-bold text-destructive mb-2">Payment Failed</h3>
          <p className="text-muted-foreground mb-6">
            The transaction could not be completed. Please try again.
          </p>
          <Button onClick={() => setPaymentStatus('idle')}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft">
      <CardHeader className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
          <Smartphone className="h-8 w-8 text-success" />
        </div>
        <CardTitle>M-Pesa Payment</CardTitle>
        <CardDescription>
          Enter your phone number to receive the payment prompt
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePayment} className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Branch:</span>
              <span className="font-medium">{selectedBranch?.display_name}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Items:</span>
              <span className="font-medium">{items.length}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
              <span>Total:</span>
              <span className="text-primary">KSh {totalAmount.toFixed(0)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">M-Pesa Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="254712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              pattern="254[0-9]{9}"
              title="Enter a valid Kenyan phone number (254XXXXXXXXX)"
            />
            <p className="text-xs text-muted-foreground">
              Format: 254XXXXXXXXX (e.g., 254712345678)
            </p>
          </div>

          <Button
            type="submit"
            className="w-full gradient-accent text-accent-foreground"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Smartphone className="mr-2 h-5 w-5" />
                Pay KSh {totalAmount.toFixed(0)}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            A payment request will be sent to your phone. Enter your M-Pesa PIN to complete.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
