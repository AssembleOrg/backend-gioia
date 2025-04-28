import { Product } from 'src/product/product.entity';

export function addSlug(product: Partial<Product>) {
  const nameWithoutSpaces = product.name.replace(/ /g, '-');

  return {
    ...product,
    slug: nameWithoutSpaces,
  };
}
