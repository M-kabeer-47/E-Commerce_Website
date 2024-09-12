import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    cartUpdate: false
}
let loaderSlice = createSlice({
    name: "loader",
    initialState,
    reducers: {
        toggleLoader: (state)=>{
            state.cartUpdate = !state.cartUpdate;
        }
    }
        
    
})
export default loaderSlice.reducer;
export const {toggleLoader} = loaderSlice.actions;