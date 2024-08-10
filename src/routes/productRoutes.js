import express from "express";
import { getProducts, createProduct } from "../controllers/productController.js";
import upload from "../config/multer.js";

const router = express.Router();

router.route("/").get(getProducts).post(upload, createProduct);

export default router;
