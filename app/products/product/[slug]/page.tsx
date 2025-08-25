import { notFound } from "next/navigation"
import { Metadata } from "next"
import { ProductDetailContent } from "@/components/product-detail-content"
import { getProductBySlug, getProducts } from "@/lib/api"
import { slugify } from "@/lib/utils"
import { ProductJsonLd } from "@/components/product-jsonld"
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld"
import Breadcrumb from "@/components/breadcrumb"
import { generateProductMeta } from "./generateProductMeta"
import { getProductPageBreadcrumbs, getBreadcrumbJsonLdItems } from "@/lib/breadcrumbs"

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
  
  return generateProductMeta(product)
}

// Always serve fresh product page to reflect latest stock levels
export const dynamic = 'force-dynamic'
export const revalidate = 0

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
  const breadcrumbItems = getProductPageBreadcrumbs(
    product.name,
    params.slug,
    categoryName,
    // pass undefined slug, we now build links using the category name
    undefined
  )

  return (
    <>
      <ProductJsonLd 
        product={enhancedProduct} 
        url={`https://roboclub.lk${productUrl}`} 
      />
      <BreadcrumbJsonLd 
        items={getBreadcrumbJsonLdItems(breadcrumbItems)} 
      />
      <ProductDetailContent 
        product={enhancedProduct} 
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
      />
    </>
  )
}
