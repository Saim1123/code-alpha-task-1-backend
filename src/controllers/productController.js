import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import Product from "../models/Product.js";

const uploadImageToCloudinary = async image => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image.path, { folder: "ecommerce" }, (err, result) => {
      if (err) {
        console.error("Cloudinary upload error:", err);
        reject(err);
      } else {
        console.log("Cloudinary upload success:", result.secure_url);
        resolve(result.secure_url);
      }
    });
  });
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, description } = req.body;

  try {
    console.log("Request Body:", req.body);
    console.log("Request file:", req.file);

    const image = await uploadImageToCloudinary(req.file);

    const product = new Product({
      name,
      price,
      image,
      description,
    });

    await product.save();

    fs.unlinkSync(req.file.path);

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ message: error.message });
  }
};
