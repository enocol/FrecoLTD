import { Link } from 'react-router-dom'
import { BUSINESS, CURRENCY } from '../utils/format.js'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <div className="brand brand--footer">
            <img
              className="brand__mark"
              src="/brand/freco-emblem.svg"
              alt=""
              aria-hidden="true"
              width="38"
              height="38"
            />
            <span className="brand__text">
              Freco<span className="brand__accent">Limited</span>
            </span>
          </div>
          <p className="footer__tagline">
            Quality car engines, gearboxes, parts and alloy wheels — delivered
            across the UK.
          </p>
          <p className="footer__contact">
            <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>
            <br />
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
          </p>
        </div>

        <div className="footer__cols">
          <div>
            <h4>Shop</h4>
            <Link to="/shop">All products</Link>
            <Link to="/shop?category=Engines">Engines</Link>
            <Link to="/shop?category=Alloy%20Wheels">Alloy wheels</Link>
          </div>
          <div>
            <h4>Help</h4>
            <Link to="/delivery">Shipping &amp; delivery</Link>
            <Link to="/returns">Returns &amp; refunds</Link>
            <Link to="/contact">Contact us</Link>
          </div>
          <div>
            <h4>Legal</h4>
            <Link to="/terms">Terms &amp; conditions</Link>
            <Link to="/trade-terms">Trade terms</Link>
            <Link to="/privacy">Privacy policy</Link>
            <Link to="/returns">Cancellations</Link>
          </div>
        </div>
      </div>

      <div className="footer__base">
        <div className="container footer__legal">
          <p>
            © {year} {BUSINESS.legalName}. Registered in{' '}
            {BUSINESS.placeOfRegistration}, company no.{' '}
            {BUSINESS.companyNumber}. Registered office:{' '}
            {BUSINESS.registeredOffice}.
          </p>
          <p className="footer__muted">
            All prices in {CURRENCY.code} ({CURRENCY.symbol}). We accept Visa,
            Mastercard and American Express.
          </p>
        </div>
      </div>
    </footer>
  )
}
