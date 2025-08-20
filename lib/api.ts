import { slugify } from "./utils";

export interface Product {
  id: string;
  name: string;
  slug?: string;  // Added slug field
  description: string;
  datasheetUrl?: string;
  imageUrls: string[];
  imageUrl?: string;
  sku: string;
  itemCode: string;
  price: number;
  buyingPrice: number;
  stockQuantity: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  brand?: {
    id: string;
    name: string;
    slug: string;
  };
  // Single category per product
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  // Mock product fields for compatibility
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  longDescription?: string;
  specifications?: Record<string, string>;
}

// Base URL for your backend API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://roboclub-server-70e29f041ab3.herokuapp.com";

// Utility function for authenticated fetch requests
export async function authenticatedFetch(url: string, options?: RequestInit) {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle token expiration or invalid token
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optionally redirect to login page
      window.location.href = "/login";
    }
    throw new Error(response.statusText);
  }

  return response.json();
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);

    if (!response.ok) {
      console.error('Failed to fetch products:', response.statusText);
      return [];
    }

    const raw = await response.json();

    // Normalize to a single category field while keeping other fields safe
    const normalized: Product[] = Array.isArray(raw)
      ? raw.map((p: any) => {
          const firstCat = p.category || p.categories?.[0]?.category || p.categories?.[0] || null;
          const imageUrls = Array.isArray(p.imageUrls) && p.imageUrls.length > 0
            ? p.imageUrls
            : [p.imageUrl || p.image || "/placeholder.svg"];
          return {
            id: p.id?.toString(),
            name: p.name || "",
            slug: p.slug || undefined,
            description: p.description || "",
            datasheetUrl: p.datasheetUrl || undefined,
            imageUrls,
            imageUrl: p.imageUrl || p.image || undefined,
            sku: p.sku || "",
            itemCode: p.itemCode || "",
            price: typeof p.price === "number" ? p.price : parseFloat(p.price) || 0,
            buyingPrice: typeof p.buyingPrice === "number" ? p.buyingPrice : parseFloat(p.buyingPrice) || 0,
            stockQuantity: p.stockQuantity ?? p.stock ?? 0,
            isFeatured: Boolean(p.isFeatured),
            createdAt: p.createdAt || new Date().toISOString(),
            updatedAt: p.updatedAt || new Date().toISOString(),
            brand: p.brand ? {
              id: p.brand.id?.toString(),
              name: p.brand.name,
              slug: p.brand.slug || (p.brand.name || "").toLowerCase().replace(/\s+/g, "-")
            } : undefined,
            category: firstCat ? {
              id: firstCat.id?.toString(),
              name: firstCat.name,
              slug: firstCat.slug || (firstCat.name || "").toLowerCase().replace(/\s+/g, "-")
            } : undefined,
          } as Product;
        })
      : [];

    return normalized;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);

    if (!response.ok) {
      console.error('Failed to fetch product:', response.statusText);
      return null;
    }

    const p = await response.json();
    const firstCat = p.category || p.categories?.[0]?.category || p.categories?.[0] || null;
    const imageUrls = Array.isArray(p.imageUrls) && p.imageUrls.length > 0
      ? p.imageUrls
      : [p.imageUrl || p.image || "/placeholder.svg"];

    const normalized: Product = {
      id: p.id?.toString(),
      name: p.name || "",
      slug: p.slug || undefined,
      description: p.description || "",
      datasheetUrl: p.datasheetUrl || undefined,
      imageUrls,
      imageUrl: p.imageUrl || p.image || undefined,
      sku: p.sku || "",
  itemCode: p.itemCode || "",
      price: typeof p.price === "number" ? p.price : parseFloat(p.price) || 0,
      buyingPrice: typeof p.buyingPrice === "number" ? p.buyingPrice : parseFloat(p.buyingPrice) || 0,
      stockQuantity: p.stockQuantity ?? p.stock ?? 0,
      isFeatured: Boolean(p.isFeatured),
      createdAt: p.createdAt || new Date().toISOString(),
      updatedAt: p.updatedAt || new Date().toISOString(),
      brand: p.brand ? {
        id: p.brand.id?.toString(),
        name: p.brand.name,
        slug: p.brand.slug || (p.brand.name || "").toLowerCase().replace(/\s+/g, "-")
      } : undefined,
      category: firstCat ? {
        id: firstCat.id?.toString(),
        name: firstCat.name,
        slug: firstCat.slug || (firstCat.name || "").toLowerCase().replace(/\s+/g, "-")
      } : undefined,
    };

    return normalized;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/product/${slug}`);
    if (!response.ok) return null;

    const p = await response.json();
    const firstCat = p.category || p.categories?.[0]?.category || p.categories?.[0] || null;
    const imageUrls = Array.isArray(p.imageUrls) && p.imageUrls.length > 0
      ? p.imageUrls
      : [p.imageUrl || p.image || "/placeholder.svg"];

    const normalized: Product = {
      id: p.id?.toString(),
      name: p.name || "",
      slug: p.slug || undefined,
      description: p.description || "",
      datasheetUrl: p.datasheetUrl || undefined,
      imageUrls,
      imageUrl: p.imageUrl || p.image || undefined,
      sku: p.sku || "",
  itemCode: p.itemCode || "",
      price: typeof p.price === "number" ? p.price : parseFloat(p.price) || 0,
      buyingPrice: typeof p.buyingPrice === "number" ? p.buyingPrice : parseFloat(p.buyingPrice) || 0,
      stockQuantity: p.stockQuantity ?? p.stock ?? 0,
      isFeatured: Boolean(p.isFeatured),
      createdAt: p.createdAt || new Date().toISOString(),
      updatedAt: p.updatedAt || new Date().toISOString(),
      brand: p.brand ? {
        id: p.brand.id?.toString(),
        name: p.brand.name,
        slug: p.brand.slug || (p.brand.name || "").toLowerCase().replace(/\s+/g, "-")
      } : undefined,
      category: firstCat ? {
        id: firstCat.id?.toString(),
        name: firstCat.name,
        slug: firstCat.slug || (firstCat.name || "").toLowerCase().replace(/\s+/g, "-")
      } : undefined,
    };

    return normalized;
  }
  catch (error) {
    console.error('Failed to fetch product by slug:', error);
    return null;
  }
}

// Example of using authenticatedFetch for a protected route
export async function getProtectedData() {
  try {
    const data = await authenticatedFetch("/protected");
    console.log("Protected data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching protected data:", error);
    throw error;
  }
}
