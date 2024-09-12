import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    cartCount : 0,
    wishlistCount : 0,
}
const countSlice = createSlice({
    name: "count",
    initialState,
    reducers: {
        setCartCount: (state,action) => {
            state.cartCount=action.payload;

        },
        setWishlistCount: (state,action) => {
            state.wishlistCount=action.payload
        },
        incrementCartCount: (state) => {
            state.cartCount+=1;
        },
        incrementWishlistCount: (state) => {
            state.wishlistCount+=1;
        },
        decrementCartCount: (state) => {
            state.cartCount-=1;
        },
        decrementWishlistCount: (state) => {
            state.wishlistCount-=1;
        
        }
    }

})

export const { setCartCount, setWishlistCount,incrementCartCount,incrementWishlistCount,decrementCartCount,decrementWishlistCount } = countSlice.actions;
export default countSlice.reducer;