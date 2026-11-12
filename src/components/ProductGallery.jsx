import { useState } from 'react'
import Thumbnail from './Thumbnail.jsx'
import { getProductImages } from '../utils/images.js'

export default function ProductGallery({ product, onSale }) {
  const images = getProductImages(product)
  const [selected, setSelected] = useState(0)
  const hasMultiple = images.length > 1

  return (
    <div className="gallery">
      <div className="detail__media gallery__main">
        <Thumbnail
          product={product}
          src={images[selected]}
          className="detail__image"
        />
        {onSale && <span className="badge badge--sale">Sale</span>}
      </div>

      {hasMultiple && (
        <div
          className="gallery__thumbs"
          role="tablist"
          aria-label="Product images"
        >
          {images.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === selected}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              className={`gallery__thumb ${i === selected ? 'is-active' : ''}`}
              onClick={() => setSelected(i)}
            >
              <Thumbnail
                product={product}
                src={img}
                className="gallery__thumb-img"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
