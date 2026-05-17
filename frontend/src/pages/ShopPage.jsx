import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Grid3X3, List, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import SkeletonCard from '../components/SkeletonCard';
import products from '../data/products.json';
import { quickSort, mergeSort, heapSort } from '../utils/algorithms';

const sortOptions = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Rating', value: 'rating' },
  { label: 'Newest', value: 'newest' },
  { label: 'Discount', value: 'discount' },
];

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const [filters, setFilters] = useState({
    categories: categoryParam ? [categoryParam] : [],
    brands: [],
    sizes: [],
    priceRange: [0, 10000],
    rating: 0,
    discount: 0,
  });
  const [sortBy, setSortBy] = useState('recommended');
  const [gridView, setGridView] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeAlgorithm, setActiveAlgorithm] = useState('');

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchParam) {
      const q = searchParam.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }
    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }
    if (filters.sizes.length > 0) {
      result = result.filter((p) => p.sizes?.some((s) => filters.sizes.includes(s)));
    }
    if (filters.priceRange[1] < 10000) {
      result = result.filter((p) => p.price <= filters.priceRange[1]);
    }
    if (filters.rating > 0) {
      result = result.filter((p) => p.rating >= filters.rating);
    }
    if (filters.discount > 0) {
      result = result.filter((p) => p.discount >= filters.discount);
    }

    let sortedResult = result;
    switch (sortBy) {
      case 'price-asc': 
        sortedResult = quickSort(result, 'price', true); 
        setActiveAlgorithm('⚡ Quick Sort (O(N log N))');
        break;
      case 'price-desc': 
        sortedResult = quickSort(result, 'price', false); 
        setActiveAlgorithm('⚡ Quick Sort (O(N log N))');
        break;
      case 'rating': 
        sortedResult = mergeSort(result, 'rating', false); 
        setActiveAlgorithm('🧬 Merge Sort (O(N log N))');
        break;
      case 'discount': 
        sortedResult = heapSort(result, 'discount', false); 
        setActiveAlgorithm('⛰️ Heap Sort (O(N log N))');
        break;
      case 'newest': 
        sortedResult.sort((a, b) => b.id - a.id); 
        setActiveAlgorithm('');
        break;
      default: 
        setActiveAlgorithm('');
        break;
    }

    return sortedResult;
  }, [filters, sortBy, searchParam]);

  return (
    <div className="myntra-container py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold">
            {searchParam ? `Results for "${searchParam}"` : categoryParam ? categoryParam : 'All Products'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} products found</p>
        </div>
        {activeAlgorithm && (
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-pink/10 text-pink text-xs font-bold border border-pink/20">
            {activeAlgorithm}
          </div>
        )}
      </div>

      <div className="flex gap-6">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
        />

        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-3">
            <button
              onClick={() => setFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-surface-hover transition-colors"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>

            <div className="flex items-center gap-3 ml-auto">
              <div className="hidden sm:flex items-center gap-1 border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setGridView(true)}
                  className={`p-2 transition-colors ${gridView ? 'bg-foreground text-background' : 'hover:bg-surface-hover'}`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setGridView(false)}
                  className={`p-2 transition-colors ${!gridView ? 'bg-foreground text-background' : 'hover:bg-surface-hover'}`}
                >
                  <List size={16} />
                </button>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-border bg-background text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted" />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filtered.length > 0 ? (
            <div className={gridView
              ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'flex flex-col gap-4'
            }>
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="font-heading text-xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your filters or search terms</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
