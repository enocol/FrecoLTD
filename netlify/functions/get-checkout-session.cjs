// Retrieves a completed Stripe Checkout Session so the confirmation page can
// show a real receipt. Returns only non-sensitive summary fields.

const Stripe = require('stripe')

const json = (statusCode, data) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
})

exports.handler = async (event) => {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return json(503, { error: 'Payments are not configured.' })

  const sessionId = event.queryStringParameters && event.queryStringParameters.session_id
  if (!sessionId) return json(400, { error: 'Missing session id.' })

  try {
    const stripe = Stripe(key)
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    })

    const shipping =
      session.shipping_details ||
      (session.collected_information && session.collected_information.shipping_details) ||
      null

    const refSource = session.payment_intent || session.id || ''
    const reference = 'FRC-' + String(refSource).slice(-8).toUpperCase()

    return json(200, {
      paid: session.payment_status === 'paid',
      reference,
      email: session.customer_details ? session.customer_details.email : null,
      name:
        (shipping && shipping.name) ||
        (session.customer_details && session.customer_details.name) ||
        null,
      amountTotal: session.amount_total,
      shippingAmount: session.shipping_cost ? session.shipping_cost.amount_total : 0,
      currency: (session.currency || 'gbp').toUpperCase(),
      fulfilment: (session.metadata && session.metadata.fulfilment) || 'delivery',
      address: shipping ? shipping.address : null,
      items: ((session.line_items && session.line_items.data) || []).map((li) => ({
        name: li.description,
        quantity: li.quantity,
        amountTotal: li.amount_total,
      })),
    })
  } catch (err) {
    console.error('Stripe retrieve error:', err && err.message)
    return json(502, { error: 'Could not load your order details.' })
  }
}
