import { Link } from 'react-router-dom'
import Thumbnail from './Thumbnail.jsx'
import StarRating from './StarRating.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { formatPrice } from '../utils/format.js'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const onSale = product.oldPrice && product.oldPrice > product.price
  const outOfStock = product.stock <= 0

  const handleAdd = () => {
    addToCart(product, 1)
    showToast({
      title: 'Added to basket',
      description: product.name,
      actionLabel: 'View basket →',
      actionTo: '/cart',
    })
  }

  return (
    <article className="card">
      <Link to={`/product/${product.id}`} className="card__media">
        <Thumbnail product={product} className="card__image" />
        {onSale && <span className="badge badge--sale">Sale</span>}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="badge badge--low">Only {product.stock} left</span>
        )}
      </Link>

      <div className="card__body">
        <span className="card__category">{product.category}</span>
        <h3 className="card__title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="card__meta">
          <StarRating rating={product.rating} />
          <span className="card__brand">{product.brand}</span>
        </div>

        <div className="card__footer">
          <div className="price">
            <span className="price__now">{formatPrice(product.price)}</span>
            {onSale && (
              <span className="price__old">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
          <button
            className="btn btn--primary btn--sm"
            onClick={handleAdd}
            disabled={outOfStock}
          >
            {outOfStock ? 'Sold out' : 'Add'}
          </button>
        </div>
      </div>
    </article>
  )
}
