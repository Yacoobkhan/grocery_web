import dotenv from "dotenv";
import Stripe from "stripe";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const currency = "inr";
const deliveryCharge = 10;

// ==============================
// PLACE ORDER (COD)
// ==============================
const placeOrder = async (req, res) => {
  try {
    const { address, items, amount } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const formattedItems = items.map(item => ({
      productId: item._id,
      name: item.name,
      price: item.price,
      image: Array.isArray(item.images)
        ? item.images[0]
        : item.images || "",
      quantity: item.quantity
    }));

    const newOrder = await orderModel.create({
      userId,
      items: formattedItems,
      address,
      totalAmount: amount + deliveryCharge,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      isPaid: false,
      status: "Order Placed"
    });

    await userModel.findByIdAndUpdate(userId, { cartData: [] });

    res.json({
      success: true,
      message: "Order placed successfully",
      order: newOrder
    });

  } catch (error) {
    console.log("COD ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// PLACE ORDER (STRIPE)
// ==============================
const placeOrderStripe = async (req, res) => {
  try {
    const { address, items, amount } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const formattedItems = items.map(item => ({
      productId: item._id,
      name: item.name,
      price: item.price,
      image: Array.isArray(item.images)
        ? item.images[0]
        : item.images || "",
      quantity: item.quantity
    }));

    const newOrder = await orderModel.create({
      userId,
      items: formattedItems,
      address,
      totalAmount: amount + deliveryCharge,
      paymentMethod: "Stripe",
      paymentStatus: "Pending",
      isPaid: false,
      status: "Order Placed"
    });

    // Stripe line items
    const line_items = items.map(item => ({
      price_data: {
        currency,
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }));

    // delivery charge
    line_items.push({
      price_data: {
        currency,
        product_data: {
          name: "Delivery Charges"
        },
        unit_amount: deliveryCharge * 100
      },
      quantity: 1
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`
    });

    res.json({
      success: true,
      session_url: session.url
    });

  } catch (error) {
    console.log("STRIPE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// VERIFY STRIPE
// ==============================
const verifyStripe = async (req, res) => {
  try {
    const { orderId, success } = req.body;

    if (success === "true") {
      const order = await orderModel.findById(orderId);

      await orderModel.findByIdAndUpdate(orderId, {
        paymentStatus: "Completed",
        isPaid: true,
        paidAt: new Date()
      });

      await userModel.findByIdAndUpdate(order.userId, { cartData: [] });

      res.json({ success: true });

    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }

  } catch (error) {
    console.log("VERIFY ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// GET ALL ORDERS (ADMIN)
// ==============================
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// GET USER ORDERS (WITH IMAGE FIX)
// ==============================
const userOrders = async (req, res) => {
  try {
    const userId = req.user?.id;

    const orders = await orderModel
      .find({ userId })
      .sort({ createdAt: -1 });

    const updatedOrders = await Promise.all(
      orders.map(async (order) => {
        const updatedItems = await Promise.all(
          order.items.map(async (item) => {

            if (item.name && item.image && item.price) {
              return item;
            }

            const product = await productModel.findById(item.productId);

            return {
              ...item._doc,
              name: item.name || product?.name || "Unknown",
              price: item.price || product?.price || 0,
              image: item.image || product?.images?.[0] || ""
            };
          })
        );

        return {
          ...order._doc,
          items: updatedItems
        };
      })
    );

    res.json({ success: true, orders: updatedOrders });

  } catch (error) {
    console.log("USER ORDERS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// UPDATE STATUS
// ==============================
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });

    res.json({ success: true, message: "Status updated" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
    allOrders, placeOrder,
    placeOrderStripe, updateStatus, userOrders, verifyStripe
};

