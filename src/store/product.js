import { createSlice } from "@reduxjs/toolkit";



const InitialState = {
    productID: "",
    cartClicked: false,
    removeClicked: false,
    emptyCartClicked: false,
    quantity: 1,
}
const productSlice = createSlice({
    name: "product",
    initialState: InitialState,
    reducers: {
        setProduct: (state, action) => {
            state.productID = action.payload;
        },
        setCartClicked: (state, action) => {
            state.cartClicked = action.payload;
        },
        setRemoveClicked: (state, action) => {
            state.removeClicked = action.payload;
        },
        setEmptyCartClicked: (state, action) => {
            state.emptyCartClicked = action.payload;
        },
        incrementQuantity: (state, action) => {  
            state.quantity += 1;
        },
        decrementQuantity: (state, action) => {  
            state.quantity -= 1;
        },
        setProductPageQuantity: (state, action) => {
            state.quantity = action.payload;
        },


    },
});
export const { setProduct,setCartClicked,setEmptyCartClicked,setRemoveClicked,incrementQuantity,decrementQuantity,setProductPageQuantity } = productSlice.actions;
export default productSlice.reducer;