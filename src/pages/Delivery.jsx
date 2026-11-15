import LegalPage from '../components/LegalPage.jsx'
import {
  formatPrice,
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  COLLECTION_POINT,
  BUSINESS,
} from '../utils/format.js'

export default function Delivery() {
  return (
    <LegalPage
      title="Shipping & Delivery"
      intro="How we get engines, gearboxes, parts and alloy wheels to you — and how click & collect works."
      updated="15 November 2026"
    >
      <h2>Where we deliver</h2>
      <p>
        We deliver to addresses in <strong>mainland UK</strong>. Deliveries to
        the Scottish Highlands &amp; Islands, Northern Ireland, the Isle of Man
        and other offshore locations may take longer and can carry a surcharge —
        we’ll contact you with any extra cost before dispatch. We don’t currently
        ship outside the UK; <a href={`mailto:${BUSINESS.email}`}>email us</a> if
        you need an export quote.
      </p>

      <h2>Delivery cost</h2>
      <ul>
        <li>
          <strong>Standard delivery:</strong> {formatPrice(DELIVERY_FEE)} per
          order.
        </li>
        <li>
          <strong>Free delivery</strong> on orders over{' '}
          {formatPrice(FREE_DELIVERY_THRESHOLD)}.
        </li>
        <li>
          <strong>Heavy &amp; palletised items</strong> (complete engines,
          gearboxes and some wheel sets) may require kerbside pallet delivery.
          Where this applies, any difference in cost will be confirmed with you
          before we charge or dispatch — <em>[confirm your pallet rates here]</em>.
        </li>
      </ul>

      <h2>Dispatch &amp; delivery times</h2>
      <p>
        Orders are typically dispatched within{' '}
        <strong>[1–2] working days</strong> of payment clearing. Estimated
        delivery is <strong>[2–5] working days</strong> for standard items and{' '}
        <strong>[3–7] working days</strong> for palletised items, Monday to
        Friday excluding bank holidays. These are estimates, not guarantees;
        we’ll let you know if a part is delayed or awaiting stock verification.
      </p>

      <h2>Tracking</h2>
      <p>
        Where the carrier provides tracking, we’ll email you the tracking number
        once your order is on its way. Keep your order reference (shown on your
        confirmation) handy for any delivery queries.
      </p>

      <h2>Checking your delivery</h2>
      <p>
        Large mechanical parts are heavy — please have help available to receive
        them. <strong>Inspect your order on arrival.</strong> If packaging is
        visibly damaged, note it with the driver where possible and{' '}
        <strong>report any damage or shortage within [48 hours]</strong> of
        delivery by contacting us, with photos if you can. This helps us resolve
        transit claims quickly.
      </p>

      <h2>Click &amp; collect (free)</h2>
      <p>You can collect your order in person, free of charge, from:</p>
      <p className="legal__addr">
        <strong>{COLLECTION_POINT.name}</strong>
        <br />
        {COLLECTION_POINT.line1}
        <br />
        {COLLECTION_POINT.line2}
        <br />
        {COLLECTION_POINT.city}, {COLLECTION_POINT.postcode}
        <br />
        <span className="legal__muted">{COLLECTION_POINT.hours}</span>
      </p>
      <p>
        We’ll email you when your order is ready. Please bring your{' '}
        <strong>order reference</strong> and <strong>photo ID</strong> when you
        collect. If someone is collecting on your behalf, let us know their name
        in advance.
      </p>

      <h2>Failed or missed deliveries</h2>
      <p>
        If a delivery can’t be completed, the carrier will usually attempt
        redelivery or leave collection instructions. Repeated failed deliveries
        or an incorrect address supplied at checkout may incur a re-delivery
        charge.
      </p>

      <p className="legal__muted">
        Questions about a delivery? Call us on{' '}
        <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a> or email{' '}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
      </p>
    </LegalPage>
  )
}
