import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Controller to add a product to the user's cart or increase its quantity if it already exists
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Please provide a product id" });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  // Find user's cart or create a new one if it doesn't exist
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }
  // Check if the product is already in the cart items array
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );
  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    cart.items.push({ product: productId, quantity: quantity || 1 });
  }
  await cart.save();
  res.status(200).json(cart);
};

// Controller to fetch the user's cart and populate product details
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
  );

  if (!cart) {
    return res.status(200).json({ user: req.user._id, items: [] });
  }

  const validItems = cart.items.filter((item) => item.product);

  if (validItems.length !== cart.items.length) {
    cart.items = validItems;
    await cart.save();
  }

  res.status(200).json(cart);
};

// Controller to update the quantity of a specific item in the cart
export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res
      .status(400)
      .json({ message: "Please provide product id and quantity" });
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const item = cart.items.find((item) => item.product.toString() === productId);

  if (!item) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  item.quantity = quantity;

  await cart.save();

  res.status(200).json(cart);
};

// Controller to remove a specific product from the cart
export const removeFromCart = async (req, res) => {
  const { productId } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Filter out the item to be removed from the cart items array
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
  );

  await cart.save();

  res.status(200).json(cart);
};
