import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/currency';
import { toast } from 'sonner';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const handleRemove = (id: string, name: string) => {
    removeFromCart(id);
    toast.success('Removed from cart', { description: name });
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please sign in to checkout', {
        description: 'Create an account or sign in to continue.',
      });
      navigate('/auth');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Cart | Store</title>
        </Helmet>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center py-20">
            <div className="text-center space-y-6">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Your cart is empty</h1>
                <p className="text-muted-foreground mt-1">
                  Looks like you haven't added any products yet.
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

  const shipping = cartTotal >= 5000 ? 0 : 499;
  const total = cartTotal + shipping;

  return (
    <>
      <Helmet>
        <title>{`Cart (${items.length}) | Store`}</title>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-8">
          <div className="container">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map(item => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-2xl bg-card border border-border/50 animate-fade-in"
                  >
                    <Link
                      to={`/product/${item.id}`}
                      className="w-24 h-24 rounded-xl overflow-hidden bg-secondary/50 shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            {item.category}
                          </p>
                          <Link
                            to={`/product/${item.id}`}
                            className="font-semibold hover:text-accent transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemove(item.id, item.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-semibold">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="ghost"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    clearCart();
                    toast.success('Cart cleared');
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 p-6 rounded-2xl bg-card border border-border/50 space-y-6">
                  <h2 className="text-lg font-semibold">Order Summary</h2>

                  <div className="space-y-3">
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
                    <div className="h-px bg-border" />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>

                  {!user && (
                    <p className="text-xs text-center text-muted-foreground">
                      <Link to="/auth" className="text-accent hover:underline">Sign in</Link> to checkout
                    </p>
                  )}
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
