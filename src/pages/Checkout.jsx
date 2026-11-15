import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice, deliveryFor, COLLECTION_POINT } from '../utils/format.js'

export default function Checkout() {
  const { items, subtotal } = useCart()
  const [fulfilment, setFulfilment] = useState('delivery') // 'delivery' | 'collection'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [params] = useSearchParams()
  const canceled = params.get('canceled')

  const isDelivery = fulfilment === 'delivery'
  const delivery = isDelivery ? deliveryFor(subtotal) : 0
  const total = subtotal + delivery

  if (items.length === 0) {
    return (
      <div className="container section empty">
        <h1 className="page-title">Your basket is empty</h1>
        <p>Add some products before checking out.</p>
        <Link to="/shop" className="btn btn--primary">
          Go to shop
        </Link>
      </div>
    )
  }

  const pay = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          fulfilment,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) {
        throw new Error(
          data.error || 'Sorry, we couldn’t start the payment. Please try again.',
        )
      }
      // Hand off to Stripe's secure hosted checkout.
      window.location.href = data.url
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="container section">
      <h1 className="page-title">Checkout</h1>
      <Link to="/cart" className="back-link">
        ← Back to basket
      </Link>

      {canceled && (
        <p className="checkout__banner checkout__banner--info">
          Payment canceled — your basket is saved, so you can try again whenever
          you’re ready.
        </p>
      )}
      {error && (
        <p className="checkout__banner checkout__banner--error" role="alert">
          {error}
        </p>
      )}

      <div className="checkout">
        <div className="checkout__main">
          <fieldset className="panel">
            <legend className="panel__title">How would you like your order?</legend>

            <div className="fulfilment" role="radiogroup" aria-label="Fulfilment method">
              <label className={`fulfilment__option ${isDelivery ? 'is-active' : ''}`}>
                <input
                  type="radio"
                  name="fulfilment"
                  value="delivery"
                  checked={isDelivery}
                  onChange={() => setFulfilment('delivery')}
                />
                <span className="fulfilment__icon" aria-hidden="true">🚚</span>
                <span className="fulfilment__text">
                  <span className="fulfilment__name">Deliver to me</span>
                  <span className="fulfilment__meta">
                    {deliveryFor(subtotal) === 0
                      ? 'Free delivery'
                      : `${formatPrice(deliveryFor(subtotal))} · free over £1,000`}
                  </span>
                </span>
              </label>

              <label className={`fulfilment__option ${!isDelivery ? 'is-active' : ''}`}>
                <input
                  type="radio"
                  name="fulfilment"
                  value="collection"
                  checked={!isDelivery}
                  onChange={() => setFulfilment('collection')}
                />
                <span className="fulfilment__icon" aria-hidden="true">🏬</span>
                <span className="fulfilment__text">
                  <span className="fulfilment__name">Collect in person</span>
                  <span className="fulfilment__meta">Free · usually ready same day</span>
                </span>
              </label>
            </div>

            {isDelivery ? (
              <p className="fulfilment__hint">
                We deliver across mainland UK. You’ll enter your delivery address
                on the next (secure) step.
              </p>
            ) : (
              <div className="fulfilment__panel">
                <div className="collect-card">
                  <h3 className="collect-card__title">Collect from</h3>
                  <p className="collect-card__addr">
                    <strong>{COLLECTION_POINT.name}</strong>
                    <br />
                    {COLLECTION_POINT.line1}
                    <br />
                    {COLLECTION_POINT.line2}
                    <br />
                    {COLLECTION_POINT.city}, {COLLECTION_POINT.postcode}
                  </p>
                  <p className="collect-card__hours">🕒 {COLLECTION_POINT.hours}</p>
                  <p className="collect-card__note">
                    We’ll email you when your order is ready to collect. Please
                    bring your order reference and photo ID.
                  </p>
                </div>
              </div>
            )}
          </fieldset>

          <div className="panel checkout__paynote">
            <h2 className="panel__title">Payment</h2>
            <p>
              Pay securely by card. When you continue, we’ll take you to{' '}
              <strong>Stripe</strong> — our payment provider — to enter your card
              details. Freco Limited never sees or stores your card number.
            </p>
            <p className="pay-brands" aria-label="Accepted cards">
              Visa · Mastercard · American Express
            </p>
          </div>
        </div>

        <aside className="summary summary--checkout">
          <h2 className="summary__title">Your order</h2>
          <ul className="summary__items">
            {items.map((item) => (
              <li key={item.id} className="summary__item">
                <span className="summary__item-qty">{item.quantity}×</span>
                <span className="summary__item-name">{item.name}</span>
                <span className="summary__item-price">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="summary__row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary__row">
            <span>{isDelivery ? 'Delivery' : 'Collection'}</span>
            <span>
              {isDelivery ? (delivery === 0 ? 'Free' : formatPrice(delivery)) : 'Free'}
            </span>
          </div>
          <div className="summary__row summary__row--total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button
            type="button"
            className="btn btn--primary btn--lg btn--block"
            onClick={pay}
            disabled={loading}
          >
            {loading ? 'Redirecting to Stripe…' : `Pay ${formatPrice(total)}`}
          </button>
          <p className="summary__secure">
            🔒 Secure checkout powered by Stripe.
          </p>
        </aside>
      </div>
    </div>
  )
}
