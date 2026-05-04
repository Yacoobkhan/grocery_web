import userModel from "../models/userModel.js";

// ADD TO CART
const addToCart = async (req, res) => {
    try {
        console.log("REQ.USER:", req.user);
        const userId = req.user.id;
        const { productId } = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const existingItem = user.cartData.find(
            (item) => item.productId.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartData.push({ productId, quantity: 1 });
        }

        await user.save();

        res.json({ success: true, message: "Added to cart" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE CART
const updateCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const item = user.cartData.find(
            (item) => item.productId.toString() === productId
        );

        if (item) {
            item.quantity = quantity;
        }

        await user.save();

        res.json({ success: true });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET CART
const getUserCart = async (req, res) => {
    try {

        console.log("REQ.USER:", req.user); 
        const userId  = req.user.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID missing"
            });
        }

        const user = await userModel.findById(userId).populate("cartData.productId");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({ success: true, cartData: user.cartData || [] });

    } catch (error) {
        console.log("GET CART ERROR: ",error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addToCart, getUserCart, updateCart };
