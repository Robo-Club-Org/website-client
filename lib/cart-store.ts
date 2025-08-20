import { create } from "zustand"
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  stockQuantity?: number
}

interface CartStore {
  items: CartItem[]
  isLoading: boolean
  isAuthenticated: boolean
  hasMerged: boolean
  // Cart drawer UI state
  isCartOpen: boolean
  setCartOpen: (open: boolean) => void
  // Cart mutation helpers
  addItem: (product: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  syncWithServer: () => Promise<void>
  mergeLocalCartWithServer: () => Promise<void>
  setAuthenticated: (isAuth: boolean) => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://roboclub-server-70e29f041ab3.herokuapp.com'

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isAuthenticated: false,
  hasMerged: false,
  isCartOpen: false,

  setCartOpen: (open: boolean) => set({ isCartOpen: open }),

      setAuthenticated: (isAuth: boolean) => {
        const { hasMerged } = get();
        if (!isAuth) {
          // Reset auth state (allow merge again on next login)
          set({ isAuthenticated: false, hasMerged: false });
          return;
        }
        set({ isAuthenticated: true });
        if (!hasMerged) {
          get().mergeLocalCartWithServer();
        }
      },

  addItem: async (product, quantity = 1) => {
        if (quantity <= 0) return;
        const { isAuthenticated } = get();

        // Optimistic local update (applies for both authed & guest)
        let revertSnapshot: CartItem[] | null = null;
        set(state => {
          revertSnapshot = state.items;
          const existing = state.items.find(i => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
            }
          }
          return { items: [...state.items, { ...product, quantity }] }
        });

  if (!isAuthenticated) return; // guest complete

        try {
          const token = localStorage.getItem('token');
          if (!token) return; // Should not happen if authed
          set({ isLoading: true });
          const response = await fetch(`${apiBaseUrl}/cart/add`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: product.id, quantity })
          });
          if (!response.ok) {
            // If auth failed, fall back to guest mode and keep optimistic state
            if (response.status === 401 || response.status === 403) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              set({ isAuthenticated: false, hasMerged: false });
              console.warn('Auth expired/invalid while adding to cart; using guest cart.');
              return;
            }
            console.warn('Add to server cart failed, reverting optimistic update. Status:', response.status);
            if (revertSnapshot) set({ items: revertSnapshot });
          } else {
            // Refresh from server for authoritative state (handles pricing / stock adjustments)
            await get().syncWithServer();
          }
        } catch (e) {
          console.error('Add to cart server error, reverting optimistic update:', e);
          if (revertSnapshot) set({ items: revertSnapshot });
        } finally {
          set({ isLoading: false });
        }
      },

  removeItem: async (id) => {
        const { isAuthenticated } = get();
        
        if (isAuthenticated) {
          try {
            set({ isLoading: true });
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${apiBaseUrl}/cart/remove/${id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

    if (response.ok) {
              await get().syncWithServer();
    } else if (response.status === 401 || response.status === 403) {
      // Fall back to local removal (guest mode)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ isAuthenticated: false, hasMerged: false });
      set((state) => ({ items: state.items.filter(item => item.id !== id) }));
            }
          } catch (error) {
            console.error('Error removing from cart:', error);
          } finally {
            set({ isLoading: false });
          }
        } else {
          set((state) => ({
            items: state.items.filter(item => item.id !== id)
          }));
        }
      },

      updateQuantity: async (id, quantity) => {
        const { isAuthenticated } = get();
        
        if (quantity <= 0) {
          await get().removeItem(id);
          return;
        }
        // Always optimistic update locally first
        let previous: CartItem[] | null = null;
        set(state => {
          previous = state.items;
          return {
            items: state.items.map(item => item.id === id ? { ...item, quantity } : item)
          }
        });

        if (!isAuthenticated) return;

        try {
          set({ isLoading: true });
          const token = localStorage.getItem('token');
          if (!token) return;
          const response = await fetch(`${apiBaseUrl}/cart/update`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: id, quantity }),
          });

          if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
              // Keep optimistic local value, switch to guest
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              set({ isAuthenticated: false, hasMerged: false });
              return;
            }
            console.warn('Update quantity failed, reverting. Status:', response.status);
            if (previous) set({ items: previous });
          } else {
            await get().syncWithServer();
          }
        } catch (error) {
          console.error('Error updating cart, reverting:', error);
          if (previous) set({ items: previous });
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        const { isAuthenticated } = get();
        
        if (isAuthenticated) {
          try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${apiBaseUrl}/cart/clear`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            if (response.ok) {
              set({ items: [] });
            } else if (response.status === 401 || response.status === 403) {
              // Clear locally and switch to guest
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              set({ isAuthenticated: false, hasMerged: false, items: [] });
            }
          } catch (error) {
            console.error('Error clearing cart:', error);
          }
        } else {
          set({ items: [] });
        }
      },

      syncWithServer: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const response = await fetch(`${apiBaseUrl}/cart`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (response.ok) {
            const cartData = await response.json();
            // cartData may be { items: [...]} with flattened items OR legacy nested structure
            const rawItems = Array.isArray(cartData) ? cartData : cartData.items || [];
            const cartItems = rawItems.map((item: any) => {
              // If item.product exists, use nested form, else assume flattened
              if (item.product) {
                return {
                  id: item.product.id,
                  name: item.product.name,
                  price: item.price,
                  image: item.product.imageUrls?.[0] || '',
                  quantity: item.quantity,
                  stockQuantity: typeof item.product.stockQuantity === 'number' ? item.product.stockQuantity : undefined,
                }
              }
              return {
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image || '/placeholder.svg',
                quantity: item.quantity,
                stockQuantity: typeof item.stockQuantity === 'number' ? item.stockQuantity : undefined,
              }
            });
            set({ items: cartItems });
          } else if (response.status === 401 || response.status === 403) {
            // Token invalid/expired — switch to guest, keep current local items
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ isAuthenticated: false, hasMerged: false });
          } else {
            console.warn('Failed to sync cart. Status:', response.status);
          }
        } catch (error) {
          console.error('Error syncing with server:', error);
        }
      },

      mergeLocalCartWithServer: async () => {
        try {
          const { items, hasMerged } = get();
          const token = localStorage.getItem('token');

            // If already merged in this authenticated session, just sync to avoid duplication
          if (hasMerged) {
            await get().syncWithServer();
            return;
          }

          if (!token) {
            return;
          }

          if (items.length > 0) {
            const response = await fetch(`${apiBaseUrl}/cart/merge`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ items }),
            });
            if (!response.ok) {
              if (response.status === 401 || response.status === 403) {
                // Auth error — become guest and keep local items
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                set({ isAuthenticated: false, hasMerged: false });
                return;
              }
              console.warn('Merge failed, status:', response.status);
            }
          }

          // After first merge (or attempted merge) mark merged and clear local snapshot to prevent re-adding
          set({ hasMerged: true, items: [] });
          await get().syncWithServer();
        } catch (error) {
          console.error('Error merging cart:', error);
        }
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        items: state.isAuthenticated ? [] : state.items // Only persist items when not authenticated
      }),
    }
  )
)
