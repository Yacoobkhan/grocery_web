import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },

    description: { type: String },

    price: { type: Number, required: true },

    discountPrice: { type: Number }, // optional offer price

    images: [{ type: String, required: true }],

    category: { type: String, required: true }, 
    // e.g., Fruits, Vegetables, Dairy, Snacks

    subCategory: { type: String },

    brand: { type: String },

    stock: { type: Number, required: true }, // ✅ important

    unit: { type: String, required: true }, 
    // e.g., "kg", "litre", "piece", "pack"

    weight: { type: Number }, 
    // e.g., 1kg, 500g

    isAvailable: { type: Boolean, default: true },

    isFeatured: { type: Boolean, default: false },

    expiryDate: { type: Date }, // ✅ useful for grocery

    ratings: { type: Number, default: 0 },

    numReviews: { type: Number, default: 0 }

}, { timestamps: true });

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;