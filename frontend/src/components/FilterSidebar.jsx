import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, Star, ChevronDown, ChevronUp } from 'lucide-react';

const brandList = ['ThreadCraft', 'Aurelia', 'UrbanStride', 'StreetVibe', 'DenimCo', 'GlowUp', 'TinyTrend', 'OpticLux'];
const sizeList = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function FilterSidebar({ filters, setFilters, categories, isOpen, onClose }) {
  const [openSections, setOpenSections] = useState({ category: true, brand: true, size: true, price: true, rating: true, discount: true });

  const toggleSection = (key) => setOpenSections((p) => ({ ...p, [key]: !p[key] }));

  const toggleFilter = (key, value) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      return { ...prev, [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] };
    });
  };

  const clearAll = () => setFilters({ brands: [], sizes: [], priceRange: [0, 10000], rating: 0, discount: 0, categories: [] });

  const Section = ({ title, sectionKey, children }) => (
    <div className="border-b border-border-light pb-4">
      <button onClick={() => toggleSection(sectionKey)} className="flex items-center justify-between w-full py-2 text-sm font-semibold">
        {title}
        {openSections[sectionKey] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {openSections[sectionKey] && <div className="mt-2">{children}</div>}
    </div>
  );

  const content = (
    <div className="space-y-4 filter-sidebar">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-lg flex items-center gap-2">
          <SlidersHorizontal size={18} /> Filters
        </h3>
        <button onClick={clearAll} className="text-xs text-pink font-medium hover:underline">Clear All</button>
      </div>

      <Section title="Category" sectionKey="category">
        <div className="space-y-2">
          {(categories || ['Men', 'Women', 'Kids', 'Beauty', 'Footwear', 'Accessories']).map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={(filters.categories || []).includes(cat)}
                onChange={() => toggleFilter('categories', cat)}
                className="w-4 h-4 rounded accent-pink"
              />
              {cat}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Brand" sectionKey="brand">
        <div className="space-y-2">
          {brandList.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={(filters.brands || []).includes(brand)}
                onChange={() => toggleFilter('brands', brand)}
                className="w-4 h-4 rounded accent-pink"
              />
              {brand}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Size" sectionKey="size">
        <div className="flex flex-wrap gap-2">
          {sizeList.map((size) => (
            <button
              key={size}
              onClick={() => toggleFilter('sizes', size)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                (filters.sizes || []).includes(size)
                  ? 'bg-pink text-white border-pink'
                  : 'border-border hover:border-pink'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Price Range" sectionKey="price">
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={filters.priceRange?.[1] || 10000}
            onChange={(e) => setFilters((p) => ({ ...p, priceRange: [0, parseInt(e.target.value)] }))}
            className="w-full accent-pink"
          />
          <div className="flex justify-between text-xs text-muted">
            <span>₹0</span>
            <span className="font-semibold text-foreground">₹{(filters.priceRange?.[1] || 10000).toLocaleString()}</span>
          </div>
        </div>
      </Section>

      <Section title="Customer Rating" sectionKey="rating">
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setFilters((p) => ({ ...p, rating: p.rating === r ? 0 : r }))}
              className={`flex items-center gap-1 text-sm w-full py-1 rounded transition-colors ${filters.rating === r ? 'text-pink font-medium' : ''}`}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={14} className={i < r ? 'star-filled' : 'star-empty'} fill={i < r ? 'currentColor' : 'none'} />
              ))}
              <span className="ml-1">& up</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Discount" sectionKey="discount">
        <div className="space-y-2">
          {[10, 20, 30, 40, 50].map((d) => (
            <button
              key={d}
              onClick={() => setFilters((p) => ({ ...p, discount: p.discount === d ? 0 : d }))}
              className={`text-sm w-full text-left py-1 rounded transition-colors ${filters.discount === d ? 'text-pink font-medium' : ''}`}
            >
              {d}% and above
            </button>
          ))}
        </div>
      </Section>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block w-64 shrink-0 sticky top-28 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
        {content}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[300px] z-[60] bg-background shadow-2xl overflow-y-auto p-4"
            >
              <div className="flex justify-end mb-2">
                <button onClick={onClose}><X size={22} /></button>
              </div>
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
