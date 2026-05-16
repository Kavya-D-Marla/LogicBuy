import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Zap } from 'lucide-react';
import products from '../data/products.json';
import { binarySearchPrefix } from '../utils/algorithms';

// Pre-sort products for binary search
const sortedProducts = [...products].sort((a, b) => a.title.localeCompare(b.title));

const trendingSearches = ['Summer Dress', 'White Sneakers', 'Lipstick Set', 'Blazer', 'Sunglasses'];

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) setQuery('');
  }, [isOpen]);

  const results = query.length > 1
    ? binarySearchPrefix(sortedProducts, query, 'title').slice(0, 8)
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border-light">
              <Search size={20} className="text-muted" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for products, brands and more..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-base"
              />
              <button onClick={onClose}><X size={20} className="text-muted" /></button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {results.length > 0 ? (
                <div className="p-2">
                  <div className="px-4 py-2 flex items-center justify-between border-b border-border-light mb-2">
                     <span className="text-xs font-semibold text-muted">Products ({results.length})</span>
                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-pink/10 text-pink border border-pink/20 uppercase tracking-wider">
                       <Zap size={10} /> Binary Search (O(log N))
                     </span>
                  </div>
                  {results.map((p) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors"
                    >
                      <img src={p.image} alt={p.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{p.title}</p>
                        <p className="text-xs text-muted">{p.brand} · {p.category}</p>
                      </div>
                      <span className="text-sm font-bold">₹{p.price.toLocaleString()}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-5">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <TrendingUp size={14} /> Trending Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 rounded-full bg-surface text-sm hover:bg-pink hover:text-white transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
