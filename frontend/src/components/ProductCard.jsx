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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Link to={`/product/${product.id}`} className="product-card block group">
        {/* Image */}
        <div className="product-image aspect-[3/4] bg-neutral-100 relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={`wishlist-btn absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${
              wishlisted ? 'bg-pink text-white active' : 'bg-white text-neutral-500 hover:text-pink'
            }`}
            aria-label="Toggle wishlist"
          >
            <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Rating badge */}
          {product.rating >= 4 && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-sm text-xs font-bold shadow-sm">
              <span className="text-neutral-800">{product.rating}</span>
              <Star size={10} className="text-amber-400" fill="currentColor" />
              <span className="text-neutral-400 font-normal">| {product.reviews?.toLocaleString()}</span>
            </div>
          )}

          {/* Quick add to cart */}
          <div className="quick-actions">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-white/95 backdrop-blur text-neutral-900 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-pink hover:text-white transition-colors uppercase tracking-wider border-t border-neutral-200"
            >
              <ShoppingBag size={13} />
              Add to Bag
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 pt-3">
          <h4 className="text-[13px] font-bold text-neutral-900 mb-1 line-clamp-1 uppercase tracking-wide">
            {product.brand}
          </h4>
          <p className="text-sm text-neutral-500 line-clamp-1 mb-2 font-normal leading-snug">
            {product.title}
          </p>

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <span className="text-sm font-bold text-neutral-900 tracking-tight">
              Rs. {product.price?.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xs text-neutral-400 line-through">
                  Rs. {product.originalPrice?.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-pink tracking-wide">
                  ({product.discount}% OFF)
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
