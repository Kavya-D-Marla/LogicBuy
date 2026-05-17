import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, Menu, X, Sun, Moon, ChevronDown, Sparkles } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Offer Strip */}
      <div className="offer-strip text-white text-center py-2 text-xs font-medium tracking-wide" id="offer-strip">
        <span>✨ MEGA SALE LIVE — Up to 60% OFF + Extra 10% with code <strong className="font-bold">LOGIC20</strong></span>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 left-0 right-0 z-50 bg-background transition-shadow duration-300 border-b border-border ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
        id="main-navbar"
      >
        <div className="myntra-container">
          <div className="flex items-center h-[56px]">
            {/* Left: Mobile menu + Logo */}
            <div className="flex items-center gap-6" style={{ marginRight: '32px' }}>
              <button
                className="lg:hidden p-1.5 rounded-md hover:bg-surface-hover transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
              <Link to="/" className="flex items-center gap-1.5 shrink-0">
                <div className="w-7 h-7 rounded gradient-bg flex items-center justify-center">
                  <span className="text-white font-heading font-bold text-xs">L</span>
                </div>
                <span className="font-heading font-bold text-lg tracking-tight text-foreground">
                  Logic<span className="text-pink">Buy</span>
                </span>
              </Link>
            </div>

            {/* Center: Category Nav (Desktop) */}
            <div className="hidden lg:flex items-center gap-0 flex-1">
              {categories.map((cat) => (
                <div
                  key={cat.slug}
                  className="relative h-full"
                  onMouseEnter={() => setActiveCategory(cat.slug)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <Link
                    to={`/shop?category=${cat.name}`}
                    className="nav-link flex items-center gap-1 px-4 h-[56px] leading-[56px] text-foreground font-medium"
                  >
                    {cat.name}
                  </Link>
                  <AnimatePresence>
                    {activeCategory === cat.slug && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 w-52 bg-surface rounded-b-lg shadow-xl border border-border p-1.5 z-50"
                        style={{ borderTop: '2px solid #ff3f6c' }}
                      >
                        {cat.subcats.map((sub) => (
                          <Link
                            key={sub}
                            to={`/shop?category=${cat.name}&sub=${sub}`}
                            className="block px-4 py-2.5 text-sm text-foreground font-medium hover:bg-surface-hover hover:text-pink transition-colors rounded"
                          >
                            {sub}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Smart Assistant Link */}
              <Link
                to="/smart-assistant"
                className="nav-link flex items-center gap-1.5 px-4 h-[56px] leading-[56px]"
                style={{ color: '#ff3f6c', borderBottomColor: 'transparent' }}
              >
                <Sparkles size={14} className="text-pink" />
                <span className="text-xs font-bold uppercase tracking-wider">Smart AI</span>
              </Link>
            </div>

            {/* Right: Search + Icons */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Search bar (Desktop) */}
              <div className="hidden md:block relative">
                <form onSubmit={handleSearch}>
                  <div className="flex items-center bg-surface-hover rounded-sm px-3.5 py-2 w-[280px] focus-within:ring-1 focus-within:ring-pink/30 focus-within:border focus-within:border-pink/30 transition-all"
                    style={{ border: '1px solid transparent' }}
                  >
                    <Search size={16} className="text-muted-foreground mr-2 shrink-0" />
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search for products, brands and more"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </form>
                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-surface rounded-lg shadow-xl border border-border overflow-hidden z-50"
                    >
                      {suggestions.map((p) => (
                        <Link
                          key={p.id}
                          to={`/product/${p.id}`}
                          onClick={() => setSearchQuery('')}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-hover transition-colors"
                        >
                          <img src={p.image} alt={p.title} className="w-9 h-9 rounded object-cover" />
                          <div>
                            <p className="text-sm font-medium line-clamp-1 text-foreground">{p.title}</p>
                            <p className="text-xs text-muted-foreground">{p.brand} · ₹{p.price}</p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Icon buttons */}
              <div className="flex items-center gap-2 lg:gap-4 ml-4">
                {/* Theme toggle */}
                <button
                  onClick={toggleTheme}
                  className="flex flex-col items-center justify-center px-1 py-1 hover:bg-surface-hover transition-colors rounded text-foreground"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                  <span className="text-[10px] mt-0.5 text-muted-foreground font-medium">Theme</span>
                </button>

                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className="relative flex flex-col items-center justify-center px-1 py-1 hover:bg-surface-hover transition-colors rounded text-foreground"
                >
                  <Heart size={18} />
                  <span className="text-[10px] mt-0.5 text-muted-foreground font-medium">Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="absolute top-0 right-1 w-4 h-4 rounded-full bg-pink text-white text-[9px] font-bold flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative flex flex-col items-center justify-center px-1 py-1 hover:bg-surface-hover transition-colors rounded text-foreground"
                >
                  <ShoppingBag size={18} />
                  <span className="text-[10px] mt-0.5 text-muted-foreground font-medium">Bag</span>
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-1 w-4 h-4 rounded-full bg-pink text-white text-[9px] font-bold flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Profile */}
                <button className="flex flex-col items-center justify-center px-1 py-1 hover:bg-surface-hover transition-colors rounded text-foreground">
                  <User size={18} />
                  <span className="text-[10px] mt-0.5 text-muted-foreground font-medium">Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
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
              className="fixed top-0 left-0 bottom-0 w-[300px] z-[70] bg-white shadow-2xl flex flex-col"
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between p-4 bg-pink text-white">
                <div>
                  <span className="font-heading font-bold text-lg">Logic<span className="text-white/80">Buy</span></span>
                  <p className="text-xs text-white/70 mt-0.5">Premium Fashion</p>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1">
                  <X size={22} />
                </button>
              </div>

              {/* Mobile search */}
              <form onSubmit={handleSearch} className="p-3 border-b border-neutral-100">
                <div className="flex items-center bg-neutral-100 rounded px-3 py-2">
                  <Search size={16} className="text-neutral-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none text-sm w-full text-neutral-800"
                  />
                </div>
              </form>

              {/* Mobile nav items */}
              <div className="flex-1 overflow-y-auto">
                <Link
                  to="/smart-assistant"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-5 py-3.5 text-pink font-bold text-sm border-b border-neutral-100 bg-pink/5"
                >
                  <Sparkles size={16} />
                  Smart AI Assistant
                </Link>
                {categories.map((cat) => (
                  <div key={cat.slug} className="border-b border-neutral-100">
                    <Link
                      to={`/shop?category=${cat.name}`}
                      onClick={() => setMobileOpen(false)}
                      className="block px-5 py-3.5 font-semibold text-sm text-neutral-800 hover:text-pink transition-colors"
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
    </>
  );
}
