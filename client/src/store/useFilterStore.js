import { create } from 'zustand';

export const useFilterStore = create((set) => ({
  selectedCategory: 'All',
  searchQuery: '',
  sortBy: 'featured',

  setCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sort) => set({ sortBy: sort }),
  resetFilters: () => set({ selectedCategory: 'All', searchQuery: '', sortBy: 'featured' }),
}));
