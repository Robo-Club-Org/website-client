import { getProducts, getCategories, getBrands } from '@/lib/api'
import { slugify } from '@/lib/utils'

function generateSiteMap(
  products: any[],
  categories: any[],
  brands: any[]
) {
  const baseUrl = 'https://roboclub-client-938d32cbf571.herokuapp.com'

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Static pages -->
     <url>
       <loc>${baseUrl}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${baseUrl}/products</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>${baseUrl}/used-products</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>${baseUrl}/categories</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${baseUrl}/brands</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${baseUrl}/contact-us</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
     </url>
     <url>
       <loc>${baseUrl}/help-center</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
     </url>
     <url>
       <loc>${baseUrl}/shipping-info</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
     </url>
     <url>
       <loc>${baseUrl}/returns</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
     </url>
     
     <!-- Product pages -->
     ${products
       .map(({ slug, updatedAt }) => {
         return `
       <url>
           <loc>${baseUrl}/products/product/${slug}</loc>
           <lastmod>${new Date(updatedAt).toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.9</priority>
       </url>
     `;
       })
       .join('')}
     
     <!-- Category pages -->
     ${categories
       .map(({ name }) => {
         const encodedName = encodeURIComponent(name.toLowerCase())
         return `
       <url>
           <loc>${baseUrl}/categories?category=${encodedName}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}
     
     <!-- Brand pages -->
     ${brands
       .map(({ name }) => {
         const encodedName = encodeURIComponent(name.toLowerCase())
         return `
       <url>
           <loc>${baseUrl}/brands?brand=${encodedName}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export async function GET() {
  // Fetch all products, categories, and brands
  const products = await getProducts() || []
  const categories = await getCategories() || []
  const brands = await getBrands() || []
  
  // Ensure products have slug
  const productsWithSlug = products.map((product: any) => {
    if (!product.slug) {
      product.slug = slugify(product.name)
    }
    return product
  })
  
  // Generate the XML sitemap
  const sitemap = generateSiteMap(productsWithSlug, categories, brands)

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}
