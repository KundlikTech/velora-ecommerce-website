import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';

export default function Wishlist() {
  const { wishlist } = useCart();
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <>
        <Helmet>
          <title>Wishlist | Store</title>
        </Helmet>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center py-20">
            <div className="text-center space-y-6">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                <Heart className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Your wishlist is empty</h1>
                <p className="text-muted-foreground mt-1">
                  Save your favorite products for later.
                </p>
              </div>
              <Button asChild variant="accent" size="lg">
                <Link to="/products">
                  Explore Products
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
        <title>Wishlist ({wishlistProducts.length}) | Store</title>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-8">
          <div className="container">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
              <p className="text-muted-foreground mt-1">
                {wishlistProducts.length} saved items
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
