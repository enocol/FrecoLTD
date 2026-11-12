import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'freco-cart'

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { items: JSON.parse(raw) }
  } catch {
    // ignore corrupt / unavailable storage
  }
  return { items: [] }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, quantity } = action
      const existing = state.items.find((i) => i.id === product.id)
      if (existing) {
        const capped = Math.min(existing.quantity + quantity, product.stock)
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, quantity: capped } : i,
          ),
        }
      }
      return {
        items: [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            stock: product.stock,
            quantity: Math.min(quantity, product.stock),
          },
        ],
      }
    }
    case 'SET_QUANTITY': {
      const quantity = Math.max(1, action.quantity)
      return {
        items: state.items.map((i) =>
          i.id === action.id
            ? { ...i, quantity: Math.min(quantity, i.stock) }
            : i,
        ),
      }
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.id !== action.id) }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch {
      // storage may be unavailable (private mode) — safe to ignore
    }
  }, [state.items])

  const value = useMemo(() => {
    const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
    const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    return {
      items: state.items,
      totalItems,
      subtotal,
      addToCart: (product, quantity = 1) =>
        dispatch({ type: 'ADD', product, quantity }),
      setQuantity: (id, quantity) =>
        dispatch({ type: 'SET_QUANTITY', id, quantity }),
      removeFromCart: (id) => dispatch({ type: 'REMOVE', id }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    }
  }, [state.items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
