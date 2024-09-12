import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: [],
  filteredCategory: [],
  isFiltered: false,
  lastSort: 'none',
  
  
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    updateSearchText: (state,action)=>{
      state.text = action.payload;
    },
    updateType: (state,action)=>{
      state.type = action.payload;
    },

    updateCategory: (state, action) => {
      state.category = action.payload;
      state.filteredCategory = action.payload;  // Reset filtered category
      state.isFiltered = false;  // Reset filter flag
      state.lastSort = 'none';   // Reset sort
    },
    sortLowToHigh: (state) => {
      const sortFunction = (a, b) => {
        let aPrice = parseInt(a.price.replace(/[^\d]/g, ''), 10);
        let bPrice = parseInt(b.price.replace(/[^\d]/g, ''), 10);
        return aPrice - bPrice;
      };
      if (state.isFiltered) {
        state.filteredCategory = [...state.filteredCategory].sort(sortFunction);
      } else {
        state.category = [...state.category].sort(sortFunction);
      }
      state.lastSort = 'lowToHigh';  // Track the last sort order
    },
    sortHighToLow: (state) => {
      const sortFunction = (a, b) => {
        let aPrice = parseInt(a.price.replace(/[^\d]/g, ''), 10);
        let bPrice = parseInt(b.price.replace(/[^\d]/g, ''), 10);
        return bPrice - aPrice;
      };
      if (state.isFiltered) {
        state.filteredCategory = [...state.filteredCategory].sort(sortFunction);
      } else {
        state.category = [...state.category].sort(sortFunction);
      }
      state.lastSort = 'highToLow';  // Track the last sort order
    },
    sortHighlyRated: (state) => {
      const sortFunction = (a, b) => b.rating - a.rating;
      if (state.isFiltered) {
        state.filteredCategory = [...state.filteredCategory].sort(sortFunction);
      } else {
        state.category = [...state.category].sort(sortFunction);
      }
      state.lastSort = 'highlyRated';  // Track the last sort order
    },
    filterProductsByPrice: (state, action) => {
      state.isFiltered = true;
      const [minPrice, maxPrice] = action.payload;
      console.log("Filtering products with range:", minPrice, maxPrice);
      state.filteredCategory = state.category.filter(product => {
        const price = parseInt(product.price.replace(/[^\d]/g, ''), 10);
        return price >= minPrice && price <= maxPrice;
      });
      console.log("Filtered products:", state.filteredCategory);

      
      switch (state.lastSort) {
        case 'lowToHigh':
          state.filteredCategory = [...state.filteredCategory].sort((a, b) => {
            let aPrice = parseInt(a.price.replace(/[^\d]/g, ''), 10);
            let bPrice = parseInt(b.price.replace(/[^\d]/g, ''), 10);
            return aPrice - bPrice;
          });
          break;
        case 'highToLow':
          state.filteredCategory = [...state.filteredCategory].sort((a, b) => {
            let aPrice = parseInt(a.price.replace(/[^\d]/g, ''), 10);
            let bPrice = parseInt(b.price.replace(/[^\d]/g, ''), 10);
            return bPrice - aPrice;
          });
          break;
        case 'highlyRated':
          state.filteredCategory = [...state.filteredCategory].sort((a, b) => b.rating - a.rating);
          break;
        default:
          break;
      }
    }
  }
});

export default categorySlice.reducer;
export const { sortHighToLow, sortLowToHigh, sortHighlyRated, updateCategory, filterProductsByPrice,updateType } = categorySlice.actions;
