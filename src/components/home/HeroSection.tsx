import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/30 py-20 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent animate-fade-in">
              <Sparkles className="h-4 w-4" />
              New Collection Available
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight animate-fade-in-up">
              Discover Your
              <span className="block gradient-text">Perfect Style</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Curated collection of premium products designed for the modern lifestyle. 
              Quality meets aesthetics in every piece.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <Button asChild variant="accent" size="xl">
                <Link to="/products">
                  Shop Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/products?featured=true">
                  View Featured
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 justify-center lg:justify-start pt-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div>
                <p className="text-2xl font-bold">50K+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold">4.9</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold">24h</p>
                <p className="text-sm text-muted-foreground">Fast Delivery</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Background Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/20 via-accent/10 to-transparent blur-2xl" />
              
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                  alt="Premium products showcase"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-4 bottom-1/4 glass-card rounded-xl p-3 shadow-lg animate-float">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-success/20 flex items-center justify-center">
                    <span className="text-success text-lg">✓</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Quality</p>
                    <p className="text-sm font-semibold">Guaranteed</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 top-1/4 glass-card rounded-xl p-3 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <span className="text-accent text-lg">★</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="text-sm font-semibold">4.9 Stars</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
