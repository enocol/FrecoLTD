import LegalPage from '../components/LegalPage.jsx'
import { BUSINESS } from '../utils/format.js'

export default function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="The terms on which Freco Limited sells car engines, gearboxes, parts and alloy wheels."
      updated="15 November 2026"
    >
      <h2>1. About us</h2>
      <p>
        This website is operated by {BUSINESS.legalName}, a company registered in{' '}
        {BUSINESS.placeOfRegistration} under company number{' '}
        {BUSINESS.companyNumber}, with registered office at{' '}
        {BUSINESS.registeredOffice}. You can reach us at{' '}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> or{' '}
        <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>.
      </p>

      <h2>2. These terms</h2>
      <p>
        By placing an order you agree to these terms. Please read them alongside
        our <a href="/privacy">Privacy Policy</a>,{' '}
        <a href="/delivery">Shipping &amp; Delivery</a> and{' '}
        <a href="/returns">Returns, Refunds &amp; Cancellations</a> policies. We
        may update these terms; the version that applies to your order is the one
        published when you order.
      </p>
      <p>
        Buying as a business (a garage, workshop, motor trader or other
        professional buyer)? Our{' '}
        <a href="/trade-terms">Trade Terms &amp; Conditions</a> apply to your
        order instead.
      </p>

      <h2>3. The products</h2>
      <p>
        Many of our parts are <strong>used, reconditioned or salvage</strong>
        items. Descriptions, photographs, images and specifications are provided
        as a guide and may show representative examples rather than the exact
        unit you receive. <strong>It is your responsibility to confirm
        compatibility</strong> — using your vehicle VIN, engine code and the
        manufacturer part number — before you order and before fitting.
      </p>

      <h2>4. Orders and the contract</h2>
      <p>
        Your order is an offer to buy. A contract is formed only when we accept
        your order — normally when we confirm dispatch (or readiness for
        collection). If we can’t fulfil an order (for example a part fails our
        checks or is out of stock), we’ll tell you and refund any payment taken.
      </p>

      <h2>5. Price</h2>
      <p>
        All prices are in <strong>pounds sterling (GBP, £)</strong>. We are not
        VAT-registered, so no VAT is added to our prices. Delivery charges are
        shown separately at checkout and explained in our{' '}
        <a href="/delivery">Shipping &amp; Delivery</a> policy. We take care to
        price accurately, but if we spot a genuine pricing error we’ll contact
        you before processing your order.
      </p>

      <h2>6. Payment</h2>
      <p>
        Card payments are processed securely by our payment provider, Stripe.
        Your card details are handled by Stripe and are not stored on our
        servers. We may cancel an order where payment is declined or where we
        suspect fraud.
      </p>

      <h2>7. Delivery and collection</h2>
      <p>
        We deliver as set out in our{' '}
        <a href="/delivery">Shipping &amp; Delivery</a> policy. Risk in the goods
        passes to you on delivery or collection; ownership passes once we’ve
        received payment in full.
      </p>

      <h2>8. Cancellations and returns</h2>
      <p>
        Your cancellation and return rights, including the statutory
        cancellation period for online purchases, are set out in our{' '}
        <a href="/returns">Returns, Refunds &amp; Cancellations</a> policy.
      </p>

      <h2>9. Fitting and warranty</h2>
      <p>
        Mechanical parts must be fitted by a suitably qualified mechanic. Any
        warranty we provide is stated at the point of sale and is conditional on
        correct professional fitting and use; it does not cover wear and tear,
        misuse, incorrect fitting, or damage caused by a pre-existing vehicle
        fault. See our <a href="/warranty">Warranty Policy</a> for the warranty
        periods, conditions and exclusions that apply.
      </p>

      <h2>10. Our liability</h2>
      <p>
        We don’t exclude or limit liability where it would be unlawful to do so,
        including for death or personal injury caused by our negligence, or for
        fraud. Subject to that, we are not liable for fitting, labour, recovery,
        hire, loss of use or other indirect or consequential losses. Our total
        liability for any order will not exceed the price you paid for it.{' '}
        <strong>Nothing in these terms affects your statutory rights as a
        consumer.</strong>
      </p>

      <h2>11. Governing law</h2>
      <p>
        These terms are governed by the laws of {BUSINESS.placeOfRegistration},
        and disputes are subject to the courts of {BUSINESS.placeOfRegistration}.
      </p>
    </LegalPage>
  )
}
