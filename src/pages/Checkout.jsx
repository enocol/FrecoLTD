import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice, deliveryFor, COLLECTION_POINT } from '../utils/format.js'

// ---- card helpers -------------------------------------------------

function luhnValid(number) {
  const digits = number.replace(/\s+/g, '')
  if (!/^\d{12,19}$/.test(digits)) return false
  let sum = 0
  let double = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i])
    if (double) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    double = !double
  }
  return sum % 10 === 0
}

function detectBrand(number) {
  const n = number.replace(/\s+/g, '')
  if (/^4/.test(n)) return 'Visa'
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'Mastercard'
  if (/^3[47]/.test(n)) return 'American Express'
  return ''
}

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 19)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function expiryValid(value) {
  const match = value.match(/^(\d{2})\/(\d{2})$/)
  if (!match) return false
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  if (month < 1 || month > 12) return false
  const now = new Date()
  const expiry = new Date(year, month, 0, 23, 59, 59) // last day of month
  return expiry >= now
}

// ---- component ----------------------------------------------------

const initialForm = {
  email: '',
  phone: '',
  fullName: '',
  address1: '',
  address2: '',
  city: '',
  postcode: '',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
}

export default function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, totalItems, clearCart } = useCart()
  const [fulfilment, setFulfilment] = useState('delivery') // 'delivery' | 'collection'
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [processing, setProcessing] = useState(false)

  const isDelivery = fulfilment === 'delivery'
  const delivery = isDelivery ? deliveryFor(subtotal) : 0
  const total = subtotal + delivery
  const brand = detectBrand(form.cardNumber)

  if (items.length === 0 && !processing) {
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

  const update = (field) => (e) => {
    let value = e.target.value
    if (field === 'cardNumber') value = formatCardNumber(value)
    if (field === 'expiry') value = formatExpiry(value)
    if (field === 'cvv') value = value.replace(/\D/g, '').slice(0, 4)
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const chooseFulfilment = (value) => {
    setFulfilment(value)
    // Clear any address errors that no longer apply.
    setErrors((prev) => ({
      ...prev,
      address1: undefined,
      city: undefined,
      postcode: undefined,
    }))
  }

  const validate = () => {
    const next = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email address.'
    if (form.fullName.trim().length < 2) next.fullName = 'Enter your full name.'

    if (isDelivery) {
      if (form.address1.trim().length < 3) next.address1 = 'Enter your address.'
      if (form.city.trim().length < 2) next.city = 'Enter your town or city.'
      if (!/^[A-Za-z0-9 ]{4,10}$/.test(form.postcode.trim()))
        next.postcode = 'Enter a valid postcode.'
    } else {
      // Collection: a contact phone helps us reach the customer at pickup.
      if (!/^[0-9+()\s-]{7,}$/.test(form.phone.trim()))
        next.phone = 'Enter a contact number for collection.'
    }

    if (form.cardName.trim().length < 2)
      next.cardName = 'Enter the name on the card.'
    if (!luhnValid(form.cardNumber))
      next.cardNumber = 'Enter a valid card number.'
    if (!expiryValid(form.expiry))
      next.expiry = 'Enter a valid future expiry date.'
    const cvvLen = brand === 'American Express' ? 4 : 3
    if (!new RegExp(`^\\d{${cvvLen}}$`).test(form.cvv))
      next.cvv = `Enter the ${cvvLen}-digit security code.`

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) {
      const firstError = document.querySelector('.field--error input')
      firstError?.focus()
      return
    }

    setProcessing(true)

    // No backend: simulate a payment gateway round-trip.
    const order = {
      reference: 'FRC-' + Date.now().toString(36).toUpperCase(),
      date: new Date().toISOString(),
      items,
      totalItems,
      subtotal,
      delivery,
      total,
      cardBrand: brand || 'Card',
      cardLast4: form.cardNumber.replace(/\s+/g, '').slice(-4),
      email: form.email,
      phone: form.phone,
      name: form.fullName,
      fulfilment,
      address: isDelivery
        ? {
            line1: form.address1,
            line2: form.address2,
            city: form.city,
            postcode: form.postcode,
          }
        : null,
      collectionPoint: isDelivery ? null : COLLECTION_POINT,
    }

    setTimeout(() => {
      clearCart()
      navigate('/order-confirmation', { state: { order }, replace: true })
    }, 1400)
  }

  return (
    <div className="container section">
      <h1 className="page-title">Checkout</h1>
      <Link to="/cart" className="back-link">
        ← Back to basket
      </Link>

      <form className="checkout" onSubmit={handleSubmit} noValidate>
        <div className="checkout__main">
          <fieldset className="panel">
            <legend className="panel__title">1. Contact details</legend>
            <Field label="Email address" error={errors.email}>
              <input
                className="input"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={update('email')}
                placeholder="you@example.com"
              />
            </Field>
            <Field
              label={isDelivery ? 'Phone (optional)' : 'Phone'}
              error={errors.phone}
            >
              <input
                className="input"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={update('phone')}
                placeholder="07xxx xxxxxx"
              />
            </Field>
          </fieldset>

          <fieldset className="panel">
            <legend className="panel__title">2. How would you like your order?</legend>

            <div className="fulfilment" role="radiogroup" aria-label="Fulfilment method">
              <label
                className={`fulfilment__option ${isDelivery ? 'is-active' : ''}`}
              >
                <input
                  type="radio"
                  name="fulfilment"
                  value="delivery"
                  checked={isDelivery}
                  onChange={() => chooseFulfilment('delivery')}
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

              <label
                className={`fulfilment__option ${!isDelivery ? 'is-active' : ''}`}
              >
                <input
                  type="radio"
                  name="fulfilment"
                  value="collection"
                  checked={!isDelivery}
                  onChange={() => chooseFulfilment('collection')}
                />
                <span className="fulfilment__icon" aria-hidden="true">🏬</span>
                <span className="fulfilment__text">
                  <span className="fulfilment__name">Collect in person</span>
                  <span className="fulfilment__meta">Free · usually ready same day</span>
                </span>
              </label>
            </div>

            {isDelivery ? (
              <div className="fulfilment__panel">
                <Field label="Full name" error={errors.fullName}>
                  <input
                    className="input"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={update('fullName')}
                  />
                </Field>
                <Field label="Address line 1" error={errors.address1}>
                  <input
                    className="input"
                    autoComplete="address-line1"
                    value={form.address1}
                    onChange={update('address1')}
                  />
                </Field>
                <Field label="Address line 2 (optional)">
                  <input
                    className="input"
                    autoComplete="address-line2"
                    value={form.address2}
                    onChange={update('address2')}
                  />
                </Field>
                <div className="field-row">
                  <Field label="Town / City" error={errors.city}>
                    <input
                      className="input"
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={update('city')}
                    />
                  </Field>
                  <Field label="Postcode" error={errors.postcode}>
                    <input
                      className="input"
                      autoComplete="postal-code"
                      value={form.postcode}
                      onChange={update('postcode')}
                    />
                  </Field>
                </div>
              </div>
            ) : (
              <div className="fulfilment__panel">
                <Field label="Full name" error={errors.fullName}>
                  <input
                    className="input"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={update('fullName')}
                  />
                </Field>
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
                  <p className="collect-card__hours">
                    🕒 {COLLECTION_POINT.hours}
                  </p>
                  <p className="collect-card__note">
                    We’ll email you when your order is ready to collect. Please
                    bring your order reference and photo ID.
                  </p>
                </div>
              </div>
            )}
          </fieldset>

          <fieldset className="panel">
            <legend className="panel__title">
              3. Payment
              <span className="panel__secure">🔒 Secure</span>
            </legend>

            <Field label="Name on card" error={errors.cardName}>
              <input
                className="input"
                autoComplete="cc-name"
                value={form.cardName}
                onChange={update('cardName')}
              />
            </Field>

            <Field label="Card number" error={errors.cardNumber}>
              <div className="card-input">
                <input
                  className="input"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  value={form.cardNumber}
                  onChange={update('cardNumber')}
                  placeholder="1234 5678 9012 3456"
                />
                {brand && <span className="card-input__brand">{brand}</span>}
              </div>
            </Field>

            <div className="field-row">
              <Field label="Expiry (MM/YY)" error={errors.expiry}>
                <input
                  className="input"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  value={form.expiry}
                  onChange={update('expiry')}
                  placeholder="MM/YY"
                />
              </Field>
              <Field label="Security code" error={errors.cvv}>
                <input
                  className="input"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  value={form.cvv}
                  onChange={update('cvv')}
                  placeholder="CVC"
                />
              </Field>
            </div>

            <p className="checkout__demo">
              Online card payment isn’t live yet — please don’t enter real card
              details. To order now, <Link to="/contact">contact us</Link> or
              choose collection. Secure Stripe card payments are coming soon.
            </p>
          </fieldset>
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
            type="submit"
            className="btn btn--primary btn--lg btn--block"
            disabled={processing}
          >
            {processing ? 'Processing…' : `Pay ${formatPrice(total)}`}
          </button>
          <p className="summary__secure">
            🔒 Card payments will be processed securely by Stripe.
          </p>
        </aside>
      </form>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <label className={`field ${error ? 'field--error' : ''}`}>
      <span className="field__label">{label}</span>
      {children}
      {error && <span className="field__error">{error}</span>}
    </label>
  )
}
