import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { CartItem, Product } from '@/types';
import { useAdmin } from '@/context/AdminContext';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD'; productId: string; quantity?: number }
  | { type: 'REMOVE'; productId: string }
  | { type: 'UPDATE_QTY'; productId: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'INIT'; items: CartItem[] };

const STORAGE_KEY = 'avita_cart';

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'INIT':
      return { items: action.items };
    case 'ADD': {
      const existing = state.items.find((i) => i.productId === action.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === action.productId
              ? { ...i, quantity: i.quantity + (action.quantity ?? 1) }
              : i
          ),
        };
      }
      return { items: [...state.items, { productId: action.productId, quantity: action.quantity ?? 1 }] };
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.productId !== action.productId) };
    case 'UPDATE_QTY':
      if (action.quantity < 1) return { items: state.items.filter((i) => i.productId !== action.productId) };
      return {
        items: state.items.map((i) =>
          i.productId === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  detailedItems: { product: Product; quantity: number }[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useAdmin();
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: 'INIT', items: JSON.parse(saved) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      /* ignore */
    }
  }, [state.items, products]);

  const value = useMemo<CartContextValue>(() => {
    const detailedItems = state.items
      .map((item) => {
        const product = products.find((candidate) => candidate.id === item.productId);
        return product ? { product, quantity: item.quantity } : null;
      })
      .filter((x): x is { product: Product; quantity: number } => x !== null);

    const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = detailedItems.reduce((sum, i) => sum + (i.product.discountPrice ?? i.product.price) * i.quantity, 0);
    const originalTotal = detailedItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const discount = originalTotal - subtotal;
    const shipping = subtotal > 5000000 || subtotal === 0 ? 0 : 150000;
    const total = subtotal + shipping;

    return {
      items: state.items,
      detailedItems,
      itemCount,
      subtotal,
      discount,
      shipping,
      total,
      addToCart: (productId, quantity = 1) => dispatch({ type: 'ADD', productId, quantity }),
      removeFromCart: (productId) => dispatch({ type: 'REMOVE', productId }),
      updateQuantity: (productId, quantity) => dispatch({ type: 'UPDATE_QTY', productId, quantity }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    };
  }, [state.items, products]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
