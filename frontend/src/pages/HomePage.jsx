import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Zap, TrendingUp, Sparkles, Crown, Gift } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CountdownTimer from '../components/CountdownTimer';
import SkeletonCard from '../components/SkeletonCard';
import products from '../data/products.json';
import categoriesData from '../data/categories.json';

const heroSlides = [
  {
    title: 'Summer Collection 2026',
    subtitle: 'Discover the hottest trends of the season',
    cta: 'Shop Now',
    gradient: 'from-pink via-purple to-orange',
    bgColor: 'bg-gradient-to-br from-pink-dark via-purple to-orange',
  },
  {
    title: 'Up to 60% Off',
    subtitle: 'Mega fashion sale is live. Don\'t miss out!',
    cta: 'Grab Deals',
    gradient: 'from-purple via-pink to-orange',
    bgColor: 'bg-gradient-to-br from-purple-dark via-pink to-orange',
  },
  {
    title: 'New Arrivals Daily',
    subtitle: 'Fresh styles added every day, curated just for you',
    cta: 'Explore',
    gradient: 'from-orange via-pink to-purple',
    bgColor: 'bg-gradient-to-br from-orange via-pink-dark to-purple',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const saleEndDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const trending = products.filter((p) => p.tags.includes('trending'));
  const bestsellers = products.filter((p) => p.tags.includes('bestseller'));
  const newArrivals = products.filter((p) => p.tags.includes('new'));
  const flashSale = products.slice(0, 4);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  const SectionHeader = ({ icon: Icon, title, subtitle, link }) => (
    <div className="flex items-end justify-between mb-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          {Icon && <Icon size={22} className="text-pink" />}
          <h2 className="font-heading text-2xl lg:text-3xl font-bold">{title}</h2>
        </div>
        {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
      </div>
      {link && (
        <Link to={link} className="text-pink text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
          View All <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <section className="relative overflow-hidden">
        <div className="relative h-[420px] sm:h-[480px] lg:h-[540px]">
          {heroSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-all duration-700 ease-in-out flex items-center ${
                idx === currentSlide ? 'opacity-100 translate-x-0' : idx < currentSlide ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'
              }`}
              style={{
                background: `linear-gradient(135deg, #C2185B 0%, #7C3AED 50%, #FF5722 100%)`,
                backgroundPosition: `${idx * 30}% center`,
              }}
            >
              <div className="max-w-[1400px] mx-auto px-4 lg:px-6 w-full">
                <motion.div
                  key={`slide-${currentSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: idx === currentSlide ? 1 : 0, y: idx === currentSlide ? 0 : 20 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-xl"
                >
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-4 backdrop-blur-sm">
                    ✨ LIMITED TIME OFFER
                  </span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-white/80 text-lg mb-8">{slide.subtitle}</p>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-neutral-900 rounded-full font-bold text-sm hover:shadow-glow-pink hover:scale-105 transition-all"
                  >
                    {slide.cta} <ArrowRight size={18} />
                  </Link>
                </motion.div>
              </div>
            </div>
          ))}
        </div>

        {/* Nav arrows */}
        <button
          onClick={() => setCurrentSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/40 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setCurrentSlide((p) => (p + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/40 transition-colors"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`carousel-dot ${idx === currentSlide ? 'active' : ''}`}
            />
          ))}
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        {/* Categories Grid */}
        <motion.section
          className="py-12 lg:py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <SectionHeader icon={Sparkles} title="Shop by Category" subtitle="Find exactly what you're looking for" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoriesData.map((cat, i) => (
              <motion.div key={cat.id} custom={i} variants={fadeUp}>
                <Link to={`/shop?category=${cat.name}`} className="category-card block aspect-[3/4] relative group">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 z-10">
                    <h3 className="text-white font-heading font-bold text-lg">{cat.name}</h3>
                    <p className="text-white/70 text-xs mt-0.5">{cat.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Trending Now */}
        <motion.section className="py-12" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}>
          <SectionHeader icon={TrendingUp} title="Trending Now" subtitle="What everyone's loving right now" link="/shop" />
          <div className="relative">
            <div ref={scrollRef} className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory">
              {loading
                ? Array(5).fill(0).map((_, i) => <div key={i} className="min-w-[220px] snap-start"><SkeletonCard /></div>)
                : trending.map((p, i) => (
                    <div key={p.id} className="min-w-[220px] snap-start">
                      <ProductCard product={p} index={i} />
                    </div>
                  ))
              }
            </div>
            <button onClick={() => scroll(-1)} className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background shadow-lg border border-border-light items-center justify-center hover:bg-surface-hover transition-colors z-10">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll(1)} className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background shadow-lg border border-border-light items-center justify-center hover:bg-surface-hover transition-colors z-10">
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.section>

        {/* Flash Sale */}
        <motion.section
          className="py-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <div className="rounded-2xl bg-neutral-950 text-white p-6 lg:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={22} className="text-warning" />
                  <h2 className="font-heading text-2xl lg:text-3xl font-bold">Flash Sale</h2>
                </div>
                <p className="text-neutral-400 text-sm">Hurry up! Deals end in:</p>
              </div>
              <CountdownTimer targetDate={saleEndDate} />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {flashSale.map((p, i) => (
                <motion.div key={p.id} custom={i} variants={fadeUp}>
                  <ProductCard product={p} index={i} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Best Sellers */}
        <motion.section className="py-12" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}>
          <SectionHeader icon={Crown} title="Best Sellers" subtitle="Top-rated products loved by thousands" link="/shop" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loading
              ? Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : bestsellers.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
            }
          </div>
        </motion.section>

        {/* Promo Banner */}
        <motion.section
          className="py-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="rounded-2xl overflow-hidden relative h-[200px] sm:h-[260px] flex items-center"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #E91E63 50%, #FF5722 100%)' }}
          >
            <div className="px-6 lg:px-12 relative z-10">
              <h2 className="text-white font-heading text-3xl lg:text-4xl font-black mb-2">Seasonal Collection</h2>
              <p className="text-white/80 mb-6 max-w-md">Handpicked styles for the season. Premium quality at unbeatable prices.</p>
              <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 rounded-full font-bold text-sm hover:shadow-lg transition-all">
                Explore Now <ArrowRight size={16} />
              </Link>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==')]" />
            </div>
          </div>
        </motion.section>

        {/* New Arrivals */}
        <motion.section className="py-12" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}>
          <SectionHeader icon={Gift} title="New Arrivals" subtitle="Just dropped — fresh styles you'll love" link="/shop" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loading
              ? Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : newArrivals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
            }
          </div>
        </motion.section>

        {/* Top Brands */}
        <motion.section
          className="py-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader title="Top Brands" subtitle="Shop from your favorite brands" />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {['ThreadCraft', 'Aurelia', 'UrbanStride', 'StreetVibe', 'GlowUp', 'OpticLux'].map((brand) => (
              <Link
                key={brand}
                to={`/shop?search=${brand}`}
                className="flex items-center justify-center py-6 px-4 rounded-xl border border-border-light hover:border-pink hover:shadow-lg transition-all group"
              >
                <span className="font-heading font-bold text-lg text-muted group-hover:text-pink transition-colors">{brand}</span>
              </Link>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
