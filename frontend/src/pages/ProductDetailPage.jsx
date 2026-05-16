import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Truck, RotateCcw, Shield, ChevronRight, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import products from '../data/products.json';
import { dpRecommendations } from '../utils/algorithms';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [zoomPos, setZoomPos] = useState({ x: '50%', y: '50%' });

  if (!product) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="font-heading text-2xl font-bold mb-2">Product not found</h2>
        <Link to="/shop" className="text-pink font-medium">← Back to shop</Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const allImages = product.images || [product.image];
  // Using Dynamic Programming for personalized recommendations
  const related = dpRecommendations(product, products).slice(0, 4);
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(product.rating));

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      addToast('Please select a size', 'error');
      return;
    }
    for (let i = 0; i < quantity; i++) addToCart(product, selectedSize);
    addToast(`${product.title} added to cart!`, 'success');
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: `${x}%`, y: `${y}%` });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted mb-6">
        <Link to="/" className="hover:text-pink">Home</Link>
        <ChevronRight size={14} />
        <Link to="/shop" className="hover:text-pink">Shop</Link>
        <ChevronRight size={14} />
        <Link to={`/shop?category=${product.category}`} className="hover:text-pink">{product.category}</Link>
        <ChevronRight size={14} />
        <span className="text-foreground font-medium line-clamp-1">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div
            className="zoom-container aspect-square rounded-2xl bg-surface overflow-hidden mb-4"
            onMouseMove={handleMouseMove}
            style={{ '--zoom-x': zoomPos.x, '--zoom-y': zoomPos.y }}
          >
            <img src={allImages[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-3">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? 'border-pink' : 'border-border-light hover:border-border'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <p className="text-sm font-semibold text-muted uppercase tracking-wider mb-1">{product.brand}</p>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold mb-3">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-success/10">
              <span className="text-sm font-bold text-success">{product.rating}</span>
              <Star size={14} className="text-success" fill="currentColor" />
            </div>
            <span className="text-sm text-muted">{product.reviews?.toLocaleString()} reviews</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-border-light">
            <span className="text-3xl font-bold">₹{product.price?.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-lg price-original">₹{product.originalPrice?.toLocaleString()}</span>
                <span className="text-sm price-discount font-bold">({product.discount}% off)</span>
              </>
            )}
          </div>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold mb-3">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-xl border-2 text-sm font-semibold transition-all ${
                      selectedSize === size
                        ? 'border-pink bg-pink text-white'
                        : 'border-border hover:border-pink'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold mb-3">Available Colors</p>
              <div className="flex gap-2">
                {product.colors.map((color, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-border" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-semibold mb-3">Quantity</p>
            <div className="flex items-center gap-3 w-fit border border-border rounded-xl overflow-hidden">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-surface-hover transition-colors">
                <Minus size={16} />
              </button>
              <span className="text-sm font-bold w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-2 hover:bg-surface-hover transition-colors">
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-bg text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <ShoppingBag size={18} /> Add to Cart
            </button>
            <button
              onClick={() => { toggleWishlist(product); addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️', wishlisted ? 'info' : 'success'); }}
              className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${
                wishlisted ? 'border-pink bg-pink/10 text-pink' : 'border-border hover:border-pink'
              }`}
            >
              <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Delivery info */}
          <div className="space-y-3 p-4 rounded-xl bg-surface">
            <div className="flex items-center gap-3 text-sm">
              <Truck size={18} className="text-pink shrink-0" />
              <div><span className="font-medium">Free Delivery</span> <span className="text-muted">on orders above ₹999</span></div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RotateCcw size={18} className="text-pink shrink-0" />
              <div><span className="font-medium">Easy Returns</span> <span className="text-muted">30 day return policy</span></div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield size={18} className="text-pink shrink-0" />
              <div><span className="font-medium">100% Authentic</span> <span className="text-muted">Guaranteed genuine products</span></div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h3 className="font-heading font-bold text-lg mb-3">Product Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        </motion.div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16 pt-8 border-t border-border-light">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold">You May Also Like</h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink/10 text-pink text-xs font-bold border border-pink/20 uppercase tracking-wider">
              <span>🧠 DP-Powered Recommendations</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
