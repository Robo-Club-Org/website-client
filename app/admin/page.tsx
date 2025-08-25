"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, BarChart3, Package, Users, DollarSign, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import Link from "next/link"
import { authenticatedFetch, API_BASE_URL } from "@/lib/api"

// Replace mock data with types and API-backed state
interface UIProduct {
  id: string
  name: string
  price: number
  image: string
  category?: string
  description: string
  stock: number
  itemCode?: string
  isFeatured?: boolean
  isUsed?: boolean
}

interface UIOrder {
  id: string
  customer: string
  date: string
  status: string
  total: number
  trackingNumber?: string | null
}

interface UICategory {
  id: string
  name: string
  slug: string
  productCount?: number
}

interface UIProject {
  id: string
  name: string
  description: string
  imageUrls: string[]
  projectUrl?: string
  technologiesUsed: string[]
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export default function AdminPage() {
  const [products, setProducts] = useState<UIProduct[]>([])
  const [orders, setOrders] = useState<UIOrder[]>([])
  const [categories, setCategories] = useState<UICategory[]>([])
  const [projects, setProjects] = useState<UIProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search state
  const [productSearch, setProductSearch] = useState("")
  const [orderSearch, setOrderSearch] = useState("")
  const [projectSearch, setProjectSearch] = useState("")

  const [editingProduct, setEditingProduct] = useState<UIProduct | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    categoryId: "",
    description: "",
    stock: "",
    image: "",
    itemCode: "", // required by backend
  isFeatured: false,
  isUsed: false,
  })

  // Categories form state
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)

  // Project form state
  const [editingProject, setEditingProject] = useState<UIProject | null>(null)
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    imageUrls: [""],
    projectUrl: "",
    technologiesUsed: "",
    displayOrder: "0"
  })

  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  })

  // Helper: fetch products
  const fetchProducts = async (search?: string) => {
    const qs = search && search.length > 0 ? `&search=${encodeURIComponent(search)}` : ""
    const prodRes = await authenticatedFetch(`/admin/products?limit=50${qs}`)
    const uiProducts: UIProduct[] = (prodRes?.products ?? prodRes ?? []).map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: (Array.isArray(p.imageUrls) && p.imageUrls[0]) || "/placeholder.svg",
      category: p.categories?.[0]?.category?.name,
      description: p.description ?? "",
  stock: p.stockQuantity ?? 0,
  itemCode: p.itemCode || "",
      isFeatured: Boolean(p.isFeatured),
      isUsed: Boolean(p.isUsed),
    }))
    setProducts(uiProducts)
  }

  // Helper: fetch orders
  const fetchOrders = async (search?: string) => {
    const qs = search && search.length > 0 ? `&search=${encodeURIComponent(search)}` : ""
    const ordRes = await authenticatedFetch(`/admin/orders?limit=20${qs}`)
    const uiOrders: UIOrder[] = (ordRes?.orders ?? ordRes ?? []).map((o: any) => ({
      id: o.id,
      customer: o.user?.name || o.user?.email || "Customer",
      date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "",
      status: o.status,
      total: o.totalAmount ?? 0,
      trackingNumber: o.trackingNumber ?? null,
    }))
    setOrders(uiOrders)
  }

  // Helper: fetch categories (admin view)
  const fetchCategories = async () => {
    const res = await authenticatedFetch(`/admin/categories`)
    const uiCats: UICategory[] = (res ?? []).map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      productCount: c._count?.products ?? 0,
    }))
    setCategories(uiCats)
  }

  // Helper: fetch projects
  const fetchProjects = async (search?: string) => {
    try {
      console.log("Fetching projects with search:", search);
      const qs = search && search.length > 0 ? `?search=${encodeURIComponent(search)}` : ""
      const res = await authenticatedFetch(`/admin/projects${qs}`)
      console.log("Projects API response:", res);
      
      // Handle all possible response formats
      let projectsArray = [];
      
      // Check response format to extract projects array
      if (Array.isArray(res)) {
        // Direct array response
        projectsArray = res;
      } else if (res && typeof res === 'object') {
        // Check different possible properties
        if (Array.isArray(res.projects)) {
          // {projects: [...]} format
          projectsArray = res.projects;
        } else if (Array.isArray(res.directArray)) {
          // Our special debug format
          projectsArray = res.directArray;
        } else if (res.data && Array.isArray(res.data)) {
          // {data: [...]} format
          projectsArray = res.data;
        } else {
          // Try to find any array property in the response
          const arrayProps = Object.entries(res)
            .find(([_, value]) => Array.isArray(value) && value.length > 0);
          
          if (arrayProps) {
            projectsArray = arrayProps[1] as any[];
          }
        }
      }
      
      console.log("Extracted projects array:", projectsArray);
      
      const uiProjects: UIProject[] = (projectsArray || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
        imageUrls: Array.isArray(p.imageUrls) ? p.imageUrls : [],
        projectUrl: p.projectUrl || "",
        technologiesUsed: Array.isArray(p.technologiesUsed) ? p.technologiesUsed : [],
        displayOrder: p.displayOrder || 0,
        createdAt: p.createdAt || "",
        updatedAt: p.updatedAt || "",
      }))
      console.log("Transformed projects:", uiProjects);
      setProjects(uiProjects)
    } catch (error) {
      console.error("Error fetching projects:", error)
      setProjects([])
    }
  }

  // Debounce product search
  useEffect(() => {
    const t = setTimeout(() => {
      const q = productSearch.trim()
      fetchProducts(q || undefined)
    }, 300)
    return () => clearTimeout(t)
  }, [productSearch])

  // Debounce order search
  useEffect(() => {
    const t = setTimeout(() => {
      const q = orderSearch.trim()
      fetchOrders(q || undefined)
    }, 300)
    return () => clearTimeout(t)
  }, [orderSearch])

  // Debounce project search
  useEffect(() => {
    const t = setTimeout(() => {
      const q = projectSearch.trim()
      fetchProjects(q || undefined)
    }, 300)
    return () => clearTimeout(t)
  }, [projectSearch])

  const handleAddProduct = () => {
    setEditingProduct(null)
    setProductForm({
      name: "",
      price: "",
      categoryId: "",
      description: "",
      stock: "",
      image: "",
      itemCode: "",
      isFeatured: false,
      isUsed: false,
    })
    setIsDialogOpen(true)
  }

  const handleAddProject = () => {
    setEditingProject(null)
    setProjectForm({
      name: "",
      description: "",
      imageUrls: [""],
      projectUrl: "",
      technologiesUsed: "",
      displayOrder: "0"
    })
    setIsProjectDialogOpen(true)
  }

  const handleEditProject = (project: UIProject) => {
    setEditingProject(project)
    setProjectForm({
      name: project.name,
      description: project.description || "",
      imageUrls: project.imageUrls.length ? project.imageUrls : [""],
      projectUrl: project.projectUrl || "",
      technologiesUsed: project.technologiesUsed.join(", "),
      displayOrder: project.displayOrder.toString()
    })
    setIsProjectDialogOpen(true)
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return
    
    try {
      await authenticatedFetch(`/admin/projects/${id}`, {
        method: "DELETE",
      })
      fetchProjects()
    } catch (error) {
      console.error("Failed to delete project:", error)
      alert("Failed to delete project")
    }
  }

  const handleSaveProject = async () => {
    if (!projectForm.name) {
      alert("Project name is required")
      return
    }

    try {
      const formData = {
        name: projectForm.name,
        description: projectForm.description,
        imageUrls: projectForm.imageUrls.filter(url => url.trim() !== ""),
        projectUrl: projectForm.projectUrl || undefined,
        technologiesUsed: projectForm.technologiesUsed
          .split(",")
          .map(tag => tag.trim())
          .filter(tag => tag !== ""),
        displayOrder: parseInt(projectForm.displayOrder) || 0
      }

      console.log("Saving project with data:", formData);
      
      let response;
      if (editingProject) {
        console.log(`Updating project with ID: ${editingProject.id}`);
        response = await authenticatedFetch(`/admin/projects/${editingProject.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
      } else {
        console.log("Creating new project");
        response = await authenticatedFetch(`/admin/projects`, {
          method: "POST",
          body: JSON.stringify(formData),
        });
      }
      
      console.log("Save project response:", response);
      setIsProjectDialogOpen(false)
      
      // Force a fresh fetch rather than relying on the response
      // This ensures we get the most up-to-date data regardless of API structure
      setTimeout(() => {
        fetchProjects()
      }, 500);
    } catch (error) {
      console.error("Failed to save project:", error)
      alert("Failed to save project")
    }
  }  // Load dashboard stats, products, and orders
  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true)
        setError(null)

        // Dashboard
        const dashboard = await authenticatedFetch("/admin")
        const totalOrders = dashboard?.counts?.orders ?? 0
        const totalProducts = dashboard?.counts?.products ?? 0
        const totalCustomers = dashboard?.counts?.users ?? 0
        const totalSales = Array.isArray(dashboard?.salesData)
          ? dashboard.salesData.reduce((sum: number, s: any) => sum + (s?._sum?.totalAmount ?? 0), 0)
          : 0
        setStats({ totalSales, totalOrders, totalProducts, totalCustomers })

        // Products
        const prodRes = await authenticatedFetch("/admin/products?limit=50")
        const uiProducts: UIProduct[] = (prodRes?.products ?? prodRes ?? []).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: (Array.isArray(p.imageUrls) && p.imageUrls[0]) || "/placeholder.svg",
          category: p.categories?.[0]?.category?.name,
          description: p.description ?? "",
          stock: p.stockQuantity ?? 0,
          itemCode: p.itemCode || "",
        }))
        setProducts(uiProducts)

        // Orders
        const ordRes = await authenticatedFetch("/admin/orders?limit=20")
        const uiOrders: UIOrder[] = (ordRes?.orders ?? ordRes ?? []).map((o: any) => ({
          id: o.id,
          customer: o.user?.name || o.user?.email || "Customer",
          date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "",
          status: o.status,
          total: o.totalAmount ?? 0,
          trackingNumber: o.trackingNumber ?? null,
        }))
        setOrders(uiOrders)

  // Categories
  await fetchCategories()
  
  // Projects
  try {
    await fetchProjects()
  } catch (projectError) {
    console.error("Failed to load projects:", projectError)
  }
      } catch (e: any) {
        console.error(e)
        setError(e?.message || "Failed to load admin data")
      } finally {
        setLoading(false)
      }
    }

    loadAll();
  }, [])


  const handleEditProduct = (product: UIProduct) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      price: product.price.toString(),
  categoryId: (categories.find((c) => c.name === (product.category || ""))?.id) || "",
      description: product.description,
      stock: product.stock.toString(),
      image: product.image,
  itemCode: product.itemCode || "",
  isFeatured: Boolean(product.isFeatured),
  isUsed: Boolean(product.isUsed),
    })
    setIsDialogOpen(true);
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload: any = {
      name: productForm.name,
      description: productForm.description,
      price: Number.parseFloat(productForm.price),
      stockQuantity: Number.parseInt(productForm.stock),
      imageUrls: productForm.image ? [productForm.image] : [],
  ...(productForm.categoryId ? { categories: [productForm.categoryId] } : {}),
  isFeatured: Boolean(productForm.isFeatured),
  isUsed: Boolean(productForm.isUsed),
    }

    try {
      if (editingProduct) {
        // Update
        const updatePayload = { ...payload } as any
        if (productForm.itemCode && productForm.itemCode.trim() !== "") {
          updatePayload.itemCode = productForm.itemCode.trim()
        }
        await authenticatedFetch(`/admin/products/${editingProduct.id}`, {
          method: "PUT",
          body: JSON.stringify(updatePayload),
        })
    } else {
        // Create requires itemCode
        await authenticatedFetch(`/admin/products`, {
      method: "POST",
      body: JSON.stringify({ ...payload, itemCode: productForm.itemCode || crypto.randomUUID().slice(0, 8) }),
        })
      }

      // Reload products
      const prodRes = await authenticatedFetch("/admin/products?limit=50")
        const uiProducts: UIProduct[] = (prodRes?.products ?? prodRes ?? []).map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: (Array.isArray(p.imageUrls) && p.imageUrls[0]) || "/placeholder.svg",
        category: p.categories?.[0]?.category?.name,
        description: p.description ?? "",
        stock: p.stockQuantity ?? 0,
          itemCode: p.itemCode || "",
          isFeatured: Boolean(p.isFeatured),
          isUsed: Boolean(p.isUsed),
      }))
      setProducts(uiProducts)
      setIsDialogOpen(false)
    } catch (err: any) {
      alert(err?.message || "Failed to save product")
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      await authenticatedFetch(`/admin/products/${id}`, { method: "DELETE" })
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err: any) {
      alert(err?.message || "Failed to delete product")
    }
  }

  const handleDeleteOrder = async (id: string) => {
    try {
      if (!confirm("Delete this order? Only CANCELLED orders can be deleted.")) return
      await authenticatedFetch(`/admin/orders/${id}`, { method: "DELETE" })
      // Refresh orders list
      await fetchOrders(orderSearch.trim() || undefined)
    } catch (err: any) {
      alert(err?.message || "Failed to delete order")
    }
  }

  const handleAddCategory = async () => {
    const name = newCategoryName.trim()
    if (!name) return
    try {
      await authenticatedFetch(`/admin/categories`, {
        method: "POST",
        body: JSON.stringify({ name }),
      })
      setNewCategoryName("")
      await fetchCategories()
    } catch (err: any) {
      alert(err?.message || "Failed to add category")
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      await authenticatedFetch(`/admin/categories/${id}`, { method: "DELETE" })
      setCategories((prev) => prev.filter((c) => c.id !== id))
    } catch (err: any) {
      alert(err?.message || "Failed to delete category")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-slate-600">Loading admin data…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-red-600">{error}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Image src="/roboclub-logo.png" alt="RoboClub Logo" width={32} height={32} className="object-contain w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                RoboClub Admin
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                View Store
              </Link>
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600">Manage your store and track performance</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Sales</p>
                  <p className="text-2xl font-bold text-slate-900">LKR {stats.totalSales.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Orders</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Products</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Customers</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Product Management</CardTitle>
                  <div className="flex items-center gap-2">
                    <Input
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search products..."
                      className="w-48 md:w-72"
                    />
                    {productSearch && (
                      <Button variant="outline" size="sm" onClick={() => setProductSearch("")}>Clear</Button>
                    )}
                    <Button onClick={handleAddProduct}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                    <Button variant="outline" onClick={() => setIsBulkDialogOpen(true)}>Upload CSV</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg"
                    >
                      <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="object-contain"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{product.name}</h3>
                        <p className="text-sm text-slate-600">{product.category || "Uncategorized"}</p>
                        <p className="text-sm text-slate-500">Stock: {product.stock}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-slate-900">LKR {product.price.toFixed(2)}</p>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Order Management</CardTitle>
                  <div className="flex items-center gap-2">
                    <Input
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search orders (ID, customer, email)..."
                      className="w-48 md:w-72"
                    />
                    {orderSearch && (
                      <Button variant="outline" size="sm" onClick={() => setOrderSearch("")}>Clear</Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-slate-200 rounded-lg p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">Order {order.id.slice(0, 8)}</h3>
                          <p className="text-sm text-slate-600">Customer: {order.customer}</p>
                          <p className="text-sm text-slate-600">Date: {order.date}</p>
                          {order.trackingNumber && (
                            <p className="text-sm text-slate-600">Tracking: {order.trackingNumber}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${order.status === "DELIVERED" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                            {order.status}
                          </span>
                          <span className="font-semibold text-lg">LKR {order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-2">
                        <Link href={`/admin/order-details?id=${order.id}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">View Details</Link>
                        {order.status === "CANCELLED" && (
                          <Button
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            Delete Order
                          </Button>
                        )}
                        {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                          <Button
                            variant="outline"
                            className="text-orange-600 border-orange-300 hover:bg-orange-50"
                            onClick={() => {
                              window.location.href = `/admin/order-details?id=${order.id}`;
                            }}
                          >
                            Cancel & Restock
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Categories</CardTitle>
                  <div className="flex items-center gap-2">
                    <Input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="New category name"
                      className="w-48 md:w-72"
                    />
                    <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <p className="text-slate-600">No categories yet.</p>
                ) : (
                  <div className="space-y-3">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div>
                          <p className="font-semibold text-slate-900">{cat.name}</p>
                          <p className="text-xs text-slate-600">/{cat.slug} {typeof cat.productCount === 'number' ? `• ${cat.productCount} products` : ''}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(cat.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Project Management</CardTitle>
                  <div className="flex items-center gap-2">
                    <Input
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      placeholder="Search projects..."
                      className="w-48 md:w-72"
                    />
                    {projectSearch && (
                      <Button variant="outline" size="sm" onClick={() => setProjectSearch("")}>Clear</Button>
                    )}
                    <Button onClick={handleAddProject}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <p className="text-slate-600">No projects yet.</p>
                  ) : (
                    projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg"
                      >
                        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Image
                            src={project.imageUrls[0] || "/placeholder.svg"}
                            alt={project.name}
                            width={64}
                            height={64}
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{project.name}</p>
                          <p className="text-xs text-slate-500 truncate mt-1">
                            {project.technologiesUsed.join(", ")}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Order: {project.displayOrder}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteProject(project.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Product Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="isFeatured"
                    checked={productForm.isFeatured}
                    onCheckedChange={(val) => setProductForm((prev) => ({ ...prev, isFeatured: Boolean(val) }))}
                  />
                  <Label htmlFor="isFeatured">Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="isUsed"
                    checked={productForm.isUsed}
                    onCheckedChange={(val) => setProductForm((prev) => ({ ...prev, isUsed: Boolean(val) }))}
                  />
                  <Label htmlFor="isUsed">Used product</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={productForm.categoryId}
                  onValueChange={(val) => setProductForm((prev) => ({ ...prev, categoryId: val }))}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={productForm.description}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={productForm.image}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="/placeholder.svg?height=200&width=200"
                />
              </div>

              <div>
                <Label htmlFor="itemCode">Item Code</Label>
                <Input
                  id="itemCode"
                  value={productForm.itemCode}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, itemCode: e.target.value }))}
                  placeholder={editingProduct ? "Must be unique (leave unchanged to keep)" : "Required (auto-generated if left blank)"}
                />
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="flex-1">
                  {editingProduct ? "Update Product" : "Add Product"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Bulk Upload Dialog */}
        <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Bulk Upload Products (CSV)</DialogTitle>
            </DialogHeader>
    <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (!csvFile) return
                try {
      const token = localStorage.getItem('token')
      const fd = new FormData()
      fd.append('file', csvFile)
  const resp = await fetch(`${API_BASE_URL}/admin/products/bulk`, {
                    method: 'POST',
                    headers: {
                      Authorization: token ? `Bearer ${token}` : ''
                    } as any,
                    body: fd,
                  })
                  if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`)
                  const data = await resp.json()
                  alert(`Imported: ${data.created}, Skipped: ${data.skipped}`)
                  setCsvFile(null)
                  setIsBulkDialogOpen(false)
                  await fetchProducts()
                } catch (err: any) {
                  alert(err?.message || 'Bulk upload failed')
                }
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="csv">CSV File</Label>
                <input
                  id="csv"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-slate-600 mt-2">Columns: name, description, price, stockQuantity, itemCode, imageUrl (or imageUrls), isFeatured, isUsed, categories (comma/semicolon separated names or slugs)</p>
              </div>
              <div className="flex gap-2 items-center">
                <Button type="submit" disabled={!csvFile}>Upload</Button>
                <Button type="button" variant="outline" onClick={() => setIsBulkDialogOpen(false)}>Cancel</Button>
                <a
                  href="/sample-products-template.csv"
                  className="text-sm text-blue-600 hover:underline ml-auto"
                  download
                >
                  Download template
                </a>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Project Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={projectForm.name}
                onChange={(e) => setProjectForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="projectDescription">Description</Label>
              <Textarea
                id="projectDescription"
                value={projectForm.description}
                onChange={(e) => setProjectForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>

            <div>
              <Label>Images</Label>
              {projectForm.imageUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <Input
                    value={url}
                    onChange={(e) => {
                      const newUrls = [...projectForm.imageUrls];
                      newUrls[index] = e.target.value;
                      setProjectForm((prev) => ({ ...prev, imageUrls: newUrls }));
                    }}
                    placeholder="Image URL"
                  />
                  {index === projectForm.imageUrls.length - 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setProjectForm((prev) => ({
                          ...prev,
                          imageUrls: [...prev.imageUrls, ""],
                        }));
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newUrls = projectForm.imageUrls.filter((_, i) => i !== index);
                        setProjectForm((prev) => ({ ...prev, imageUrls: newUrls }));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="projectUrl">Project URL (optional)</Label>
              <Input
                id="projectUrl"
                value={projectForm.projectUrl}
                onChange={(e) => setProjectForm((prev) => ({ ...prev, projectUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="technologiesUsed">Technologies Used</Label>
              <Input
                id="technologiesUsed"
                value={projectForm.technologiesUsed}
                onChange={(e) => setProjectForm((prev) => ({ ...prev, technologiesUsed: e.target.value }))}
                placeholder="IoT, PCB, Arduino (comma-separated)"
              />
            </div>

            <div>
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={projectForm.displayOrder}
                onChange={(e) => setProjectForm((prev) => ({ ...prev, displayOrder: e.target.value }))}
                placeholder="0"
              />
              <p className="text-xs text-slate-500 mt-1">Lower numbers appear first</p>
            </div>

            <div className="flex space-x-4 pt-2">
              <Button type="button" className="flex-1" onClick={handleSaveProject}>
                {editingProject ? "Update Project" : "Add Project"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsProjectDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
