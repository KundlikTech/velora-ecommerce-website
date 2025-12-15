import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, ArrowUpDown } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { products as allProducts } from '@/data/products';
import { FilterState, SortOption } from '@/types/product';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const maxPrice = Math.max(...allProducts.map(p => p.price));

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, maxPrice],
    rating: null,
    inStock: false,
  });

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setFilters(prev => ({ ...prev, categories: [category] }));
    }
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(p =>
        filters.categories.some(c => p.category.toLowerCase().replace(' & ', '-').replace(' ', '-') === c)
      );
    }

    // Price filter
    result = result.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Rating filter
    if (filters.rating) {
      result = result.filter(p => p.rating >= filters.rating!);
    }

    // In stock filter
    if (filters.inStock) {
      result = result.filter(p => p.inStock);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Assuming newer products have higher IDs
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [searchQuery, filters, sortBy]);

  return (
    <>
      <Helmet>
        <title>All Products | Store</title>
        <meta name="description" content="Browse our complete collection of premium products. Filter by category, price, and rating to find exactly what you need." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-8">
          <div className="container">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
              <p className="text-muted-foreground mt-1">
                Showing {filteredProducts.length} products
              </p>
            </div>

            {/* Search and Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                />
              </div>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-full sm:w-48 h-11 rounded-xl">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Main Content */}
            <div className="flex gap-8">
              <ProductFilters filters={filters} onFiltersChange={setFilters} maxPrice={maxPrice} />
              <div className="flex-1">
                <ProductGrid products={filteredProducts} loading={loading} />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
