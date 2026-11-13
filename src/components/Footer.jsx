import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <div className="brand brand--footer">
            <span className="brand__mark" aria-hidden="true">⚙</span>
            <span className="brand__text">
              Freco<span className="brand__accent">Limited</span>
            </span>
          </div>
          <p className="footer__tagline">
            Quality car engines, parts and alloy wheels — delivered across the UK.
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
            <a href="#delivery">Delivery</a>
            <a href="#returns">Returns</a>
            <Link to="/contact">Contact us</Link>
          </div>
        </div>
      </div>
      <div className="footer__base">
        <div className="container">
          © {new Date().getFullYear()} Freco Limited. Demo store — no real orders are processed.
        </div>
      </div>
    </footer>
  )
}
