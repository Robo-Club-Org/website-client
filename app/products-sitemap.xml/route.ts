import { getProducts } from "@/lib/api";

export async function GET() {
  const baseUrl = 'https://roboclub.lk';
  
  try {
    // Fetch all products
    const products = await getProducts();
    
    // Generate sitemap XML with product entries
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${products.map(product => {
    const slug = product.slug || product.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || product.id;
    const imageUrl = (product.imageUrls && product.imageUrls[0]) || product.imageUrl || "/placeholder.svg";
    const absoluteImageUrl = imageUrl.startsWith('http') 
      ? imageUrl 
      : `${baseUrl}${imageUrl}`;
  const lastmod = product.updatedAt || product.createdAt || new Date().toISOString();
    
    return `<url>
    <loc>${baseUrl}/products/product/${slug}</loc>
  <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${absoluteImageUrl}</image:loc>
      <image:title>${product.name || 'Product'}</image:title>
      <image:caption>${product.description ? product.description.substring(0, 150) : 'Buy electronics and robotics components online at RoboClub Sri Lanka'}</image:caption>
    </image:image>
  </url>`;
  }).join('\n  ')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating product sitemap:', error);
    
    // Return an empty sitemap if there's an error
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
}
