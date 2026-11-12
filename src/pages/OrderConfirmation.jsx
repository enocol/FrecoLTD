import { Link, useLocation, Navigate } from 'react-router-dom'
import { formatPrice } from '../utils/format.js'

export default function OrderConfirmation() {
  const location = useLocation()
  const order = location.state?.order

  // Reached directly without placing an order.
  if (!order) {
    return <Navigate to="/" replace />
  }

  const placed = new Date(order.date)

  return (
    <div className="container section confirmation">
      <div className="confirmation__badge" aria-hidden="true">✓</div>
      <h1 className="page-title">Thank you for your order!</h1>
      <p className="page-subtitle">
        A confirmation has been sent to <strong>{order.email}</strong>.
      </p>

      <div className="receipt">
        <div className="receipt__head">
          <div>
            <span className="receipt__label">Order reference</span>
            <span className="receipt__ref">{order.reference}</span>
          </div>
          <div>
            <span className="receipt__label">Date</span>
            <span>
              {placed.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
          <div>
            <span className="receipt__label">Payment</span>
            <span>
              {order.cardBrand} ···· {order.cardLast4}
            </span>
          </div>
        </div>

        <ul className="receipt__items">
          {order.items.map((item) => (
            <li key={item.id} className="receipt__item">
              <span className="receipt__item-qty">{item.quantity}×</span>
              <span className="receipt__item-name">{item.name}</span>
              <span className="receipt__item-price">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="receipt__totals">
          <div className="summary__row">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="summary__row">
            <span>{order.fulfilment === 'collection' ? 'Collection' : 'Delivery'}</span>
            <span>
              {order.delivery === 0 ? 'Free' : formatPrice(order.delivery)}
            </span>
          </div>
          <div className="summary__row summary__row--total">
            <span>Total paid</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        {order.fulfilment === 'collection' ? (
          <div className="receipt__ship">
            <h3>Collecting from</h3>
            <p>
              <strong>{order.collectionPoint.name}</strong>
              <br />
              {order.collectionPoint.line1}
              <br />
              {order.collectionPoint.line2}
              <br />
              {order.collectionPoint.city}, {order.collectionPoint.postcode}
            </p>
            <p className="receipt__hours">🕒 {order.collectionPoint.hours}</p>
            <p className="receipt__hours">
              We’ll email <strong>{order.name}</strong> when it’s ready to
              collect — please bring your order reference and photo ID.
            </p>
          </div>
        ) : (
          <div className="receipt__ship">
            <h3>Delivering to</h3>
            <p>
              {order.name}
              <br />
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
              {order.address.postcode}
            </p>
          </div>
        )}
      </div>

      <Link to="/shop" className="btn btn--primary btn--lg">
        Continue shopping
      </Link>
    </div>
  )
}
