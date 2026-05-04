import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: "India" }
});

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    quantity: { type: Number, default: 1 }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    phone: { type: String },

    cartData: [cartItemSchema], // ✅ better than object

    addresses: [addressSchema], // ✅ multiple delivery addresses

    role: { type: String, enum: ["user", "admin"], default: "user" }

}, { timestamps: true });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;