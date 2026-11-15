import LegalPage from '../components/LegalPage.jsx'
import { BUSINESS } from '../utils/format.js'

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="How Freco Limited collects, uses and protects your personal data."
      updated="15 November 2026"
    >
      <h2>Who we are</h2>
      <p>
        {BUSINESS.legalName} (“we”, “us”) is the data controller for the personal
        data you provide through this website. We’re a company registered in{' '}
        {BUSINESS.placeOfRegistration} (company no. {BUSINESS.companyNumber}),
        registered office {BUSINESS.registeredOffice}. For any privacy question,
        contact us at <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Contact &amp; order details</strong> — name, email, phone,
          billing and delivery address, and the items you order.
        </li>
        <li>
          <strong>Communications</strong> — messages you send us via the contact
          form, email or phone.
        </li>
        <li>
          <strong>Payment data</strong> — card payments are handled by our
          payment processor (Stripe). We <strong>do not</strong> see or store
          your full card number; we may receive limited details such as the card
          type and last four digits to identify your order.
        </li>
        <li>
          <strong>Technical data</strong> — basic information your browser sends,
          and local storage we use to keep your basket between visits.
        </li>
      </ul>

      <h2>How we use it, and our lawful bases</h2>
      <ul>
        <li>
          To take and fulfil your order and provide customer support —{' '}
          <em>performance of a contract</em>.
        </li>
        <li>
          To meet legal and accounting obligations (for example tax records) —{' '}
          <em>legal obligation</em>.
        </li>
        <li>
          To keep our site secure, prevent fraud and improve our service —{' '}
          <em>legitimate interests</em>.
        </li>
        <li>
          To send marketing, only where you’ve asked us to — <em>consent</em>,
          which you can withdraw at any time.
        </li>
      </ul>

      <h2>Who we share it with</h2>
      <p>We share personal data only as needed to run the business, including:</p>
      <ul>
        <li>
          <strong>Stripe</strong>, to process payments — see Stripe’s privacy
          policy at{' '}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
            stripe.com/privacy
          </a>
          .
        </li>
        <li>Couriers and delivery partners, to deliver your order.</li>
        <li>Our accountants and IT/hosting providers, under confidentiality.</li>
        <li>Authorities or advisers where required by law.</li>
      </ul>
      <p>We never sell your personal data.</p>

      <h2>Cookies &amp; local storage</h2>
      <p>
        We use essential browser storage to remember your basket and keep the
        site working. We don’t use advertising cookies.{' '}
        <em>[If you later add analytics or marketing cookies, add a cookie
        banner and list them here.]</em>
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep order and transaction records for as long as needed to provide
        the service and to meet legal and tax obligations (generally six years
        for financial records), then delete or anonymise them.
      </p>

      <h2>Your rights</h2>
      <p>
        Under UK GDPR you can ask to access, correct, delete, restrict or object
        to our use of your data, and to receive a copy in a portable format. To
        exercise any right, email{' '}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>. You also have
        the right to complain to the UK Information Commissioner’s Office (ICO) at{' '}
        <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
          ico.org.uk
        </a>
        .
      </p>

      <h2>Security</h2>
      <p>
        The site is served over HTTPS and payments are processed by a PCI-DSS
        compliant provider. We apply appropriate measures to protect your data,
        though no method of transmission over the internet is completely secure.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy from time to time. The “last updated” date
        above shows the current version.
      </p>
    </LegalPage>
  )
}
