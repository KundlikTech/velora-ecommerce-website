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
        <title>Velora | Luxury & Premium Products</title>
        <meta
          name="description"
          content="Velora is a luxury and premium lifestyle store offering curated high-quality products."
        />
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
