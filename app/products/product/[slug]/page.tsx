import { notFound } from "next/navigation"
import { Metadata } from "next"
import { ProductDetailContent } from "@/components/product-detail-content"
import { getProductBySlug, getProducts } from "@/lib/api"
import { slugify } from "@/lib/utils"
import { ProductJsonLd } from "@/components/product-jsonld"
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found."
    }
  }

  const imageUrl = (product.imageUrls && product.imageUrls[0]) || product.imageUrl || "/placeholder.svg"
  const absoluteImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `https://roboclub-client-938d32cbf571.herokuapp.com${imageUrl}`

  return {
    title: `${product.name} | RoboClub`,
    description: product.description || `Buy ${product.name} online at RoboClub, Sri Lanka's premium electronics store. ${product.brand?.name ? `Made by ${product.brand.name}.` : ''}`,
    keywords: `${product.name}, ${product.category?.name || 'electronics'}, ${product.brand?.name || ''}, buy online, Sri Lanka, RoboClub`,
    alternates: {
      canonical: `/products/product/${params.slug}`,
    },
    openGraph: {
      title: `${product.name} | RoboClub`,
      description: product.description || `Buy ${product.name} online at RoboClub, Sri Lanka's premium electronics store.`,
      url: `https://roboclub-client-938d32cbf571.herokuapp.com/products/product/${params.slug}`,
      images: [
        {
          url: absoluteImageUrl,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: 'website',
      siteName: 'RoboClub',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | RoboClub`,
      description: product.description?.substring(0, 200) || `Buy ${product.name} online at RoboClub`,
      images: [absoluteImageUrl],
    },
    other: {
      'product:price:amount': product.price?.toString() || '',
      'product:price:currency': 'LKR',
      'product:availability': product.stockQuantity > 0 ? 'in stock' : 'out of stock',
    }
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return notFound()
  }

  // Add mock data for compatibility with the detail page component
  const enhancedProduct = {
    ...product,
    rating: product.rating || 4.8,
    reviews: product.reviews || 120,
    inStock: product.stockQuantity > 0,
    image: (product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : null) || product.imageUrl || "/placeholder.svg",
    longDescription: product.description,
    specifications: product.specifications || {
      "Type": "Electronic Component",
      "Brand": product.brand?.name || "Generic",
      "SKU": product.sku || "Unknown",
    },
  category: product.category?.name || "Uncategorized",
    brand: product.brand?.name || "Generic",
  itemCode: (product as any).itemCode || undefined,
  }

  const productUrl = `/products/product/${params.slug}`
  const categoryName = product.category?.name || "Uncategorized"
  const categoryUrl = `/categories?category=${encodeURIComponent(categoryName.toLowerCase())}`

  return (
    <>
      <ProductJsonLd 
        product={enhancedProduct} 
        url={`https://roboclub-client-938d32cbf571.herokuapp.com${productUrl}`} 
      />
      <BreadcrumbJsonLd 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: categoryName, url: categoryUrl },
          { name: product.name, url: productUrl }
        ]} 
      />
      <ProductDetailContent product={enhancedProduct} />
    </>
  )
}
