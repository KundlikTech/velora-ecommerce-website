import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { products } from '@/data/products';

export default function FeaturedProducts() {
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  return (
    <section className="py-20">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="text-muted-foreground mt-1">Handpicked favorites from our collection</p>
          </div>
          <Button asChild variant="ghost" className="group">
            <Link to="/products?featured=true">
              View All
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
