// Stripe webhook — the reliable way to learn about paid orders.
//
// Stripe calls this endpoint directly when a Checkout Session completes, so it
// fires even if the customer closes the tab before returning to the site. It
// verifies Stripe's signature on the RAW request body, then emails an order
// notification to the business (and a confirmation to the customer) via Resend.
//
// Environment variables (set in Netlify → Site settings → Environment variables):
//   STRIPE_SECRET_KEY        – same key used by the checkout functions
//   STRIPE_WEBHOOK_SECRET    – signing secret from the Stripe webhook endpoint
//   RESEND_API_KEY           – API key from resend.com (email sending)
//   ORDER_EMAIL_FROM         – verified sender, e.g. "Freco Limited <orders@frecolimited.co.uk>"
//   ORDER_NOTIFICATION_EMAIL – where order alerts go (defaults below)

const Stripe = require('stripe')

const DEFAULT_MERCHANT_EMAIL = 'support@frecolimited.co.uk'
const DEFAULT_FROM = 'Freco Limited <onboarding@resend.dev>'

exports.handler = async (event) => {
  const key = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!key || !webhookSecret) {
    console.error('Webhook not configured: missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET.')
    return { statusCode: 500, body: 'Webhook not configured.' }
  }

  const stripe = Stripe(key)
  const signature =
    event.headers['stripe-signature'] || event.headers['Stripe-Signature']
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64')
    : event.body || ''

  let stripeEvent
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err && err.message)
    return { statusCode: 400, body: 'Signature verification failed.' }
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object
    if (session.payment_status === 'paid') {
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          limit: 100,
        })
        await sendOrderEmails(session, lineItems.data || [])
      } catch (err) {
        // Log and still return 200: the payment succeeded and the order is safe
        // in the Stripe Dashboard. Returning non-200 would make Stripe retry.
        console.error('Order notification failed:', err && err.message)
      }
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) }
}

async function sendOrderEmails(session, lineItems) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set — skipping emails. Order is in the Stripe Dashboard.')
    return
  }

  const from = process.env.ORDER_EMAIL_FROM || DEFAULT_FROM
  const merchantTo = process.env.ORDER_NOTIFICATION_EMAIL || DEFAULT_MERCHANT_EMAIL

  const currency = (session.currency || 'gbp').toUpperCase()
  const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency })
  const money = (minor) => gbp.format((minor || 0) / 100)

  const reference = 'FRC-' + String(session.payment_intent || session.id).slice(-8).toUpperCase()
  const fulfilment = (session.metadata && session.metadata.fulfilment) || 'delivery'
  const customer = session.customer_details || {}
  const shipping =
    session.shipping_details ||
    (session.collected_information && session.collected_information.shipping_details) ||
    null

  const rows = lineItems
    .map(
      (li) =>
        `<tr><td style="padding:6px 0;">${escapeHtml(li.description)}</td>` +
        `<td style="padding:6px 0;text-align:center;">×${li.quantity}</td>` +
        `<td style="padding:6px 0;text-align:right;">${money(li.amount_total)}</td></tr>`,
    )
    .join('')

  const addressBlock = shipping && shipping.address
    ? [
        shipping.name,
        shipping.address.line1,
        shipping.address.line2,
        shipping.address.city,
        shipping.address.postal_code,
        shipping.address.country,
      ]
        .filter(Boolean)
        .map(escapeHtml)
        .join('<br>')
    : 'Collection in person'

  const summary = `
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${rows}
      <tr><td colspan="3" style="border-top:1px solid #e2e5ea;padding-top:8px;"></td></tr>
      <tr><td colspan="2" style="padding:2px 0;"><strong>Total paid</strong></td>
          <td style="padding:2px 0;text-align:right;"><strong>${money(session.amount_total)}</strong></td></tr>
    </table>`

  // 1) Merchant notification — the thing you were missing.
  const merchantHtml = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#16181d;max-width:560px;">
      <h2 style="margin:0 0 4px;">New order ${escapeHtml(reference)}</h2>
      <p style="margin:0 0 16px;color:#6b7280;">${money(session.amount_total)} · ${escapeHtml(
        fulfilment === 'collection' ? 'Collection' : 'Delivery',
      )}</p>
      ${summary}
      <h3 style="margin:20px 0 6px;">Customer</h3>
      <p style="margin:0;font-size:14px;line-height:1.6;">
        ${escapeHtml(customer.name || '—')}<br>
        ${escapeHtml(customer.email || '—')}<br>
        ${escapeHtml(customer.phone || '')}
      </p>
      <h3 style="margin:20px 0 6px;">${fulfilment === 'collection' ? 'Fulfilment' : 'Ship to'}</h3>
      <p style="margin:0;font-size:14px;line-height:1.6;">${addressBlock}</p>
    </div>`

  await resendSend(apiKey, {
    from,
    to: [merchantTo],
    reply_to: customer.email || undefined,
    subject: `New order ${reference} — ${money(session.amount_total)}`,
    html: merchantHtml,
  })

  // 2) Customer confirmation (best-effort).
  if (customer.email) {
    const customerHtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#16181d;max-width:560px;">
        <h2 style="margin:0 0 4px;">Thank you for your order</h2>
        <p style="margin:0 0 16px;color:#6b7280;">Order reference <strong>${escapeHtml(
          reference,
        )}</strong></p>
        ${summary}
        <h3 style="margin:20px 0 6px;">${fulfilment === 'collection' ? 'Collection' : 'Delivery'}</h3>
        <p style="margin:0;font-size:14px;line-height:1.6;">${addressBlock}</p>
        <p style="margin:20px 0 0;font-size:14px;color:#6b7280;">
          Questions? Just reply to this email or contact Freco Limited.
        </p>
      </div>`

    try {
      await resendSend(apiKey, {
        from,
        to: [customer.email],
        subject: `Your Freco Limited order ${reference}`,
        html: customerHtml,
      })
    } catch (err) {
      // Don't fail the whole webhook if only the customer copy bounces.
      console.error('Customer email failed:', err && err.message)
    }
  }
}

async function resendSend(apiKey, payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Resend ${res.status}: ${detail}`)
  }
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
