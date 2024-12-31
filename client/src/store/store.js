import category from "./category";

import { configureStore } from "@reduxjs/toolkit";
// import sidebars from "./sidebars";
import user from "./user";
import product from "./product";
import Counts from "./Counts";
import search from "./search";
import loader from "./loader";
export const store = configureStore({
    reducer:{
        category: category,
        // sidebars: sidebars,
        user: user,
        product : product,
        Counts: Counts,
        search: search,
        loader: loader
    }
})