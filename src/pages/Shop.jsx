import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import products from '../data/products.json'
import ProductCard from '../components/ProductCard.jsx'

const CATEGORIES = ['All', 'Engines', 'Engine Parts', 'Alloy Wheels', 'Car Parts']

const SORTS = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  rating: 'Top rated',
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'All'
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')

  const setCategory = (category) => {
    if (category === 'All') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', category)
    }
    setSearchParams(searchParams, { replace: true })
  }

  const visible = useMemo(() => {
    let list = products.slice()

    if (activeCategory !== 'All') {
      list = list.filter((p) => p.category === activeCategory)
    }

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    }

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        list.sort((a, b) => b.rating - a.rating)
        break
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured))
    }

    return list
  }, [activeCategory, query, sort])

  return (
    <div className="container section">
      <header className="shop__header">
        <h1 className="page-title">Shop</h1>
        <p className="page-subtitle">
          Browse our full range of engines, parts and alloy wheels.
        </p>
      </header>

      <div className="shop__toolbar">
        <div className="chips" role="tablist" aria-label="Filter by category">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`chip ${activeCategory === c ? 'chip--active' : ''}`}
              onClick={() => setCategory(c)}
              role="tab"
              aria-selected={activeCategory === c}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="shop__controls">
          <input
            type="search"
            className="input"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
          <select
            className="input"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
          >
            {Object.entries(SORTS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="shop__count">
        {visible.length} {visible.length === 1 ? 'product' : 'products'}
      </p>

      {visible.length === 0 ? (
        <div className="empty">
          <p>No products match your search.</p>
        </div>
      ) : (
        <div className="product-grid">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
