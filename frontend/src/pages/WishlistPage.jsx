import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleMoveToCart = (product) => {
    addToCart(product, product.sizes?.[0] || null);
    removeFromWishlist(product.id);
    addToast(`${product.title} moved to cart!`, 'success');
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-7xl mb-6">💝</p>
          <h2 className="font-heading text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8">Save items you love for later</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3 rounded-full gradient-bg text-white font-bold text-sm">
            <Heart size={18} /> Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6">
      <h1 className="font-heading text-2xl lg:text-3xl font-bold mb-8">My Wishlist ({wishlist.length})</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <AnimatePresence>
          {wishlist.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="product-card"
            >
              <Link to={`/product/${product.id}`} className="block">
                <div className="product-image aspect-[3/4] bg-surface">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                  {product.discount > 0 && (
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold text-white gradient-bg">
                      -{product.discount}%
                    </span>
                  )}
                </div>
              </Link>
              <div className="p-3">
                <p className="text-xs text-muted font-medium uppercase">{product.brand}</p>
                <h3 className="text-sm font-medium line-clamp-1 mt-0.5">{product.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold">₹{product.price?.toLocaleString()}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs price-original">₹{product.originalPrice?.toLocaleString()}</span>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg gradient-bg text-white text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    <ShoppingBag size={14} /> Move to Cart
                  </button>
                  <button
                    onClick={() => { removeFromWishlist(product.id); addToast('Removed from wishlist', 'info'); }}
                    className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:border-error hover:text-error transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
