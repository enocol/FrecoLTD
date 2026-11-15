import { useEffect, useState } from 'react'
import { Link, useSearchParams, Navigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice, COLLECTION_POINT } from '../utils/format.js'

// Stripe returns money in minor units (pence).
const money = (minor) => formatPrice((minor || 0) / 100)

export default function OrderConfirmation() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')
  const { clearCart } = useCart()
  const [view, setView] = useState({ status: 'loading' })

  useEffect(() => {
    if (!sessionId) return
    let active = true
    fetch(
      `/.netlify/functions/get-checkout-session?session_id=${encodeURIComponent(
        sessionId,
      )}`,
    )
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Could not load your order.')
        return data
      })
      .then((order) => {
        if (!active) return
        setView({ status: 'ok', order })
        if (order.paid) clearCart()
      })
      .catch((err) => {
        if (active) setView({ status: 'error', message: err.message })
      })
    return () => {
      active = false
    }
    // clearCart is intentionally omitted: it changes identity when the cart
    // updates, and we only want this to run once per session id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  // Reached directly, without coming back from Stripe.
  if (!sessionId) return <Navigate to="/" replace />

  if (view.status === 'loading') {
    return (
      <div className="container section confirmation">
        <h1 className="page-title">Confirming your order…</h1>
        <p className="page-subtitle">Just a moment while we check your payment.</p>
      </div>
    )
  }

  if (view.status === 'error') {
    return (
      <div className="container section confirmation">
        <h1 className="page-title">We couldn’t load your order</h1>
        <p className="page-subtitle">{view.message}</p>
        <p>
          If you’ve been charged, don’t worry — your payment is safe. Please{' '}
          <Link to="/contact">contact us</Link> with your email address and we’ll
          confirm your order.
        </p>
        <Link to="/shop" className="btn btn--primary btn--lg">
          Continue shopping
        </Link>
      </div>
    )
  }

  const order = view.order
  const isCollection = order.fulfilment === 'collection'
  const itemsTotal = (order.amountTotal || 0) - (order.shippingAmount || 0)

  if (!order.paid) {
    return (
      <div className="container section confirmation">
        <h1 className="page-title">Payment pending</h1>
        <p className="page-subtitle">
          Your payment hasn’t been confirmed yet. If you completed checkout, it
          may still be processing.
        </p>
        <p>
          We’ll email you once it’s confirmed. Any questions?{' '}
          <Link to="/contact">Contact us</Link>.
        </p>
        <Link to="/shop" className="btn btn--primary btn--lg">
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container section confirmation">
      <div className="confirmation__badge" aria-hidden="true">✓</div>
      <h1 className="page-title">Thank you for your order!</h1>
      <p className="page-subtitle">
        {order.email ? (
          <>A confirmation has been sent to <strong>{order.email}</strong>.</>
        ) : (
          <>Your payment was successful.</>
        )}
      </p>

      <div className="receipt">
        <div className="receipt__head">
          <div>
            <span className="receipt__label">Order reference</span>
            <span className="receipt__ref">{order.reference}</span>
          </div>
          <div>
            <span className="receipt__label">Payment</span>
            <span>Card · paid</span>
          </div>
        </div>

        <ul className="receipt__items">
          {order.items.map((item, idx) => (
            <li key={idx} className="receipt__item">
              <span className="receipt__item-qty">{item.quantity}×</span>
              <span className="receipt__item-name">{item.name}</span>
              <span className="receipt__item-price">{money(item.amountTotal)}</span>
            </li>
          ))}
        </ul>

        <div className="receipt__totals">
          <div className="summary__row">
            <span>Subtotal</span>
            <span>{money(itemsTotal)}</span>
          </div>
          <div className="summary__row">
            <span>{isCollection ? 'Collection' : 'Delivery'}</span>
            <span>
              {order.shippingAmount ? money(order.shippingAmount) : 'Free'}
            </span>
          </div>
          <div className="summary__row summary__row--total">
            <span>Total paid</span>
            <span>{money(order.amountTotal)}</span>
          </div>
        </div>

        {isCollection ? (
          <div className="receipt__ship">
            <h3>Collecting from</h3>
            <p>
              <strong>{COLLECTION_POINT.name}</strong>
              <br />
              {COLLECTION_POINT.line1}
              <br />
              {COLLECTION_POINT.line2}
              <br />
              {COLLECTION_POINT.city}, {COLLECTION_POINT.postcode}
            </p>
            <p className="receipt__hours">🕒 {COLLECTION_POINT.hours}</p>
            <p className="receipt__hours">
              We’ll email you when it’s ready to collect — please bring your order
              reference and photo ID.
            </p>
          </div>
        ) : order.address ? (
          <div className="receipt__ship">
            <h3>Delivering to</h3>
            <p>
              {order.name && (
                <>
                  {order.name}
                  <br />
                </>
              )}
              {order.address.line1}
              {order.address.line2 && (
                <>
                  <br />
                  {order.address.line2}
                </>
              )}
              <br />
              {order.address.city}
              <br />
              {order.address.postal_code}
            </p>
          </div>
        ) : null}
      </div>

      <Link to="/shop" className="btn btn--primary btn--lg">
        Continue shopping
      </Link>
    </div>
  )
}
