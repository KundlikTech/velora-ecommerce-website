import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategorySection from '@/components/home/CategorySection';
import PromoSection from '@/components/home/PromoSection';

export default function Index() {
  return (
    <>
      <Helmet>
        <title>Store | Premium Products for Modern Living</title>
        <meta name="description" content="Discover curated collection of premium products. Shop electronics, fashion, home & living with free shipping on orders over $100." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <FeaturedProducts />
          <CategorySection />
          <PromoSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
