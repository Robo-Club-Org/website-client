import Link from "next/link";
import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";

export const metadata: Metadata = {
  title: "Product Categories | RoboClub",
  description: "Explore our wide range of product categories including microcontrollers, sensors, robotics kits, and more at RoboClub.",
  keywords: "electronics categories, robotics categories, Arduino, Raspberry Pi, sensors, Sri Lanka, development boards",
  alternates: {
    canonical: '/categories',
  },
  openGraph: {
    title: "Product Categories | RoboClub",
    description: "Explore our wide range of product categories including microcontrollers, sensors, robotics kits, and more.",
    url: 'https://roboclub-client-938d32cbf571.herokuapp.com/categories',
    siteName: 'RoboClub',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Product Categories | RoboClub",
    description: "Explore our wide range of product categories at RoboClub Sri Lanka.",
  }
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

async function getCategories(): Promise<Category[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${base}/products/categories`, { cache: "force-cache" });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
  } catch (e) {
    console.error("Categories load error:", e);
    return [];
  }
}

export default async function Categories() {
  const categories = await getCategories();

  return (
    <>
      <BreadcrumbJsonLd 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Categories', url: '/categories' }
        ]}
      />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Product
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Categories</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Explore our wide range of categories including microcontrollers, sensors, robotics kits, and more.
            </p>

            <div className="bg-white/90 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-sm">
              {categories.length === 0 ? (
                <p className="text-blue-900/80">No categories available right now.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${encodeURIComponent(cat.slug)}`}
                      className="group block rounded-xl border border-blue-100 bg-white/80 hover:bg-white hover:shadow-lg transition overflow-hidden"
                    >
                      <div className="p-5">
                        <h3 className="font-semibold text-blue-900 group-hover:text-blue-700 truncate">{cat.name}</h3>
                        <p className="text-xs text-blue-800/60 mt-1">/{cat.slug}</p>
                      </div>
                      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
