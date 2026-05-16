import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product, index = 0 }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const wishlisted = isWishlisted(product.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️', wishlisted ? 'info' : 'success');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes?.[0] || null);
    addToast(`${product.title} added to cart!`, 'success');
  };

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(product.rating));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/product/${product.id}`} className="product-card block group">
        {/* Image */}
        <div className="product-image aspect-[3/4] bg-surface relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Discount badge */}
          {product.discount > 0 && (
            <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold text-white gradient-bg">
              -{product.discount}%
            </span>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={`wishlist-btn absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${
              wishlisted ? 'bg-pink text-white active' : 'bg-white/90 text-neutral-600 hover:text-pink'
            }`}
            aria-label="Toggle wishlist"
          >
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Quick add to cart */}
          <div className="quick-actions">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-foreground/90 text-background text-sm font-semibold flex items-center justify-center gap-2 hover:bg-pink transition-colors"
            >
              <ShoppingBag size={15} />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">{product.brand}</p>
          <h3 className="text-sm font-medium line-clamp-1 mb-1.5 group-hover:text-pink transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {stars.map((filled, i) => (
                <Star key={i} size={12} className={filled ? 'star-filled' : 'star-empty'} fill={filled ? 'currentColor' : 'none'} />
              ))}
            </div>
            <span className="text-xs text-muted">({product.reviews?.toLocaleString()})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-base font-bold">₹{product.price?.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xs price-original">₹{product.originalPrice?.toLocaleString()}</span>
                <span className="text-xs price-discount">({product.discount}% off)</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
