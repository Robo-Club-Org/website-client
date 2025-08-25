import type { Metadata } from "next";
import { Product } from "@/lib/api";
import { getRelevantKeywords } from "@/lib/product-keywords";

export function generateProductMeta(product: Product): Metadata {
  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found."
    };
  }

  const imageUrl = (product.imageUrls && product.imageUrls[0]) || product.imageUrl || "/placeholder.svg";
  const absoluteImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `https://roboclub.lk${imageUrl}`;

  // Create a product-specific structured data
  const slug = product.slug || product.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || product.id;
  const productUrl = `https://roboclub.lk/products/product/${slug}`;
  
  // Create a meaningful description including product details
  const brandInfo = product.brand?.name ? `by ${product.brand.name}` : '';
  const categoryInfo = product.category?.name ? `in ${product.category.name}` : '';
  const stockInfo = product.stockQuantity > 0 ? 'In stock' : 'Limited stock';
  const priceInfo = `LKR ${product.price.toLocaleString()}`;
  
  const shortDescription = product.description 
    ? product.description.substring(0, 150) + (product.description.length > 150 ? '...' : '')
    : '';
  
  const metaDescription = `${product.name} ${brandInfo} ${categoryInfo}. ${shortDescription} ${stockInfo}, ${priceInfo}. Buy online in Sri Lanka from RoboClub.`.trim();
  
  // Get relevant keywords for this product
  const seoKeywords = getRelevantKeywords(
    product.name, 
    product.category?.name || undefined
  ).join(', ');
  
  // Title optimized for queries like "<Product> price in Sri Lanka"
  const titlePrice = product.price ? ` | ${priceInfo}` : '';

  return {
    title: `${product.name} Price in Sri Lanka${titlePrice} | Buy Online | RoboClub`,
    description: metaDescription,
    keywords: seoKeywords,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} Price in Sri Lanka${titlePrice} | RoboClub`,
      description: metaDescription,
      url: productUrl,
      images: [
        {
          url: absoluteImageUrl,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: 'website', // Next.js metadata doesn't support 'product' type directly
      siteName: 'RoboClub',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
  title: `${product.name} Price in Sri Lanka${titlePrice} | RoboClub`,
      description: metaDescription.substring(0, 200),
      images: [absoluteImageUrl],
    },
    other: {
      'product:price:amount': product.price?.toString() || '',
      'product:price:currency': 'LKR',
      'product:availability': product.stockQuantity > 0 ? 'in stock' : 'out of stock',
      'product:brand': product.brand?.name || '',
      'product:condition': 'new',
      'product:retailer_item_id': product.itemCode || product.sku || '',
    }
  };
}
