import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Package, ArrowRight, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  order_number: string;
  items: OrderItem[];
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
}

export default function Orders() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast the data to our Order type
      const typedOrders: Order[] = (data || []).map(order => ({
        ...order,
        items: order.items as unknown as OrderItem[],
      }));
      
      setOrders(typedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/20 text-success';
      case 'processing':
        return 'bg-accent/20 text-accent';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-500';
      case 'delivered':
        return 'bg-success/20 text-success';
      case 'cancelled':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <>
        <Helmet>
          <title>My Orders | Store</title>
        </Helmet>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center py-20">
            <div className="text-center space-y-6">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">No orders yet</h1>
                <p className="text-muted-foreground mt-1">
                  Start shopping to see your orders here.
                </p>
              </div>
              <Button asChild variant="accent" size="lg">
                <Link to="/products">
                  Start Shopping
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Orders | Store</title>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-8">
          <div className="container max-w-4xl">
            <h1 className="text-3xl font-bold tracking-tight mb-8">My Orders</h1>

            <div className="space-y-4">
              {orders.map((order, index) => (
                <div
                  key={order.id}
                  className="p-6 rounded-2xl bg-card border border-border/50 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order #{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold capitalize",
                        getStatusColor(order.status)
                      )}>
                        {order.status}
                      </span>
                      <span className="font-semibold">{formatCurrency(order.total)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {order.items.slice(0, 4).map((item: any, idx: number) => (
                      <img
                        key={idx}
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                      />
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <span className="text-sm font-medium">+{order.items.length - 4}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
