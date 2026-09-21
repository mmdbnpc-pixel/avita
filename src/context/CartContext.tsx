import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { CartItem, Product, ProductColor } from '@/types';
import { useAdmin } from '@/context/AdminContext';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD'; productId: string; quantity?: number; colorId?: string; colorName?: string; colorHex?: string; maxQuantity?: number }
  | { type: 'REMOVE'; productId: string; colorId?: string }
  | { type: 'UPDATE_QTY'; productId: string; quantity: number; colorId?: string; maxQuantity?: number }
  | { type: 'CLEAR' }
  | { type: 'INIT'; items: CartItem[] };

const STORAGE_KEY = 'avita_cart';

const itemMatches = (item: CartItem, productId: string, colorId?: string) =>
  item.productId === productId && (item.colorId ?? '') === (colorId ?? '');

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'INIT':
      return { items: action.items };
    case 'ADD': {
      const existing = state.items.find((item) =>
        itemMatches(item, action.productId, action.colorId)
      );

      if (existing) {
        return {
          items: state.items.map((item) =>
            itemMatches(item, action.productId, action.colorId)
              ? { ...item, quantity: Math.min(item.quantity + (action.quantity ?? 1), action.maxQuantity ?? Number.MAX_SAFE_INTEGER) }
              : item
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            productId: action.productId,
            quantity: Math.min(action.quantity ?? 1, action.maxQuantity ?? Number.MAX_SAFE_INTEGER),
            colorId: action.colorId,
            colorName: action.colorName,
            colorHex: action.colorHex,
          },
        ],
      };
    }
    case 'REMOVE':
      return {
        items: state.items.filter(
          (item) => !itemMatches(item, action.productId, action.colorId)
        ),
      };
    case 'UPDATE_QTY':
      if (action.quantity < 1) {
        return {
          items: state.items.filter(
            (item) => !itemMatches(item, action.productId, action.colorId)
          ),
        };
      }
      return {
        items: state.items.map((item) =>
          itemMatches(item, action.productId, action.colorId)
            ? { ...item, quantity: Math.min(action.quantity, action.maxQuantity ?? Number.MAX_SAFE_INTEGER) }
            : item
        ),
      };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

interface DetailedCartItem {
  product: Product;
  quantity: number;
  color?: ProductColor;
  cartItem: CartItem;
}

interface CartContextValue {
  items: CartItem[];
  detailedItems: DetailedCartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  addToCart: (productId: string, quantity?: number, color?: ProductColor) => void;
  removeFromCart: (productId: string, colorId?: string) => void;
  updateQuantity: (productId: string, quantity: number, colorId?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useAdmin();
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          dispatch({ type: 'INIT', items: parsed });
        }
      }
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
  }, [state.items]);

  const value = useMemo<CartContextValue>(() => {
    const detailedItems = state.items
      .map((cartItem) => {
        const product = products.find((candidate) => candidate.id === cartItem.productId);
        if (!product) return null;

        const color = cartItem.colorId
          ? product.colors.find((candidate) => candidate.id === cartItem.colorId)
          : product.colors[0];

        return { product, quantity: cartItem.quantity, color, cartItem };
      })
      .filter((item): item is DetailedCartItem => item !== null);

    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = detailedItems.reduce(
      (sum, item) => sum + (item.product.discountPrice ?? item.product.price) * item.quantity,
      0
    );
    const originalTotal = detailedItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
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
      addToCart: (productId, quantity = 1, color) => {
        const product = products.find((candidate) => candidate.id === productId);
        const selectedColor = color ?? product?.colors[0];
        const maxQuantity = selectedColor?.stock ?? product?.stock ?? Number.MAX_SAFE_INTEGER;

        dispatch({
          type: 'ADD',
          productId,
          quantity,
          colorId: selectedColor?.id,
          colorName: selectedColor?.name,
          colorHex: selectedColor?.hex,
          maxQuantity,
        });
      },
      removeFromCart: (productId, colorId) =>
        dispatch({ type: 'REMOVE', productId, colorId }),
      updateQuantity: (productId, quantity, colorId) => {
        const product = products.find((candidate) => candidate.id === productId);
        const selectedColor = colorId
          ? product?.colors.find((color) => color.id === colorId)
          : product?.colors[0];
        const maxQuantity = selectedColor?.stock ?? product?.stock ?? Number.MAX_SAFE_INTEGER;

        dispatch({ type: 'UPDATE_QTY', productId, quantity, colorId, maxQuantity });
      },
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
