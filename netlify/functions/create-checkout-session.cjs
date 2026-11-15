// Creates a Stripe Checkout Session and returns its hosted-payment URL.
//
// Security: prices are looked up here from our own catalogue (products.json).
// The browser only sends product IDs and quantities — never trusted amounts.
//
// Requires the STRIPE_SECRET_KEY environment variable (set in the Netlify
// dashboard → Site settings → Environment variables). Never commit the key.

const Stripe = require('stripe')
const products = require('../../src/data/products.json')

// Keep in sync with src/utils/format.js
const FREE_DELIVERY_THRESHOLD = 1000
const DELIVERY_FEE = 24.99

const json = (statusCode, data) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
})

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed.' })
  }

  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    return json(503, {
      error: 'Online payment is not configured yet. Please contact us to order.',
    })
  }

  let payload
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64').toString('utf8')
      : event.body || '{}'
    payload = JSON.parse(raw)
  } catch {
    return json(400, { error: 'Invalid request.' })
  }

  const { items, fulfilment } = payload || {}
  if (!Array.isArray(items) || items.length === 0) {
    return json(400, { error: 'Your basket is empty.' })
  }

  const byId = new Map(products.map((p) => [p.id, p]))
  const line_items = []
  let subtotal = 0

  for (const item of items) {
    const product = byId.get(item && item.id)
    if (!product) {
      return json(400, { error: `Sorry, a product in your basket is no longer available.` })
    }
    const stockCap = Number.isFinite(product.stock) ? product.stock : 99
    const quantity = Math.max(1, Math.min(parseInt(item.quantity, 10) || 1, stockCap))
    subtotal += product.price * quantity

    line_items.push({
      quantity,
      price_data: {
        currency: 'gbp',
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.name,
          metadata: { id: product.id, sku: product.sku || product.id },
        },
      },
    })
  }

  const isDelivery = fulfilment !== 'collection'
  const origin =
    event.headers.origin ||
    (event.headers.host ? `https://${event.headers.host}` : '')

  const params = {
    mode: 'payment',
    line_items,
    success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout?canceled=1`,
    billing_address_collection: 'auto',
    phone_number_collection: { enabled: true },
    metadata: { fulfilment: isDelivery ? 'delivery' : 'collection' },
  }

  if (isDelivery) {
    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
    params.shipping_address_collection = { allowed_countries: ['GB'] }
    params.shipping_options = [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          display_name: deliveryFee === 0 ? 'Free UK delivery' : 'UK delivery',
          fixed_amount: { amount: Math.round(deliveryFee * 100), currency: 'gbp' },
        },
      },
    ]
  }

  try {
    const stripe = Stripe(key)
    const session = await stripe.checkout.sessions.create(params)
    return json(200, { url: session.url })
  } catch (err) {
    console.error('Stripe session error:', err && err.message)
    return json(502, { error: 'We couldn’t start the payment. Please try again.' })
  }
}
