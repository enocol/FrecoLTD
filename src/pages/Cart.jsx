import { Link } from 'react-router-dom'
import Thumbnail from '../components/Thumbnail.jsx'
import { useCart } from '../context/CartContext.jsx'
import {
  formatPrice,
  deliveryFor,
  FREE_DELIVERY_THRESHOLD,
} from '../utils/format.js'
import products from '../data/products.json'

function productFor(id) {
  return products.find((p) => p.id === id)
}

export default function Cart() {
  const { items, subtotal, totalItems, setQuantity, removeFromCart, clearCart } =
    useCart()

  const delivery = deliveryFor(subtotal)
  const total = subtotal + delivery
  const awayFromFree = FREE_DELIVERY_THRESHOLD - subtotal

  if (items.length === 0) {
    return (
      <div className="container section empty">
        <div className="empty__icon" aria-hidden="true">🛒</div>
        <h1 className="page-title">Your basket is empty</h1>
        <p>Looks like you haven’t added anything yet.</p>
        <Link to="/shop" className="btn btn--primary btn--lg">
          Start shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container section">
      <h1 className="page-title">Your basket</h1>
      <p className="page-subtitle">
        {totalItems} {totalItems === 1 ? 'item' : 'items'} in your basket
      </p>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => {
            const product = productFor(item.id)
            return (
              <div className="cart-row" key={item.id}>
                <Link to={`/product/${item.id}`} className="cart-row__media">
                  {product && (
                    <Thumbnail product={product} className="cart-row__image" />
                  )}
                </Link>

                <div className="cart-row__info">
                  <Link to={`/product/${item.id}`} className="cart-row__name">
                    {item.name}
                  </Link>
                  <span className="cart-row__cat">{item.category}</span>
                  <span className="cart-row__unit">
                    {formatPrice(item.price)} each
                  </span>
                </div>

                <div className="cart-row__qty">
                  <label className="qty qty--sm">
                    <span className="sr-only">Quantity for {item.name}</span>
                    <select
                      className="input"
                      value={item.quantity}
                      onChange={(e) =>
                        setQuantity(item.id, Number(e.target.value))
                      }
                    >
                      {Array.from(
                        { length: Math.min(item.stock, 10) || 1 },
                        (_, i) => i + 1,
                      ).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="cart-row__line">
                  {formatPrice(item.price * item.quantity)}
                </div>

                <button
                  className="cart-row__remove"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name} from basket`}
                >
                  ✕
                </button>
              </div>
            )
          })}

          <div className="cart-actions">
            <Link to="/shop" className="btn btn--ghost">
              ← Continue shopping
            </Link>
            <button className="btn btn--text" onClick={clearCart}>
              Clear basket
            </button>
          </div>
        </div>

        <aside className="summary">
          <h2 className="summary__title">Order summary</h2>
          <div className="summary__row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary__row">
            <span>Delivery (est.)</span>
            <span>{delivery === 0 ? 'Free' : formatPrice(delivery)}</span>
          </div>
          <p className="summary__hint">
            {awayFromFree > 0
              ? `Add ${formatPrice(awayFromFree)} more for free delivery — or choose free collection at checkout.`
              : 'Free delivery applied — or choose free collection at checkout.'}
          </p>
          <div className="summary__row summary__row--total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <Link to="/checkout" className="btn btn--primary btn--lg btn--block">
            Proceed to checkout
          </Link>
          <p className="summary__secure">🔒 Secure card checkout</p>
        </aside>
      </div>
    </div>
  )
}
