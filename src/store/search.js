import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchResult: [],
  filteredSearch: [],
  isFiltered: false,
  lastSort: 'none',
  
  
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    updateSearchText: (state,action)=>{
      state.text = action.payload;
    },
    

    updateSearch: (state, action) => {
      state.searchResult = action.payload;
      state.filteredSearch = action.payload;  // Reset filtered category
      state.isFiltered = false;  // Reset filter flag
      state.lastSort = 'none';   // Reset sort
    },
    sortSearchLowToHigh: (state) => {
      const sortFunction = (a, b) => {
        let aPrice = parseInt(a.price.replace(/[^\d]/g, ''), 10);
        let bPrice = parseInt(b.price.replace(/[^\d]/g, ''), 10);
        return aPrice - bPrice;
      };
      if (state.isFiltered) {
        state.filteredSearch = [...state.filteredSearch].sort(sortFunction);
      } else {
        state.searchResult = [...state.searchResult].sort(sortFunction);
      }
      state.lastSort = 'lowToHigh';  // Track the last sort order
    },
    sortSearchHighToLow: (state) => {
      const sortFunction = (a, b) => {
        let aPrice = parseInt(a.price.replace(/[^\d]/g, ''), 10);
        let bPrice = parseInt(b.price.replace(/[^\d]/g, ''), 10);
        return bPrice - aPrice;
      };
      if (state.isFiltered) {
        state.filteredSearch = [...state.filteredSearch].sort(sortFunction);
      } else {
        state.searchResult = [...state.searchResult].sort(sortFunction);
      }
      state.lastSort = 'highToLow';  // Track the last sort order
    },
    sortSearchHighlyRated: (state) => {
      const sortFunction = (a, b) => b.rating - a.rating;
      if (state.isFiltered) {
        state.filteredSearch = [...state.filteredSearch].sort(sortFunction);
      } else {
        state.searchResult = [...state.searchResult].sort(sortFunction);
      }
      state.lastSort = 'highlyRated';  // Track the last sort order
    },
    filterSearchByPrice: (state, action) => {
      state.isFiltered = true;
      const [minPrice, maxPrice] = action.payload;
      console.log("Filtering products with range:", minPrice, maxPrice);
      state.filteredSearch = state.searchResult.filter(product => {
        const price = parseInt(product.price.replace(/[^\d]/g, ''), 10);
        return price >= minPrice && price <= maxPrice;
      });
      console.log("Filtered products:", state.filteredSearch);

      
      switch (state.lastSort) {
        case 'lowToHigh':
          state.filteredSearch = [...state.filteredSearch].sort((a, b) => {
            let aPrice = parseInt(a.price.replace(/[^\d]/g, ''), 10);
            let bPrice = parseInt(b.price.replace(/[^\d]/g, ''), 10);
            return aPrice - bPrice;
          });
          break;
        case 'highToLow':
          state.filteredSearch = [...state.filteredSearch].sort((a, b) => {
            let aPrice = parseInt(a.price.replace(/[^\d]/g, ''), 10);
            let bPrice = parseInt(b.price.replace(/[^\d]/g, ''), 10);
            return bPrice - aPrice;
          });
          break;
        case 'highlyRated':
          state.filteredSearch = [...state.filteredSearch].sort((a, b) => b.rating - a.rating);
          break;
        default:
          break;
      }
    }
  }
});

export default searchSlice.reducer;
export const { sortSearchHighToLow, sortSearchLowToHigh, sortSearchHighlyRated, updateSearch, filterSearchByPrice } = searchSlice.actions;
