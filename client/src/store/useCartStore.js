import { create } from 'zustand';

export const useCartStore = create((set, get) => {
  const hasUser = Boolean(localStorage.getItem('ww_user'));
  return {
    items: hasUser ? JSON.parse(localStorage.getItem('ww_cart_items') || '[]') : [],
    coupon: hasUser ? JSON.parse(localStorage.getItem('ww_cart_coupon') || 'null') : null,
    isOpen: false,

    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),
    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

    addItem: (product, customizationData = {}) => {
      const user = JSON.parse(localStorage.getItem('ww_user') || 'null');
      if (!user) {
        return { success: false, requireAuth: true };
      }

      set((state) => {
        const targetId = String(product?._id || product?.id || '');
        const existingIndex = targetId
          ? state.items.findIndex((item) => {
              const itemProdId = String(item?.product?._id || item?.product?.id || '');
              return itemProdId === targetId;
            })
          : -1;

        let updatedItems;
        if (existingIndex > -1) {
          updatedItems = [...state.items];
          updatedItems[existingIndex].customizationData = {
            ...updatedItems[existingIndex].customizationData,
            ...customizationData,
          };
        } else {
          updatedItems = [
            ...state.items,
            {
              product,
              customizationData: {
                brideName: customizationData.brideName || '',
                groomName: customizationData.groomName || '',
                weddingDate: customizationData.weddingDate || '',
                venue: customizationData.venue || '',
                language: customizationData.language || 'English & Hindi',
                musicChoice: customizationData.musicChoice || 'Default Shehnai Symphony',
                notes: customizationData.notes || '',
                ...customizationData,
              },
            },
          ];
        }
        localStorage.setItem('ww_cart_items', JSON.stringify(updatedItems));
        return { items: updatedItems, isOpen: true };
      });
      return { success: true };
    },

  updateCustomization: (productId, data) => {
    set((state) => {
      const targetId = String(productId || '');
      const updatedItems = state.items.map((item) => {
        const itemProdId = String(item?.product?._id || item?.product?.id || '');
        if (targetId && itemProdId === targetId) {
          return {
            ...item,
            customizationData: { ...item.customizationData, ...data },
          };
        }
        return item;
      });
      localStorage.setItem('ww_cart_items', JSON.stringify(updatedItems));
      return { items: updatedItems };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const targetId = String(productId || '');
      const updatedItems = state.items.filter((item) => {
        const itemProdId = String(item?.product?._id || item?.product?.id || '');
        return targetId ? itemProdId !== targetId : true;
      });
      localStorage.setItem('ww_cart_items', JSON.stringify(updatedItems));
      return { items: updatedItems };
    });
  },

  applyCoupon: (coupon) => {
    localStorage.setItem('ww_cart_coupon', JSON.stringify(coupon));
    set({ coupon });
  },

  removeCoupon: () => {
    localStorage.removeItem('ww_cart_coupon');
    set({ coupon: null });
  },

  clearCart: () => {
    localStorage.removeItem('ww_cart_items');
    localStorage.removeItem('ww_cart_coupon');
    set({ items: [], coupon: null });
  },

  getSubtotal: () => {
    return get().items.reduce((total, item) => total + (item.product.price || 0), 0);
  },

  getDiscountAmount: () => {
    const subtotal = get().getSubtotal();
    const coupon = get().coupon;
    if (!coupon || !coupon.discountPercent) return 0;
    return Math.round((subtotal * coupon.discountPercent) / 100);
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().getDiscountAmount();
    return Math.max(0, subtotal - discount);
  },
};
});
