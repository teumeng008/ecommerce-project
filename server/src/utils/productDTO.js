/**
 * Transform a product database record into a clean API response
 * Excludes internal fields like createdAt, updatedAt
 */
export const productToDTO = (product, includeCategory = false) => {
  if (!product) return null;

  const dto = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    stock: product.stock,
    thumbnail: product.thumbnail,
    isActive: product.isActive,
  };

  if (includeCategory && product.category) {
    dto.category = {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    };
  }

  return dto;
};

/**
 * Transform array of products
 */
export const productsToDTO = (products, includeCategory = false) => {
  return products.map(product => productToDTO(product, includeCategory));
};
