'use client';
import type React from "react";
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import {
  User,
  Package,
  Settings,
  MapPin,
  Shield,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  trackingNumber?: string;
  items: OrderItem[];
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  zipCode: string;
  phoneNumber?: string;
  isDefault: boolean;
}

export default function MyAccountPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    zipCode: "",
    phoneNumber: "",
  });
  
  const [success, setSuccess] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwFail, setPwFail] = useState("");
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  // New: order details dialog state
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { user, isLoggedIn, loading: authLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading first
    if (authLoading) {
      return;
    }

    // Only proceed if authentication state has been determined
    if (isLoggedIn && user && user.email) {
      const fetchUserData = async () => {
        try {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          const token = localStorage.getItem('token');

          // Fetch user data
          const userResponse = await fetch(`${apiBaseUrl}/user`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          
          if (!userResponse.ok) {
            // Handle unauthorized or invalid token
            if (userResponse.status === 401 || userResponse.status === 403) {
              // Clear invalid tokens and redirect to login
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
              return;
            }
            throw new Error('Failed to fetch user data');
          }
          
          const userData = await userResponse.json();
          setUserData(userData);
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });          // Fetch orders
          try {
            const ordersResponse = await fetch(`${apiBaseUrl}/orders`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            if (ordersResponse.ok) {
              const ordersData = await ordersResponse.json();
              setOrders(ordersData);
            }
          } catch (orderError) {
            console.log('Orders not available:', orderError);
          }

          // Fetch addresses
          try {
            const addressesResponse = await fetch(`${apiBaseUrl}/addresses`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            if (addressesResponse.ok) {
              const addressesData = await addressesResponse.json();
              setAddresses(addressesData);
            }
          } catch (addressError) {
            console.log('Addresses not available:', addressError);
          }
          
        } catch (e: unknown) {
          console.error("Failed to fetch user data:", e);
          // On any error, clear tokens and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else if (!authLoading && isLoggedIn === false) {
      // Redirect to login page if user is not logged in
      window.location.href = '/login';
    }
  }, [user, isLoggedIn, authLoading]);

  // Helper functions
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userData) {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const token = localStorage.getItem('token');

        const response = await fetch(`${apiBaseUrl}/user`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        const updatedUser = await response.json();
        setUserData(updatedUser);
        setIsEditing(false);
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setSuccess("Failed to update profile. Please try again.");
        setTimeout(() => setSuccess(""), 3000);
      }
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setPwFail("New passwords don't match!");
      setTimeout(() => setPwFail(""), 3000);
      return;
    }

    if (formData.newPassword.length < 8 || !(/[A-Za-z]/.test(formData.newPassword) && /\d/.test(formData.newPassword))) {
      setPwFail('Password must be at least 8 chars and include a letter and a number');
      setTimeout(() => setPwFail(""), 3000);
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiBaseUrl}/user/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }

      setPwSuccess("Password updated successfully!");
      setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPwSuccess(""), 3000);
    } catch (error) {
      setPwFail(error instanceof Error ? error.message : "Failed to update password. Please try again.");
      setTimeout(() => setPwFail(""), 3000);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = localStorage.getItem('token');

      if (editingAddress) {
        // Update existing address
        console.log('Updating address with data:', addressForm);
        const response = await fetch(`${apiBaseUrl}/addresses/${editingAddress.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(addressForm),
        });

        if (!response.ok) {
          throw new Error('Failed to update address');
        }

        const updatedAddress = await response.json();
        console.log('Received updated address:', updatedAddress);
        setAddresses(addresses.map((addr) => (addr.id === editingAddress.id ? updatedAddress : addr)));
      } else {
        // Create new address
        const response = await fetch(`${apiBaseUrl}/addresses`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...addressForm,
            isDefault: addresses.length === 0,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create address');
        }

        const newAddress = await response.json();
        setAddresses([...addresses, newAddress]);
      }

      setIsAddressDialogOpen(false);
      setEditingAddress(null);
      setAddressForm({
        fullName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        district: "",
        zipCode: "",
        phoneNumber: "",
      });
    } catch (error) {
      console.error('Address operation failed:', error);
      // You might want to show an error message to the user here
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiBaseUrl}/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      setAddresses(addresses.filter((addr) => addr.id !== id));
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const setDefaultAddress = async (id: string) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiBaseUrl}/addresses/${id}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to set default address');
      }

      setAddresses(addresses.map((addr) => ({ ...addr, isDefault: addr.id === id })));
    } catch (error) {
      console.error('Failed to set default address:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = "/";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="container mx-auto py-16 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If there are any errors, the redirect will happen in useEffect
  // No error screen needed as we directly redirect to login

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        {userData && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="py-4 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg shadow">
                  <i  className="fas fa-user"></i>
                </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">My Account</h1>
                <h2 className="text-xl font-semibold text-slate-700 mb-1">{userData.name}</h2>
                <p className="text-slate-600">{userData.email}</p>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                {success && <p className="text-sm text-green-600 mb-4">{success}</p>}

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex space-x-4">
                    {isEditing ? (
                      <>
                        <Input type="submit" className="bg-blue-500 hover:bg-blue-600  text-white px-4 py-2 rounded-md " value="Save Changes" />
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button type="button" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                {pwSuccess && <p className="text-sm text-green-600 mb-4">{pwSuccess}</p>}
                {pwFail && <p className="text-sm text-red-600 mb-4">{pwFail}</p>}
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.currentPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Button type="submit">Update Password</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-600 mb-2">No orders yet</h3>
                      <p className="text-slate-500">When you place your first order, it will appear here.</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                    <div key={order.id} className="border border-slate-200 rounded-lg p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">Order {order.id}</h3>
                          <p className="text-sm text-slate-600">{order.date}</p>
                          {order.trackingNumber && (
                            <p className="text-sm text-slate-600">Tracking: {order.trackingNumber}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          <span className="font-semibold text-lg">LKR {order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center">
                              <Package className="h-5 w-5 text-slate-400" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-slate-600">
                                Qty: {item.quantity} × LKR {item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col md:flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsOrderDialogOpen(true);
                          }}
                        >
                          View Details
                        </Button>
                        {order.status === "Delivered" && (
                          <Button variant="outline" size="sm">
                            Reorder
                          </Button>
                        )}
                        {order.trackingNumber && (
                          <Button variant="outline" size="sm">
                            Track Package
                          </Button>
                        )}
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Order Details Dialog */}
          <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedOrder ? `Order ${selectedOrder.id}` : "Order Details"}
                </DialogTitle>
              </DialogHeader>
              {selectedOrder && (
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="text-sm text-slate-600">
                      <p>Date: {selectedOrder.date}</p>
                      {selectedOrder.trackingNumber && <p>Tracking: {selectedOrder.trackingNumber}</p>}
                    </div>
                    <div className="mt-2 md:mt-0">
                      <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-3 border rounded p-3">
                        <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center">
                          <Package className="h-5 w-5 text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-slate-600">Qty: {item.quantity} × LKR {item.price.toFixed(2)}</p>
                        </div>
                        <div className="text-right text-sm font-semibold">
                          LKR {(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between border-t pt-3">
                    <span className="font-medium">Total</span>
                    <span className="font-semibold">LKR {selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Saved Addresses</CardTitle>
                  <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddressSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            value={addressForm.fullName}
                            onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="addressLine1">Address Line 1</Label>
                          <Input
                            id="addressLine1"
                            value={addressForm.addressLine1}
                            onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                          <Input
                            id="addressLine2"
                            value={addressForm.addressLine2}
                            onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="district">District</Label>
                            <Input
                              id="district"
                              value={addressForm.district}
                              onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="zipCode">ZIP Code</Label>
                            <Input
                              id="zipCode"
                              value={addressForm.zipCode}
                              onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                            <Input
                              id="phoneNumber"
                              value={addressForm.phoneNumber}
                              onChange={(e) => setAddressForm({ ...addressForm, phoneNumber: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="flex space-x-4">
                          <Button type="submit" className="flex-1">
                            {editingAddress ? "Update Address" : "Add Address"}
                          </Button>
                          <Button type="button" variant="outline" onClick={() => setIsAddressDialogOpen(false)}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-600 mb-2">No addresses saved</h3>
                      <p className="text-slate-500">Add an address to make checkout faster.</p>
                    </div>
                  ) : (
                    <>
                      {addresses.map((address) => (
                    <div key={address.id} className="border border-slate-200 rounded-lg p-4 relative">
                      {address.isDefault && (
                        <Badge className="absolute top-2 right-2 bg-blue-100 text-blue-800">Default</Badge>
                      )}
                      <div className="mb-3">
                        <h3 className="font-semibold flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          Address
                        </h3>
                        <p className="font-medium">{address.fullName}</p>
                      </div>
                      <div className="text-sm text-slate-600 mb-4">
                        <p>{address.addressLine1 || 'No address'}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>
                          {address.city || 'No city'}, {address.district || 'No district'} {address.zipCode || 'No zip'}
                        </p>
                        {address.phoneNumber && <p>Phone: {address.phoneNumber}</p>}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingAddress(address);
                            setAddressForm({
                              fullName: address.fullName,
                              addressLine1: address.addressLine1,
                              addressLine2: address.addressLine2 || "",
                              city: address.city,
                              district: address.district,
                              zipCode: address.zipCode,
                              phoneNumber: address.phoneNumber || "",
                            });
                            setIsAddressDialogOpen(true);
                          }}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        {!address.isDefault && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => setDefaultAddress(address.id)}>
                              Set Default
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteAddress(address.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    ))}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-red-600">Logout</h3>
                    <p className="text-sm text-slate-600">Sign out of your account</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}