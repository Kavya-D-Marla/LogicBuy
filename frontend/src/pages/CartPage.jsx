import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, Tag, ArrowRight, Trash2, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { greedyOfferOptimizer } from '../utils/algorithms';

const mockOffers = [
  { code: 'SAVE10', type: 'percent', value: 10, minPurchase: 500, maxDiscount: 200, desc: '10% off on ₹500+' },
  { code: 'FIRST50', type: 'percent', value: 50, minPurchase: 2000, maxDiscount: 1000, desc: '50% off on ₹2000+' },
  { code: 'FLAT500', type: 'flat', value: 500, minPurchase: 3000, maxDiscount: 500, desc: 'Flat ₹500 off on ₹3000+' },
  { code: 'LOGIC20', type: 'percent', value: 20, minPurchase: 1000, maxDiscount: 400, desc: '20% off on ₹1000+' }
];

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, applyCoupon, coupon, subtotal, couponDiscount, total, cartCount } = useCart();
  const { addToast } = useToast();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = () => {
    if (applyCoupon(couponCode)) {
      addToast(`Coupon "${couponCode.toUpperCase()}" applied!`, 'success');
      setCouponCode('');
    } else {
      addToast('Invalid coupon code', 'error');
    }
  };

  const handleSmartOffers = () => {
    const { bestOffer, maxDiscount } = greedyOfferOptimizer(subtotal, mockOffers);
    if (bestOffer) {
      applyCoupon(bestOffer.code);
      addToast(`Smart Offer Applied: ${bestOffer.code} (Saved ₹${Math.round(maxDiscount)})`, 'success');
    } else {
      addToast('No applicable offers found for your cart amount', 'info');
    }
  };

  const delivery = subtotal >= 999 ? 0 : 99;

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-7xl mb-6">🛒</p>
          <h2 className="font-heading text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3 rounded-full gradient-bg text-white font-bold text-sm hover:opacity-90 transition-opacity">
            <ShoppingBag size={18} /> Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl lg:text-3xl font-bold">Shopping Cart ({cartCount})</h1>
        <button onClick={() => { clearCart(); addToast('Cart cleared', 'info'); }} className="text-sm text-error font-medium flex items-center gap-1 hover:underline">
          <Trash2 size={14} /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={`${item.id}-${item.selectedSize}-${index}`}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-4 p-4 rounded-xl border border-border-light hover:shadow-md transition-shadow"
              >
                <Link to={`/product/${item.id}`} className="w-24 h-28 rounded-lg overflow-hidden shrink-0 bg-surface">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted font-medium uppercase">{item.brand}</p>
                      <h3 className="font-medium text-sm line-clamp-1">{item.title}</h3>
                      {item.selectedSize && <p className="text-xs text-muted mt-0.5">Size: {item.selectedSize}</p>}
                    </div>
                    <button onClick={() => { removeFromCart(index); addToast('Removed from cart', 'info'); }} className="text-muted hover:text-error transition-colors shrink-0">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="flex items-end justify-between mt-3">
                    <div className="flex items-center gap-2 border border-border rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(index, item.quantity - 1)} className="px-2 py-1 hover:bg-surface-hover transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(index, item.quantity + 1)} className="px-2 py-1 hover:bg-surface-hover transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                      {item.originalPrice > item.price && (
                        <p className="text-xs price-original">₹{(item.originalPrice * item.quantity).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 rounded-xl border border-border-light p-6 space-y-4">
            <h3 className="font-heading font-bold text-lg">Order Summary</h3>

            {/* Available Offers */}
            <div className="space-y-2 mb-4">
              <h4 className="font-bold text-sm text-muted-foreground flex items-center gap-1.5">
                <Tag size={14} /> Available Offers
              </h4>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                {mockOffers.map((offer) => (
                  <div key={offer.code} className="p-3 border border-border-light rounded-lg bg-surface text-sm flex justify-between items-center group hover:border-pink/50 transition-colors">
                    <div>
                      <span className="font-bold text-pink block mb-0.5">{offer.code}</span>
                      <span className="text-xs text-muted-foreground">{offer.desc}</span>
                    </div>
                    <button 
                      onClick={() => applyCoupon(offer.code)} 
                      className="text-xs font-bold text-pink opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-pink/10 rounded"
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Offers (Greedy Algorithm) */}
            <div className="p-4 rounded-xl bg-pink/5 border border-pink/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm flex items-center gap-1.5 text-pink">
                  <Zap size={16} fill="currentColor" /> Smart Offers
                </h4>
                <span className="text-[10px] uppercase tracking-wider font-bold text-pink/70">Greedy Algorithm</span>
              </div>
              <p className="text-xs text-muted-foreground">Let our algorithm find the best combination of offers to maximize your savings.</p>
              <button 
                onClick={handleSmartOffers}
                className="w-full py-2 bg-pink text-white text-sm font-bold rounded-lg hover:bg-pink-dark transition-colors"
              >
                Auto-Apply Best Offer
              </button>
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border-light"></div>
              <span className="flex-shrink-0 mx-4 text-xs text-muted">OR ENTER CODE</span>
              <div className="flex-grow border-t border-border-light"></div>
            </div>

            {/* Coupon */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-pink"
                />
              </div>
              <button onClick={handleApplyCoupon} className="px-4 py-2.5 rounded-lg border-2 border-pink text-pink text-sm font-bold hover:bg-pink hover:text-white transition-colors">
                Apply
              </button>
            </div>
            {coupon && <p className="text-xs text-success font-medium">✓ Coupon {coupon.code} applied — {coupon.discount}% off</p>}

            <div className="space-y-3 pt-4 border-t border-border-light">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-success">Coupon Discount</span>
                  <span className="text-success">-₹{couponDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className={delivery === 0 ? 'text-success font-medium' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-border-light">
                <span>Total</span>
                <span>₹{(total + delivery).toLocaleString()}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-bg text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </Link>

            <p className="text-xs text-muted text-center">Free delivery on orders above ₹999</p>
          </div>
        </div>
      </div>
    </div>
  );
}
