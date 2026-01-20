import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn } from 'lucide-react';

interface LoginFormProps {
  onToggle: () => void;
  isAdmin?: boolean;
}

export function LoginForm({ onToggle, isAdmin = false }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
    }

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md shadow-soft animate-scale-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {isAdmin ? 'Admin Login' : 'Welcome Back'}
        </CardTitle>
        <CardDescription>
          {isAdmin
            ? 'Sign in to access the admin dashboard'
            : 'Sign in to start shopping'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="mr-2 h-4 w-4" />
            )}
            Sign In
          </Button>
        </form>
        {!isAdmin && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              onClick={onToggle}
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
