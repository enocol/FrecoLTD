import LegalPage from '../components/LegalPage.jsx'
import { BUSINESS } from '../utils/format.js'

export default function Returns() {
  return (
    <LegalPage
      title="Returns, Refunds & Cancellations"
      intro="Your right to cancel, how to return a part, and how refunds are paid."
      updated="15 November 2026"
    >
      <p className="legal__muted">
        Nothing in this policy affects your statutory rights as a consumer under
        UK law, including the Consumer Rights Act 2015 and the Consumer Contracts
        Regulations 2013.
      </p>

      <h2>Your right to cancel (online orders)</h2>
      <p>
        If you’re a consumer buying online, you may cancel your order for any
        reason within <strong>{BUSINESS.returnsWindowDays} days</strong> of
        receiving the goods. To cancel, contact us at{' '}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> with your order
        reference before the window ends. You then have 14 days to return the
        goods.
      </p>
      <ul>
        <li>
          We’ll refund the price of the goods within 14 days of receiving them
          back (or evidence you’ve returned them).
        </li>
        <li>
          Standard outbound delivery is refunded; any premium delivery upgrade
          you chose is not.
        </li>
        <li>
          <strong>You pay the cost of returning the goods</strong>, unless the
          item is faulty or we sent the wrong part.
        </li>
        <li>
          We may reduce your refund to reflect any loss in value caused by
          handling beyond what’s needed to check the part.
        </li>
      </ul>

      <h2>Important: fitted and attempted-fit parts</h2>
      <p>
        Our parts are mechanical and often used or reconditioned. For your safety
        and because fitting can’t be undone:
      </p>
      <ul>
        <li>
          Return parts <strong>unfitted</strong>, in the same condition you
          received them, with any original packaging, labels and seals intact.
        </li>
        <li>
          Parts that have been <strong>fitted or part-fitted</strong>, modified,
          or damaged after delivery can’t be returned under the cancellation
          right (this doesn’t affect your rights if the part is faulty).
        </li>
        <li>
          Any manufacturer or Freco warranty seal must be unbroken for a
          change-of-mind return.
        </li>
      </ul>

      <h2>Faulty, damaged or incorrect items</h2>
      <p>
        If a part is faulty, not as described, or not the item you ordered,
        contact us as soon as possible. Under the Consumer Rights Act 2015 you
        may be entitled to a repair, replacement or refund, including the{' '}
        <strong>short-term right to reject</strong> within 30 days of purchase.
        We’ll cover reasonable return postage for faulty or incorrectly supplied
        parts.
      </p>
      <p className="legal__muted">
        Please note we can’t refund labour, fitting, hire, recovery or other
        consequential costs — always confirm compatibility (VIN, engine/part
        number) before fitting, and have parts fitted by a qualified mechanic.
      </p>

      <h2>How to return a part</h2>
      <ol>
        <li>
          Contact us first at <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>{' '}
          or <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a> with your order
          reference and reason for return.
        </li>
        <li>
          We’ll confirm the return address and give you a return reference.
          Please don’t send anything back before we confirm.
        </li>
        <li>
          Package the part securely (ideally as it arrived) and use a tracked,
          insured service — proof of postage alone may not cover loss in transit.
        </li>
      </ol>

      <h2>How refunds are paid</h2>
      <p>
        Approved refunds are made to your original payment method. Once your
        card payments are processed through Stripe, card refunds are returned to
        the same card. Refunds are issued promptly on approval; your bank may
        take a few extra days to show them.
      </p>

      <h2>Warranty</h2>
      <p>
        We offer a limited parts warranty that varies by product — for example
        30 days on used engines and gearboxes, and 6 months on rebuilt or
        reconditioned units. Full periods, conditions and exclusions are set out
        in our <a href="/warranty">Warranty Policy</a>. Claims require proof of
        purchase and, for mechanical parts, evidence of correct professional
        fitting.
      </p>

      <h2>Trade &amp; business customers</h2>
      <p>
        Orders placed by businesses are not covered by consumer cancellation
        rights; returns for trade customers are handled under our{' '}
        <a href="/trade-terms">Trade Terms &amp; Conditions</a>, which cover
        returns, core exchange, warranty and trade accounts.
      </p>
    </LegalPage>
  )
}
