import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Navbar() {
  const { totalItems } = useCart()

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="brand" aria-label="Freco Limited home">
          <span className="brand__mark" aria-hidden="true">⚙</span>
          <span className="brand__text">
            Freco<span className="brand__accent">Limited</span>
          </span>
        </Link>

        <nav className="navbar__links">
          <NavLink to="/" end className="navlink">
            Home
          </NavLink>
          <NavLink to="/shop" className="navlink">
            Shop
          </NavLink>
        </nav>

        <Link to="/cart" className="cart-button" aria-label={`Basket, ${totalItems} items`}>
          <span className="cart-button__icon" aria-hidden="true">🛒</span>
          <span className="cart-button__label">Basket</span>
          {totalItems > 0 && <span className="cart-button__badge">{totalItems}</span>}
        </Link>
      </div>
    </header>
  )
}
