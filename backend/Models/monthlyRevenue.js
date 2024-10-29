import mongoose from "mongoose";
const monthly_revenue_Schema = new mongoose.Schema({
    month: {
        type: String,
        required: true,
    },
    year:{
        type: Number,
        required: true,
    },
    revenue: {
        type: Number,
        required: true,
    },
    });
export const Monthly_Revenue = mongoose.model('monthly_revenue', monthly_revenue_Schema);