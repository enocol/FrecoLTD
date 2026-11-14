import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { totalItems } = useCart()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link
          to="/"
          className="brand"
          aria-label="Freco Limited home"
          onClick={() => setOpen(false)}
        >
          <span className="brand__mark" aria-hidden="true">⚙</span>
          <span className="brand__text">
            Freco<span className="brand__accent">Limited</span>
          </span>
        </Link>

        {/* Inline links — desktop only */}
        <nav className="navbar__links" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className="navlink">
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Right cluster: basket first, then the hamburger */}
        <div className="navbar__actions">
          <Link
            to="/cart"
            className="cart-button"
            aria-label={`Basket, ${totalItems} items`}
          >
            <span className="cart-button__icon" aria-hidden="true">🛒</span>
            <span className="cart-button__label">Basket</span>
            {totalItems > 0 && (
              <span className="cart-button__badge">{totalItems}</span>
            )}
          </Link>

          <button
            type="button"
            className="navbar__toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className={`hamburger ${open ? 'is-open' : ''}`} aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Collapsible menu — mobile & tablet */}
      <nav
        id="mobile-menu"
        className={`navbar__mobile ${open ? 'is-open' : ''}`}
        aria-label="Mobile"
      >
        <div className="container navbar__mobile-list">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className="navbar__mobile-link"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}
