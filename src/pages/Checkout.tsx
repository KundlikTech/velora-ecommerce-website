import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, CreditCard, Truck, Check, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, generateOrderNumber } from '@/lib/currency';
import { toast } from 'sonner';
import { z } from 'zod';
import { cn } from '@/lib/utils';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(6, 'Valid postal code is required'),
});

export default function Checkout() {
  const navigate = useNavigate();
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const shipping = cartTotal >= 5000 ? 0 : 499;
  const total = cartTotal + shipping;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setStep('payment');
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please sign in to complete your order');
      navigate('/auth');
      return;
    }

    setLoading(true);

    try {
      const orderNumber = generateOrderNumber();
      
      const { error } = await supabase.from('orders').insert({
        user_id: user.id,
        order_number: orderNumber,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: cartTotal,
        shipping: shipping,
        total: total,
        status: 'confirmed',
        payment_status: 'paid',
        shipping_address: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
      });

      if (error) throw error;

      clearCart();
      setStep('success');
      toast.success('Order placed successfully!');
    } catch (error: any) {
      toast.error('Failed to place order', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== 'success') {
    navigate('/cart');
    return null;
  }

  if (step === 'success') {
    return (
      <>
        <Helmet>
          <title>Order Confirmed | Store</title>
        </Helmet>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center py-20">
            <div className="text-center space-y-6 max-w-md mx-auto px-4">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
                <Check className="h-10 w-10 text-success" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Order Confirmed!</h1>
                <p className="text-muted-foreground mt-2">
                  Thank you for your purchase. Your order has been placed successfully.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="accent">
                  <a href="/orders">View Orders</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/products">Continue Shopping</a>
                </Button>
              </div>
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
        <title>Checkout | Store</title>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-8">
          <div className="container max-w-4xl">
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => step === 'payment' ? setStep('shipping') : navigate('/cart')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {step === 'payment' ? 'Back to Shipping' : 'Back to Cart'}
            </Button>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold",
                  "bg-accent text-accent-foreground"
                )}>
                  1
                </div>
                <span className="font-medium">Shipping</span>
              </div>
              <div className="h-px w-12 bg-border" />
              <div className="flex items-center gap-2">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold",
                  step === 'payment' ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                )}>
                  2
                </div>
                <span className={step === 'payment' ? "font-medium" : "text-muted-foreground"}>
                  Payment
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-3">
                {step === 'shipping' ? (
                  <div className="p-6 rounded-2xl bg-card border border-border/50">
                    <div className="flex items-center gap-3 mb-6">
                      <Truck className="h-6 w-6 text-accent" />
                      <h2 className="text-xl font-semibold">Shipping Information</h2>
                    </div>

                    <form onSubmit={handleShippingSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Full Name</label>
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            className={cn(
                              "w-full h-11 px-4 rounded-xl bg-secondary border transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
                              errors.fullName ? "border-destructive" : "border-border"
                            )}
                          />
                          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className={cn(
                              "w-full h-11 px-4 rounded-xl bg-secondary border transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
                              errors.email ? "border-destructive" : "border-border"
                            )}
                          />
                          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                          className={cn(
                            "w-full h-11 px-4 rounded-xl bg-secondary border transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
                            errors.phone ? "border-destructive" : "border-border"
                          )}
                        />
                        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Address</label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={e => setFormData({ ...formData, address: e.target.value })}
                          className={cn(
                            "w-full h-11 px-4 rounded-xl bg-secondary border transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
                            errors.address ? "border-destructive" : "border-border"
                          )}
                        />
                        {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">City</label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                            className={cn(
                              "w-full h-11 px-4 rounded-xl bg-secondary border transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
                              errors.city ? "border-destructive" : "border-border"
                            )}
                          />
                          {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Postal Code</label>
                          <input
                            type="text"
                            value={formData.postalCode}
                            onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                            className={cn(
                              "w-full h-11 px-4 rounded-xl bg-secondary border transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
                              errors.postalCode ? "border-destructive" : "border-border"
                            )}
                          />
                          {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode}</p>}
                        </div>
                      </div>

                      <Button type="submit" variant="accent" size="lg" className="w-full mt-6">
                        Continue to Payment
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-card border border-border/50">
                    <div className="flex items-center gap-3 mb-6">
                      <CreditCard className="h-6 w-6 text-accent" />
                      <h2 className="text-xl font-semibold">Payment</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                        <p className="text-sm text-muted-foreground mb-2">Demo Payment</p>
                        <p className="font-medium">
                          This is a demo checkout. Click "Place Order" to simulate a successful payment.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                        <p className="text-sm font-medium text-success">
                          ✓ Shipping to: {formData.address}, {formData.city} - {formData.postalCode}
                        </p>
                      </div>

                      <Button
                        variant="accent"
                        size="lg"
                        className="w-full"
                        onClick={handlePayment}
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>Place Order - {formatCurrency(total)}</>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-2">
                <div className="sticky top-24 p-6 rounded-2xl bg-card border border-border/50">
                  <h3 className="font-semibold mb-4">Order Summary</h3>
                  
                  <div className="space-y-3 max-h-64 overflow-auto">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border mt-4 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Free shipping on orders over ₹5,000
                      </p>
                    )}
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
