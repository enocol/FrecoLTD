export default function StarRating({ rating = 0, showValue = true }) {
  const rounded = Math.round(rating * 2) / 2
  const stars = [1, 2, 3, 4, 5].map((n) => {
    if (rounded >= n) return 'full'
    if (rounded >= n - 0.5) return 'half'
    return 'empty'
  })

  return (
    <span className="stars" aria-label={`Rated ${rating} out of 5`}>
      {stars.map((type, i) => (
        <span key={i} className={`star star--${type}`} aria-hidden="true">
          ★
        </span>
      ))}
      {showValue && <span className="stars__value">{rating.toFixed(1)}</span>}
    </span>
  )
}
