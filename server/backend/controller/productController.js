import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// ADD PRODUCT
const addProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            subCategory,
            brand,
            stock,
            unit,
            weight
        } = req.body;

        const images = Object.values(req.files || {}).flat();

        const imagesUrl = await Promise.all(
            images.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path);
                return result.secure_url;
            })
        );

        const product = await productModel.create({
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            brand,
            stock: Number(stock),
            unit,
            weight,
            images: imagesUrl
        });

        res.json({ success: true, product });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// LIST PRODUCTS
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// REMOVE PRODUCT
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// SINGLE PRODUCT
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addProduct, listProducts, removeProduct, singleProduct };