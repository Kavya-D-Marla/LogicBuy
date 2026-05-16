import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find(
        (item) => item.id === action.payload.id && item.selectedSize === action.payload.selectedSize
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === existing.id && item.selectedSize === existing.selectedSize
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, items: state.items.filter((_, i) => i !== action.payload) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item, i) =>
          i === action.payload.index ? { ...item, quantity: Math.max(1, action.payload.quantity) } : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_COUPON':
      return { ...state, coupon: action.payload };
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], coupon: null });

  const addToCart = (product, selectedSize = null) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, selectedSize } });
  };

  const removeFromCart = (index) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: index });
  };

  const updateQuantity = (index, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { index, quantity } });
  };

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const applyCoupon = (code) => {
    const coupons = { LOGIC20: 20, SAVE10: 10, FIRST50: 50 };
    if (coupons[code.toUpperCase()]) {
      dispatch({ type: 'SET_COUPON', payload: { code: code.toUpperCase(), discount: coupons[code.toUpperCase()] } });
      return true;
    }
    return false;
  };

  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const couponDiscount = state.coupon ? Math.round(subtotal * state.coupon.discount / 100) : 0;
  const total = subtotal - couponDiscount;

  return (
    <CartContext.Provider value={{ ...state, addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon, cartCount, subtotal, couponDiscount, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
