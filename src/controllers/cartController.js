import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// export const getCart = async (req, res) => {
//   try {
//     const cart = await Cart.find({});
//     res.json(cart);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({}).populate({
      path: "items.productId",
      select: "name price image description",
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  const { productId } = req.body;

  try {
    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ items: [] });
    }

    const product = await Product.findById(productId);
    console.log("Product:", product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const itemExists = cart.items.some(item => item.productId.equals(productId));
    console.log("Item Exists:", itemExists);

    if (!itemExists) {
      cart.items.push({ productId });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error adding to cart: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { itemId } = req.params;

  try {
    let cart = await Cart.findOne();

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);

    await cart.save();
    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
