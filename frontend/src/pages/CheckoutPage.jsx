import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CreditCard, CheckCircle, ArrowRight, ArrowLeft, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const steps = [
  { id: 1, label: 'Address', icon: MapPin },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Confirmation', icon: CheckCircle },
];

export default function CheckoutPage() {
  const { items, subtotal, couponDiscount, total, clearCart } = useCart();
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: '', phone: '', street: '', city: '', state: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const delivery = subtotal >= 999 ? 0 : 99;

  const handlePlaceOrder = () => {
    setStep(3);
    clearCart();
    addToast('Order placed successfully! 🎉', 'success');
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="font-heading text-2xl font-bold mb-2">No items to checkout</h2>
        <Link to="/shop" className="text-pink font-medium">← Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= s.id ? 'text-pink' : 'text-muted'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step > s.id ? 'gradient-bg text-white' : step === s.id ? 'border-2 border-pink text-pink' : 'border-2 border-border text-muted'
              }`}>
                {step > s.id ? <CheckCircle size={18} /> : s.id}
              </div>
              <span className="hidden sm:block text-sm font-medium">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className={`w-12 sm:w-20 h-0.5 ${step > s.id ? 'bg-pink' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="font-heading text-xl font-bold mb-6">Delivery Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Full Name', type: 'text' },
                { key: 'phone', label: 'Phone Number', type: 'tel' },
                { key: 'street', label: 'Street Address', type: 'text', full: true },
                { key: 'city', label: 'City', type: 'text' },
                { key: 'state', label: 'State', type: 'text' },
                { key: 'pincode', label: 'PIN Code', type: 'text' },
              ].map((field) => (
                <div key={field.key} className={field.full ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    value={address[field.key]}
                    onChange={(e) => setAddress((p) => ({ ...p, [field.key]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-pink"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-8">
              <button onClick={() => setStep(2)} className="flex items-center gap-2 px-8 py-3 rounded-xl gradient-bg text-white font-bold text-sm">
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="font-heading text-xl font-bold mb-6">Payment Method</h2>
            <div className="space-y-3 mb-8">
              {[
                { value: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                { value: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm' },
                { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive' },
              ].map((method) => (
                <button
                  key={method.value}
                  onClick={() => setPaymentMethod(method.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-colors ${
                    paymentMethod === method.value ? 'border-pink bg-pink/5' : 'border-border hover:border-pink/50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === method.value ? 'border-pink' : 'border-border'
                  }`}>
                    {paymentMethod === method.value && <div className="w-2.5 h-2.5 rounded-full bg-pink" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{method.label}</p>
                    <p className="text-xs text-muted">{method.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Order Summary */}
            <div className="rounded-xl border border-border-light p-5 space-y-3 mb-8">
              <h3 className="font-bold text-sm">Order Summary</h3>
              <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              {couponDiscount > 0 && <div className="flex justify-between text-sm text-success"><span>Discount</span><span>-₹{couponDiscount.toLocaleString()}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-muted">Delivery</span><span>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
              <div className="flex justify-between font-bold pt-2 border-t border-border-light"><span>Total</span><span>₹{(total + delivery).toLocaleString()}</span></div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-surface-hover transition-colors">
                <ArrowLeft size={16} /> Back
              </button>
              <button onClick={handlePlaceOrder} className="flex items-center gap-2 px-8 py-3 rounded-xl gradient-bg text-white font-bold text-sm hover:opacity-90 transition-opacity">
                Place Order <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
              className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle size={40} className="text-white" />
            </motion.div>
            <h2 className="font-heading text-3xl font-bold mb-2">Order Placed! 🎉</h2>
            <p className="text-muted-foreground mb-2">Thank you for shopping with LogicBuy</p>
            <p className="text-sm text-muted mb-8">Order ID: #LB{Date.now().toString().slice(-8)}</p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/" className="px-6 py-3 rounded-xl border border-border font-medium text-sm hover:bg-surface-hover transition-colors">
                Back to Home
              </Link>
              <Link to="/shop" className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg text-white font-bold text-sm">
                <Package size={16} /> Continue Shopping
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
