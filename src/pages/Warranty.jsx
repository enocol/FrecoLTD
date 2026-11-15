import LegalPage from '../components/LegalPage.jsx'
import { BUSINESS } from '../utils/format.js'

export default function Warranty() {
  return (
    <LegalPage
      title="Warranty Policy"
      intro="Freco Limited is committed to supplying quality automotive parts and giving customers confidence in their purchases."
      updated="15 November 2026"
    >
      <h2>Warranty periods</h2>
      <ul>
        <li>
          <strong>Used engines and gearboxes:</strong> 30-day limited parts
          warranty.
        </li>
        <li>
          <strong>Rebuilt or reconditioned engines and gearboxes:</strong>{' '}
          6-month limited parts warranty.
        </li>
        <li>
          <strong>New automotive parts:</strong> 12-month warranty, unless
          otherwise specified.
        </li>
        <li>
          <strong>Used electrical components:</strong> 30-day limited warranty,
          unless otherwise stated.
        </li>
      </ul>

      <h2>Warranty conditions</h2>
      <ol>
        <li>The warranty begins on the date the product is delivered or collected.</li>
        <li>
          Warranty covers faults arising from defects present at the time of
          supply, subject to the applicable warranty terms.
        </li>
        <li>
          Engines and gearboxes must be installed by a suitably qualified
          mechanic, following the manufacturer’s installation procedures.
        </li>
        <li>
          Correct engine oil, transmission fluid, filters, coolant and other
          required consumables must be used.
        </li>
        <li>
          Warranty claims must be supported by proof of purchase and reasonable
          evidence of the reported fault.
        </li>
        <li>
          Damage resulting from misuse, incorrect installation, overheating,
          inadequate lubrication, accidents or unauthorised modifications is
          excluded where legally permitted.
        </li>
        <li>
          Customers must notify Freco Limited promptly upon discovering a
          suspected fault and avoid continued use that could cause further
          damage.
        </li>
        <li>
          Freco Limited may request inspection or diagnostic evidence before
          determining the appropriate remedy.
        </li>
        <li>
          Where a valid warranty claim is accepted, Freco Limited will provide an
          appropriate repair, replacement or refund in accordance with the
          warranty terms and applicable law.
        </li>
        <li>
          Labour, removal, refitting and consequential costs are not covered by
          this voluntary warranty unless expressly agreed or required by law.
        </li>
      </ol>

      <h2>Important notice</h2>
      <p>
        This warranty is provided in addition to customers’ statutory rights.
        Nothing in this policy excludes or restricts rights or remedies available
        under the Consumer Rights Act 2015 or other applicable legislation.
      </p>
      <p>
        For warranty assistance, please <a href="/contact">contact us</a> at{' '}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> or{' '}
        <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>. Website:{' '}
        <a href="https://frecolimited.co.uk">https://frecolimited.co.uk</a>.
      </p>
    </LegalPage>
  )
}
