import { Link } from 'react-router-dom'
import products from '../data/products.json'
import ProductCard from '../components/ProductCard.jsx'

const CATEGORIES = [
  { name: 'Engines', blurb: 'Complete reconditioned & tested units', icon: '🔧' },
  { name: 'Engine Parts', blurb: 'Turbos, pistons, timing kits & more', icon: '⚙️' },
  { name: 'Alloy Wheels', blurb: 'Premium 17"–19" wheel sets', icon: '🛞' },
  { name: 'Car Parts', blurb: 'Brakes, clutches, filters & lighting', icon: '🚗' },
]

export default function Home() {
  const featured = products.filter((p) => p.featured).slice(0, 6)

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content">
            <span className="hero__eyebrow">Freco Limited</span>
            <h1 className="hero__title">
              Engines, parts & alloys that get you back on the road
            </h1>
            <p className="hero__sub">
              Hand-tested car engines, genuine replacement parts and premium alloy
              wheels — shipped fast across the UK with a warranty on every order.
            </p>
            <div className="hero__actions">
              <Link to="/shop" className="btn btn--primary btn--lg">
                Shop all products
              </Link>
              <Link to="/shop?category=Engines" className="btn btn--ghost btn--lg">
                Browse engines
              </Link>
            </div>
            <ul className="hero__trust">
              <li>✓ Warranty on every part</li>
              <li>✓ Free delivery over £1,000</li>
              <li>✓ Secure card checkout</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2 className="section__title">Shop by category</h2>
        <div className="category-grid">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              to={`/shop?category=${encodeURIComponent(c.name)}`}
              className="category-tile"
            >
              <span className="category-tile__icon" aria-hidden="true">
                {c.icon}
              </span>
              <span className="category-tile__name">{c.name}</span>
              <span className="category-tile__blurb">{c.blurb}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section__head">
          <h2 className="section__title">Featured products</h2>
          <Link to="/shop" className="section__link">
            View all →
          </Link>
        </div>
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  )
}
