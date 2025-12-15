import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, ShoppingBag, Star, Truck, Shield, Minus, Plus, Check } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button asChild>
              <Link to="/products">Back to Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const images = product.images || [product.image];
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success('Added to cart', {
      description: `${quantity}x ${product.name}`,
    });
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <Helmet>
        <title>{product.name} | Store</title>
        <meta name="description" content={product.description.slice(0, 160)} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-8">
          <div className="container">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
              <span>/</span>
              <span className="text-foreground">{product.name}</span>
            </div>

            {/* Product Section */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Images */}
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden rounded-2xl bg-secondary/50 border border-border/50">
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {images.length > 1 && (
                  <div className="flex gap-3">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                          "w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                          selectedImage === index
                            ? "border-accent"
                            : "border-border/50 hover:border-border"
                        )}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
                    {product.category}
                  </p>
                  <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">{product.name}</h1>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          i < Math.floor(product.rating)
                            ? "fill-accent text-accent"
                            : "text-border"
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-muted-foreground line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                      <span className="rounded-full bg-destructive/10 px-3 py-1 text-sm font-semibold text-destructive">
                        Save {discount}%
                      </span>
                    </>
                  )}
                </div>

                <p className="text-muted-foreground leading-relaxed">{product.description}</p>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  {product.inStock ? (
                    <>
                      <Check className="h-5 w-5 text-success" />
                      <span className="text-success font-medium">In Stock</span>
                    </>
                  ) : (
                    <span className="text-destructive font-medium">Out of Stock</span>
                  )}
                </div>

                {/* Quantity and Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center border border-border rounded-xl">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="accent"
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant={inWishlist ? 'destructive' : 'outline'}
                    size="lg"
                    onClick={handleToggleWishlist}
                  >
                    <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
                  </Button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <Truck className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Free Shipping</p>
                      <p className="text-xs text-muted-foreground">On orders over ₹5,000</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">2 Year Warranty</p>
                      <p className="text-xs text-muted-foreground">Full coverage</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <section className="mt-20">
                <h2 className="text-2xl font-bold tracking-tight mb-8">Related Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
