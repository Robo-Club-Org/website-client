"use client"
import { useEffect, useState } from 'react'
import { Navigation } from "@/components/home/Navigation"
import { Footer } from "@/components/home/Footer"
import { ProductsGrid } from "@/components/products/ProductsGrid"
import { ProductsEmptyState } from "@/components/products/ProductsEmptyState"
import SearchFiltersBar from "@/components/SearchFiltersBar"
import { useProductSearch } from "@/hooks/useProductSearch"
import Pagination from "@/components/Pagination"
import { UsedProductsJsonLd } from '@/components/used-products-jsonld'
import { BreadcrumbJsonLd } from '@/components/breadcrumb-jsonld'

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  isFeatured?: boolean;
  isUsed?: boolean; // ✅ include isUsed
  createdAt: string;
  updatedAt: string;
  itemCode?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function UsedProductsPage() {
  const [usedProducts, setUsedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use our search hook
  const {
    paginatedResults,
    suggestions,
    filters,
    pagination,
    updateFilter,
    goToPage,
    resetFilters
  } = useProductSearch(usedProducts, 30)

  // Fetch only used products
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://roboclub-server-70e29f041ab3.herokuapp.com';
        // Fetch all products
        const productsRes = await fetch(`${apiBaseUrl}/products`);
        if (!productsRes.ok) throw new Error(`Products API error: ${productsRes.status}`);
        const rawProductsData = await productsRes.json();

        // Adapt and filter used products
        const productsData: Product[] = Array.isArray(rawProductsData) 
          ? rawProductsData
              .map(p => ({
                id: p.id?.toString() || '',
                name: p.name || '',
                description: p.description || '',
                price: typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0,
                stockQuantity: p.stockQuantity || p.stock || 0,
                imageUrl: p.imageUrl || p.image || '/placeholder.svg',
                isFeatured: Boolean(p.isFeatured),
                isUsed: Boolean(p.isUsed), // ✅ map isUsed
                createdAt: p.createdAt || new Date().toISOString(),
                updatedAt: p.updatedAt || new Date().toISOString(),
                itemCode: p.itemCode || '',
                category: (p.category || p.categories?.[0]?.category || p.categories?.[0]) ? {
                  id: (p.category?.id || p.categories?.[0]?.category?.id || p.categories?.[0]?.id || '').toString(),
                  name: p.category?.name || p.categories?.[0]?.category?.name || p.categories?.[0]?.name || '',
                  slug: p.category?.slug || p.categories?.[0]?.category?.slug || p.categories?.[0]?.slug || (p.category?.name || p.categories?.[0]?.category?.name || p.categories?.[0]?.name || '').toLowerCase().replace(/\s+/g, '-')
                } : undefined
              }))
              .filter(p => p.isUsed) // ✅ only keep used products
          : [];
        
        setUsedProducts(productsData);

        // Fetch categories
        const categoriesRes = await fetch(`${apiBaseUrl}/categories`);
        if (categoriesRes.ok) {
          const rawCategoriesData = await categoriesRes.json();
          const categoriesData: Category[] = Array.isArray(rawCategoriesData)
            ? rawCategoriesData.map(c => ({
                id: c.id?.toString() || '',
                name: c.name || '',
                slug: c.slug || c.name?.toLowerCase().replace(/\s+/g, '-') || ''
              }))
            : [];
          setCategories(categoriesData);
        }

      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (key: string, value: any) => {
    updateFilter(key as keyof typeof filters, value);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Error Loading Used Products</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <UsedProductsJsonLd />
      <BreadcrumbJsonLd 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Used Products', url: '/used-products' }
        ]}
      />
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Used Electronics & Robotics Products</h1>
          <p className="text-gray-600 max-w-3xl">
            Browse our collection of second-hand robotics components, development boards, and electronic equipment at discounted prices. 
            All used products are thoroughly tested by our technicians to ensure quality and reliability.
          </p>
        </div>

        {/* Search and Filters */}
        <SearchFiltersBar
          filters={filters}
          availableFilters={{
            categories: categories.map(cat => cat.name),
          }}
          suggestions={suggestions.map(s => ({ type: s.type, text: s.text }))}
          onFilterChange={handleFilterChange}
          onResetFilters={resetFilters}
          totalResults={pagination.totalItems}
        />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading used products...</p>
            </div>
          </div>
        ) : paginatedResults.length > 0 ? (
          <>
            {/* Products Grid */}
            <ProductsGrid 
              products={paginatedResults.map(product => ({
                ...product,
                description: product.description || "",
                imageUrls: [product.imageUrl || '/placeholder.svg']
              }))} 
              viewMode="grid" 
            />
            
            {/* Pagination */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={goToPage}
              startItem={pagination.startItem}
              endItem={pagination.endItem}
              totalItems={pagination.totalItems}
            />
            
            {/* SEO-friendly product category descriptions */}
            <section className="mt-16 mb-8 bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">About Our Used Products</h2>
              <div className="prose max-w-none text-gray-600">
                <p>
                  At RoboClub, we offer a wide range of pre-owned and refurbished electronics and robotics components 
                  at discounted prices. Each item undergoes thorough testing by our experienced technicians to ensure 
                  functionality and reliability.
                </p>
                <p className="mt-3">
                  Our collection includes used Arduino boards, Raspberry Pi computers, sensors, motors, electronic components, 
                  development kits, and other maker supplies. Whether you're a hobbyist, student, or professional looking for 
                  cost-effective solutions, our used products provide excellent value without compromising on quality.
                </p>
                <p className="mt-3">
                  All used products come with a 14-day warranty and have been tested to meet our quality standards. 
                  Shop with confidence knowing that each pre-owned item has been carefully inspected before being listed for sale.
                </p>
              </div>
            </section>
          </>
        ) : (
          <ProductsEmptyState 
            setSearchQuery={(value) => handleFilterChange('query', value)}
            setSelectedCategory={(value) => handleFilterChange('category', value)}
            setSelectedBrand={(value) => handleFilterChange('brand', value)}
            setPriceRange={(value) => {
              handleFilterChange('minPrice', value[0]);
              handleFilterChange('maxPrice', value[1]);
            }}
          />
        )}
      </main>
      
      {/* FAQ Section for SEO */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto grid gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">How do you determine the condition of used products?</h3>
              <p className="text-gray-600">
                Each used product undergoes a thorough inspection and testing process by our technicians. 
                We verify all core functionalities and rate products based on their condition, performance, 
                and cosmetic appearance. Only products that meet our quality standards are listed for sale.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Do used products come with a warranty?</h3>
              <p className="text-gray-600">
                Yes, all used products from RoboClub come with a 14-day warranty. If any product malfunctions 
                or doesn't perform as described within this period, we'll replace it or provide a full refund.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">How much can I save by purchasing used products?</h3>
              <p className="text-gray-600">
                Our used products typically offer 30-70% savings compared to their brand new counterparts, 
                depending on condition, age, and original retail price. Each listing clearly shows the 
                original price and your savings.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Can I sell my used electronics to RoboClub?</h3>
              <p className="text-gray-600">
                Yes! We have a buy-back program for quality used electronics and robotics components. 
                Contact our team at info@roboclub.lk with details and photos of your items, and we'll 
                provide an evaluation and quote for purchasing your used equipment.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}
