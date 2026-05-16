import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import products from '../data/products.json';

const categories = [
  { name: 'Men', slug: 'men', subcats: ['Shirts', 'T-Shirts', 'Jeans', 'Blazers'] },
  { name: 'Women', slug: 'women', subcats: ['Dresses', 'Tops', 'Skirts', 'Ethnic'] },
  { name: 'Kids', slug: 'kids', subcats: ['Hoodies', 'Dresses', 'Dungarees'] },
  { name: 'Beauty', slug: 'beauty', subcats: ['Lipstick', 'Skincare', 'Fragrance'] },
  { name: 'Footwear', slug: 'footwear', subcats: ['Sneakers', 'Sports', 'Heels'] },
  { name: 'Accessories', slug: 'accessories', subcats: ['Sunglasses', 'Bags', 'Watches'] },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const suggestions = searchQuery.length > 1
    ? products.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass shadow-lg' : 'bg-background'
        }`}
        id="main-navbar"
      >
        {/* Top bar - promotional */}
        <div className="gradient-bg text-white text-center text-xs py-1.5 font-medium tracking-wide">
          🎉 MEGA SALE LIVE — Up to 60% Off + Extra 10% with code <span className="font-bold">LOGIC20</span>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Mobile menu + Logo */}
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-surface-hover transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                  <span className="text-white font-heading font-bold text-sm">L</span>
                </div>
                <span className="font-heading font-bold text-xl tracking-tight">
                  Logic<span className="gradient-text">Buy</span>
                </span>
              </Link>
            </div>

            {/* Center: Category Nav (Desktop) */}
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/shop" className="text-sm font-medium hover:text-pink transition-colors">Shop</Link>
              <Link to="/smart-assistant" className="text-sm font-bold text-pink flex items-center gap-1 hover:text-pink-dark transition-colors">
                🧠 Smart Assistant
              </Link>
              {categories.map((cat) => (
                <div
                  key={cat.slug}
                  className="relative"
                  onMouseEnter={() => setActiveCategory(cat.slug)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <Link
                    to={`/shop?category=${cat.name}`}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg hover:bg-surface-hover transition-colors"
                  >
                    {cat.name}
                    <ChevronDown size={14} className={`transition-transform ${activeCategory === cat.slug ? 'rotate-180' : ''}`} />
                  </Link>
                  <AnimatePresence>
                    {activeCategory === cat.slug && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-48 bg-background rounded-xl shadow-xl border border-border-light p-2 z-50"
                      >
                        {cat.subcats.map((sub) => (
                          <Link
                            key={sub}
                            to={`/shop?category=${cat.name}&sub=${sub}`}
                            className="block px-3 py-2 text-sm rounded-lg hover:bg-surface-hover transition-colors"
                          >
                            {sub}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right: Search, Icons */}
            <div className="flex items-center gap-1">
              {/* Search bar (Desktop) */}
              <div className="hidden md:block relative">
                <form onSubmit={handleSearch}>
                  <div className="flex items-center bg-surface rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-pink transition-all">
                    <Search size={16} className="text-muted mr-2 shrink-0" />
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search products, brands..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent outline-none text-sm w-full text-foreground placeholder:text-muted"
                    />
                  </div>
                </form>
                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-background rounded-xl shadow-xl border border-border-light overflow-hidden z-50"
                    >
                      {suggestions.map((p) => (
                        <Link
                          key={p.id}
                          to={`/product/${p.id}`}
                          onClick={() => setSearchQuery('')}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-colors"
                        >
                          <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="text-sm font-medium line-clamp-1">{p.title}</p>
                            <p className="text-xs text-muted">{p.brand} · ₹{p.price}</p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile search */}
              <button className="md:hidden p-2 rounded-lg hover:bg-surface-hover transition-colors" onClick={() => setSearchOpen(!searchOpen)}>
                <Search size={20} />
              </button>

              {/* Theme toggle */}
              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-surface-hover transition-colors" aria-label="Toggle theme">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 rounded-lg hover:bg-surface-hover transition-colors">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full gradient-bg text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 rounded-lg hover:bg-surface-hover transition-colors">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full gradient-bg text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <button className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
                <User size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border-light overflow-hidden"
            >
              <form onSubmit={handleSearch} className="p-3">
                <div className="flex items-center bg-surface rounded-full px-4 py-2">
                  <Search size={16} className="text-muted mr-2" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none text-sm w-full text-foreground"
                    autoFocus
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Side Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] mobile-menu-overlay"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] z-[70] bg-background shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border-light">
                <span className="font-heading font-bold text-lg">Logic<span className="gradient-text">Buy</span></span>
                <button onClick={() => setMobileOpen(false)} className="p-1">
                  <X size={22} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                <div className="border-b border-border-light bg-pink/5">
                  <Link
                    to="/smart-assistant"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 font-bold text-pink text-sm flex items-center gap-2"
                  >
                    🧠 Smart Assistant
                  </Link>
                </div>
                {categories.map((cat) => (
                  <div key={cat.slug} className="border-b border-border-light">
                    <Link
                      to={`/shop?category=${cat.name}`}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 font-medium text-sm hover:bg-surface-hover"
                    >
                      {cat.name}
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-[calc(4rem+28px)]" />
    </>
  );
}
