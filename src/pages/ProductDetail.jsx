import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import products from '../data/products.json'
import ProductGallery from '../components/ProductGallery.jsx'
import StarRating from '../components/StarRating.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { formatPrice } from '../utils/format.js'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <div className="container section empty">
        <h1 className="page-title">Product not found</h1>
        <p>The product you’re looking for isn’t available.</p>
        <Link to="/shop" className="btn btn--primary">
          Back to shop
        </Link>
      </div>
    )
  }

  const onSale = product.oldPrice && product.oldPrice > product.price
  const outOfStock = product.stock <= 0
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  const handleAdd = () => {
    addToCart(product, quantity)
    showToast({
      title: 'Added to basket',
      description:
        quantity > 1 ? `${quantity} × ${product.name}` : product.name,
      actionLabel: 'View basket →',
      actionTo: '/cart',
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="container section">
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>
          {product.category}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="breadcrumb__current">{product.name}</span>
      </nav>

      <div className="detail">
        <ProductGallery product={product} onSale={onSale} />

        <div className="detail__info">
          <span className="card__category">{product.category}</span>
          <h1 className="detail__title">{product.name}</h1>

          <div className="detail__meta">
            <StarRating rating={product.rating} />
            <span className="card__brand">by {product.brand}</span>
            <span className="detail__sku">SKU: {product.sku}</span>
          </div>

          <div className="price price--lg">
            <span className="price__now">{formatPrice(product.price)}</span>
            {onSale && (
              <span className="price__old">{formatPrice(product.oldPrice)}</span>
            )}
            <span className="price__vat">inc. VAT</span>
          </div>

          <p className="detail__desc">{product.description}</p>

          <p className={`stock ${outOfStock ? 'stock--out' : 'stock--in'}`}>
            {outOfStock
              ? 'Out of stock'
              : product.stock <= 5
                ? `In stock — only ${product.stock} left`
                : 'In stock'}
          </p>

          <div className="detail__buy">
            <label className="qty">
              <span className="qty__label">Qty</span>
              <select
                className="input"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                disabled={outOfStock}
              >
                {Array.from({ length: Math.min(product.stock, 10) || 1 }, (_, i) => i + 1).map(
                  (n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ),
                )}
              </select>
            </label>

            <button
              className="btn btn--primary btn--lg"
              onClick={handleAdd}
              disabled={outOfStock}
            >
              {added ? '✓ Added to basket' : 'Add to basket'}
            </button>
            <button
              className="btn btn--ghost btn--lg"
              onClick={() => {
                addToCart(product, quantity)
                navigate('/cart')
              }}
              disabled={outOfStock}
            >
              Buy now
            </button>
          </div>

          <div className="specs">
            <h2 className="specs__title">Specification</h2>
            <dl className="specs__list">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="specs__row">
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <h2 className="section__title">You might also like</h2>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
