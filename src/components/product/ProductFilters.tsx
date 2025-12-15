import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { categories } from '@/data/products';
import { FilterState } from '@/types/product';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/currency';

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  maxPrice: number;
}

export default function ProductFilters({ filters, onFiltersChange, maxPrice }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categorySlug]
      : filters.categories.filter(c => c !== categorySlug);
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  const handleRatingChange = (rating: number | null) => {
    onFiltersChange({ ...filters, rating });
  };

  const handleInStockChange = (checked: boolean) => {
    onFiltersChange({ ...filters, inStock: checked });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [0, maxPrice],
      rating: null,
      inStock: false,
    });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < maxPrice || 
    filters.rating !== null || 
    filters.inStock;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="font-semibold mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer group">
              <Checkbox
                checked={filters.categories.includes(category.slug)}
                onCheckedChange={(checked) => handleCategoryChange(category.slug, checked as boolean)}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {category.name}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">({category.productCount})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold mb-3">Price Range</h4>
        <Slider
          min={0}
          max={maxPrice}
          step={50}
          value={filters.priceRange}
          onValueChange={handlePriceChange}
          className="mb-2"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatCurrency(filters.priceRange[0])}</span>
          <span>{formatCurrency(filters.priceRange[1])}</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-semibold mb-3">Minimum Rating</h4>
        <div className="flex gap-2">
          {[4, 3, 2].map(rating => (
            <Button
              key={rating}
              variant={filters.rating === rating ? 'accent' : 'outline'}
              size="sm"
              onClick={() => handleRatingChange(filters.rating === rating ? null : rating)}
            >
              {rating}+ ★
            </Button>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          checked={filters.inStock}
          onCheckedChange={(checked) => handleInStockChange(checked as boolean)}
        />
        <span className="text-sm">In Stock Only</span>
      </label>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="ghost" className="w-full" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setIsOpen(true)}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </span>
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
              {filters.categories.length + (filters.rating ? 1 : 0) + (filters.inStock ? 1 : 0)}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Filter Drawer */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden transition-all duration-300",
        isOpen ? "visible" : "invisible pointer-events-none"
      )}>
        <div 
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsOpen(false)}
        />
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-80 bg-card border-r border-border p-6 transition-transform",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Filters</h3>
            <Button variant="ghost" size="icon-sm" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 space-y-6 p-4 rounded-2xl bg-card border border-border/50">
          <h3 className="font-semibold">Filters</h3>
          <FilterContent />
        </div>
      </aside>
    </>
  );
}
