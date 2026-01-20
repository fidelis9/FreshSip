import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Package } from 'lucide-react';
import type { SalesReport as SalesReportType } from '@/lib/types';

const COLORS = ['hsl(0, 85%, 45%)', 'hsl(30, 95%, 50%)', 'hsl(140, 70%, 40%)'];

export function SalesReport() {
  const [salesData, setSalesData] = useState<SalesReportType[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSalesData = async () => {
    // Get all completed orders with their items
    const { data: orderItems } = await supabase
      .from('order_items')
      .select(`
        quantity,
        subtotal,
        product_id,
        order:orders!inner(payment_status)
      `)
      .eq('order.payment_status', 'completed');

    const { data: products } = await supabase.from('products').select('*');

    if (orderItems && products) {
      const salesMap: Record<string, { quantity: number; income: number }> = {};
      
      orderItems.forEach((item: any) => {
        if (!salesMap[item.product_id]) {
          salesMap[item.product_id] = { quantity: 0, income: 0 };
        }
        salesMap[item.product_id].quantity += item.quantity;
        salesMap[item.product_id].income += Number(item.subtotal);
      });

      const report: SalesReportType[] = products.map((product: any) => ({
        productName: product.name,
        totalQuantity: salesMap[product.id]?.quantity || 0,
        totalIncome: salesMap[product.id]?.income || 0,
      }));

      setSalesData(report);
      setTotalIncome(report.reduce((sum, r) => sum + r.totalIncome, 0));
      setTotalQuantity(report.reduce((sum, r) => sum + r.totalQuantity, 0));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSalesData();

    // Subscribe to real-time order updates
    const channel = supabase
      .channel('admin-orders-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchSalesData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'order_items' },
        () => {
          fetchSalesData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-48 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Sales Report</h2>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-primary">
                  KSh {totalIncome.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Units Sold</p>
                <p className="text-3xl font-bold text-accent">
                  {totalQuantity.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. per Product</p>
                <p className="text-3xl font-bold text-success">
                  KSh {salesData.length > 0 ? Math.round(totalIncome / salesData.length).toLocaleString() : 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Revenue by Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="productName" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`KSh ${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="totalIncome" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Sales Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ productName, percent }) =>
                      `${productName} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="totalQuantity"
                  >
                    {salesData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value} units`, 'Quantity']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Sales by Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Product
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Quantity Sold
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Total Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((item, index) => (
                  <tr key={item.productName} className="border-b last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="font-medium">{item.productName}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4">
                      {item.totalQuantity.toLocaleString()} units
                    </td>
                    <td className="text-right py-3 px-4 font-semibold">
                      KSh {item.totalIncome.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/50 font-bold">
                  <td className="py-3 px-4">Grand Total</td>
                  <td className="text-right py-3 px-4">
                    {totalQuantity.toLocaleString()} units
                  </td>
                  <td className="text-right py-3 px-4 text-primary">
                    KSh {totalIncome.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
