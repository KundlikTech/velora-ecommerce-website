import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success('Added to cart', {
      description: product.name,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', {
      description: product.name,
    });
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 transition-all duration-500 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-secondary/50">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount > 0 && (
              <span className="rounded-full bg-destructive px-2.5 py-1 text-xs font-semibold text-destructive-foreground">
                -{discount}%
              </span>
            )}
            {product.tags?.includes('bestseller') && (
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                Bestseller
              </span>
            )}
            {product.tags?.includes('new') && (
              <span className="rounded-full bg-success px-2.5 py-1 text-xs font-semibold text-success-foreground">
                New
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <Button
              variant="secondary"
              size="icon-sm"
              className={cn(
                "rounded-full shadow-lg backdrop-blur-sm",
                inWishlist && "bg-destructive/10 text-destructive hover:bg-destructive/20"
              )}
              onClick={handleToggleWishlist}
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
            </Button>
          </div>

          {/* Add to Cart Button */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <Button
              variant="accent"
              className="w-full rounded-xl shadow-lg"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {product.category}
          </p>
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              <span className="ml-1 text-sm font-medium">{product.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-lg font-bold text-foreground">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
