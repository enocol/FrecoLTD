// Resolve the list of images for a product.
// Supports either a single `image` string or an `images` array,
// so products can have one or many photos. Returns [] when neither
// is set (the UI then shows the generated placeholder).

export function getProductImages(product) {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images.filter(Boolean)
  }
  if (product.image) return [product.image]
  return []
}
