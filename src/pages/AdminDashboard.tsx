import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { StockOverview } from '@/components/admin/StockOverview';
import { RestockForm } from '@/components/admin/RestockForm';
import { SalesReport } from '@/components/admin/SalesReport';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, PackagePlus, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stock');

  useEffect(() => {
    if (!loading && (!user || role !== 'admin')) {
      navigate('/admin/login');
    }
  }, [user, role, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage inventory and view sales reports across all branches
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="stock" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Stock</span>
            </TabsTrigger>
            <TabsTrigger value="restock" className="flex items-center gap-2">
              <PackagePlus className="h-4 w-4" />
              <span className="hidden sm:inline">Restock</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stock">
            <StockOverview />
          </TabsContent>

          <TabsContent value="restock">
            <div className="max-w-md">
              <RestockForm />
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <SalesReport />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
