import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $100',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    description: '100% secure checkout',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated support team',
  },
];

export default function PromoSection() {
  return (
    <>
      {/* Features Strip */}
      <section className="border-y border-border bg-card">
        <div className="container py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-8 lg:p-16">
            {/* Background Pattern */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
            </div>

            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <span className="inline-block rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent">
                  Limited Time Offer
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">
                  Get 25% Off Your First Order
                </h2>
                <p className="text-primary-foreground/80 max-w-md mx-auto lg:mx-0">
                  Subscribe to our newsletter and receive an exclusive discount code for your first purchase.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 h-12 px-4 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <Button variant="accent" size="lg" className="whitespace-nowrap">
                    Subscribe
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>

              <div className="hidden lg:flex justify-end">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80"
                  alt="Shopping promo"
                  className="w-80 h-80 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
