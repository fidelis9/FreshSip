import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, LogOut, User, Store, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Header() {
  const { user, role, signOut } = useAuth();
  const { totalItems, selectedBranch } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Store className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">FreshSip</span>
        </Link>

        {user && role === 'customer' && selectedBranch && (
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{selectedBranch.display_name}</span>
          </div>
        )}

        <nav className="flex items-center gap-3">
          {user ? (
            <>
              {role === 'customer' && (
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="capitalize">{role}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Customer Login
                </Button>
              </Link>
              <Link to="/admin/login">
                <Button variant="outline" size="sm">
                  Admin
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
