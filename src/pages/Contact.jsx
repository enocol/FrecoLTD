import { useState } from 'react'
import { useToast } from '../context/ToastContext.jsx'
import { COLLECTION_POINT } from '../utils/format.js'

const REASONS = ['Enquiry', 'Complaint', 'Feedback', 'Other']

const initialForm = {
  name: '',
  phone: '',
  email: '',
  reason: '',
  orderNumber: '',
  message: '',
}

export default function Contact() {
  const { showToast } = useToast()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(null)

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Please enter your name.'
    if (!/^[0-9+()\s-]{7,}$/.test(form.phone.trim()))
      next.phone = 'Please enter a valid phone number.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Please enter a valid email address.'
    if (!form.reason) next.reason = 'Please choose a reason.'
    if (form.message.trim().length < 10)
      next.message = 'Please enter a message (at least 10 characters).'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) {
      document
        .querySelector('.field--error input, .field--error select, .field--error textarea')
        ?.focus()
      return
    }

    // No backend: simulate sending the message.
    const reference = 'MSG-' + Date.now().toString(36).toUpperCase()
    setSent({
      name: form.name.trim(),
      reason: form.reason,
      email: form.email.trim(),
      reference,
    })
    showToast({
      title: 'Message sent',
      description: `We'll reply to ${form.email.trim()} soon.`,
    })
    setForm(initialForm)
  }

  return (
    <div className="container section">
      <h1 className="page-title">Contact us</h1>
      <p className="page-subtitle">
        Questions about a product or an existing order? Send us a message and
        we’ll get back to you.
      </p>

      <div className="contact-layout">
        {sent ? (
          <div className="panel contact-success">
            <div className="confirmation__badge" aria-hidden="true">
              ✓
            </div>
            <h2 className="summary__title">Thanks, {sent.name}!</h2>
            <p>
              We’ve received your {sent.reason.toLowerCase()} and sent a copy to{' '}
              <strong>{sent.email}</strong>. Our team usually replies within one
              business day.
            </p>
            <p className="receipt__hours">
              Your reference: <strong>{sent.reference}</strong>
            </p>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setSent(null)}
            >
              Send another message
            </button>
          </div>
        ) : (
          <form className="panel" onSubmit={handleSubmit} noValidate>
            <h2 className="panel__title">Send us a message</h2>

            <Field label="Name" error={errors.name}>
              <input
                className="input"
                autoComplete="name"
                value={form.name}
                onChange={update('name')}
              />
            </Field>

            <div className="field-row">
              <Field label="Phone number" error={errors.phone}>
                <input
                  className="input"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  placeholder="07xxx xxxxxx"
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <input
                  className="input"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="you@example.com"
                />
              </Field>
            </div>

            <div className="field-row">
              <Field label="Reason for contact" error={errors.reason}>
                <select
                  className="input"
                  value={form.reason}
                  onChange={update('reason')}
                >
                  <option value="" disabled>
                    Select a reason…
                  </option>
                  {REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Order number (if applicable)">
                <input
                  className="input"
                  value={form.orderNumber}
                  onChange={update('orderNumber')}
                  placeholder="e.g. FRC-ABC123"
                />
              </Field>
            </div>

            <Field label="Message" error={errors.message}>
              <textarea
                className="input"
                rows={6}
                value={form.message}
                onChange={update('message')}
                placeholder="How can we help?"
              />
            </Field>

            <button type="submit" className="btn btn--primary btn--lg">
              Send message
            </button>
            <p className="checkout__demo">
              Demo store — messages aren’t actually delivered anywhere.
            </p>
          </form>
        )}

        <aside className="summary contact-aside">
          <h2 className="summary__title">Other ways to reach us</h2>

          <div className="contact-info__item">
            <span className="contact-info__label">Phone</span>
            <span className="contact-info__value">
              <a href="tel:+441214960000">07519999500</a>
            </span>
          </div>

          <div className="contact-info__item">
            <span className="contact-info__label">Email</span>
            <span className="contact-info__value">
              <a href="mailto:support@frecolimited.co.uk">
                support@frecolimited.co.uk
              </a>
            </span>
          </div>

          <div className="contact-info__item">
            <span className="contact-info__label">Visit / collect</span>
            <span className="contact-info__value">
              {COLLECTION_POINT.name}
              <br />
              {COLLECTION_POINT.line1}
              <br />
              {COLLECTION_POINT.line2}
              <br />
              {COLLECTION_POINT.city}, {COLLECTION_POINT.postcode}
            </span>
          </div>

          <div className="contact-info__item">
            <span className="contact-info__label">Opening hours</span>
            <span className="contact-info__value">{COLLECTION_POINT.hours}</span>
          </div>
        </aside>
      </div>
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
