import express from "express";
import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct
} from "../controller/productController.js";

import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const productRouter = express.Router();

// public routes
productRouter.get("/list", listProducts);
productRouter.post("/single", singleProduct);

// admin routes
productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1" },
    { name: "image2" },
    { name: "image3" },
    { name: "image4" }
  ]),
  addProduct
);

productRouter.post("/remove", adminAuth, removeProduct);

export default productRouter;