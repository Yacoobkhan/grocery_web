import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    name: String,
    price: Number,
    quantity: Number,
    image: String
});

const addressSchema = new mongoose.Schema({
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
});

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },

    items: [orderItemSchema], // ✅ structured

    totalAmount: { type: Number, required: true },

    address: addressSchema,

    status: {
        type: String,
        enum: [
            "Order Placed",
            "Processing",
            "Out for Delivery",
            "Delivered",
            "Cancelled"
        ],
        default: "Order Placed"
    },

    paymentMethod: { type: String, required: true }, // COD / Online

    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending"
    },

    isPaid: { type: Boolean, default: false },

    paidAt: { type: Date },

    deliveredAt: { type: Date }

}, { timestamps: true });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;