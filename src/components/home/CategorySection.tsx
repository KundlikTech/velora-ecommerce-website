import { Link } from 'react-router-dom';
import { categories } from '@/data/products';

const categoryImages: Record<string, string> = {
  electronics: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80',
  fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
  'home-living': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80',
  sports: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80',
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
  books: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
};

export default function CategorySection() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
          <p className="text-muted-foreground mt-2">Find exactly what you're looking for</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className="group block animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-card border border-border/50 transition-all duration-300 hover:border-accent/30 hover:shadow-xl hover:-translate-y-1">
                <img
                  src={categoryImages[category.slug]}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{category.productCount} Products</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
