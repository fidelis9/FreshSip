import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { ShoppingBag, Shield, Truck, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Fresh Drinks,{' '}
              <span className="text-primary">Delivered Fast</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your favorite soft drinks from Kenya's leading supermarket chain. 
              Shop Coke, Fanta, and Sprite across all our branches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto gradient-accent text-accent-foreground">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Start Shopping
                </Button>
              </Link>
              <Link to="/admin/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Shield className="mr-2 h-5 w-5" />
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose FreshSip?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">5 Branches</h3>
              <p className="text-muted-foreground">
                Nairobi HQ, Kisumu, Mombasa, Nakuru, and Eldoret
              </p>
            </div>
            <div className="text-center p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <Zap className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">M-Pesa Payments</h3>
              <p className="text-muted-foreground">
                Quick and secure mobile money transactions
              </p>
            </div>
            <div className="text-center p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Same Prices</h3>
              <p className="text-muted-foreground">
                Consistent pricing across all our branches
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Products</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="rounded-xl overflow-hidden shadow-soft hover:shadow-glow transition-all duration-300 animate-scale-in">
              <div className="h-40 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <span className="text-5xl font-bold text-white">Coke</span>
              </div>
              <div className="p-4 bg-card">
                <p className="text-center text-2xl font-bold text-foreground">KSh 50</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-soft hover:shadow-glow transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="h-40 bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                <span className="text-5xl font-bold text-white">Fanta</span>
              </div>
              <div className="p-4 bg-card">
                <p className="text-center text-2xl font-bold text-foreground">KSh 50</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-soft hover:shadow-glow transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="h-40 bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                <span className="text-5xl font-bold text-white">Sprite</span>
              </div>
              <div className="p-4 bg-card">
                <p className="text-center text-2xl font-bold text-foreground">KSh 50</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 FreshSip Supermarket Chain. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
