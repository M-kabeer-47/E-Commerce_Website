import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isCartOpen: false,
    isSidebarOpen: false,
}
const sidebarsSlice = createSlice({
    name: "sidebars",
    initialState,
    reducers: {
        openCart: (state) => {
            state.isCartOpen = true;
        },
        closeCart: (state) => {
            state.isCartOpen = false;
        },
        openSidebar: (state) => {
            state.isSidebarOpen = true;
        },
        closeSidebar: (state) => {
            state.isSidebarOpen = false;
        },
    }
});
export const { openCart, closeCart, openSidebar, closeSidebar } = sidebarsSlice.actions;
export default sidebarsSlice.reducer;