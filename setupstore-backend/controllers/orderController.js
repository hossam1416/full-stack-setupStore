import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Controller to create a new order from the user's cart, calculate totals, and clear the cart
export const createOrder = async (req, res) => {
  const { shippingAddress } = req.body;

  if (!shippingAddress) {
    return res
      .status(400)
      .json({ message: "Please provide a shipping address" });
  }

  // Find user's cart and populate product details to access prices
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
  );

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Your cart is empty" });
  }

  // Check stock availability before creating anything, so we fail cleanly
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      return res.status(400).json({
        message: `Not enough stock for "${item.product.name}". Available: ${item.product.stock}, requested: ${item.quantity}`,
      });
    }
  }

  // Map cart items to order items format capturing the price at the time of purchase
  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    priceAtPurchase: item.product.price,
  }));
  // Calculate the total order price based on items and quantities
  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0,
  );
  // Create the new order in the database
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalPrice,
    shippingAddress,
  });

  // Updates product stock levels after order creation.
  for (const item of cart.items) {
    item.product.stock -= item.quantity;
    await item.product.save();
  }

  // Clear the user's cart after successful order creation
  cart.items = [];
  await cart.save();

  res.status(201).json(order);
};

// Controller to fetch all orders belonging to the authenticated user
export const getOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "items.product",
  );
  res.status(200).json(orders);
};
// Controller to fetch a single specific order by its ID for the authenticated user, ensuring it belongs to them
export const getOrderById = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate("items.product");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.status(200).json(order);
};
// Controller for admins to fetch all orders across the entire platform with populated product and user details
export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("items.product")
    .populate("user", "username email");

  res.status(200).json(orders);
};
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Restore stock only on first-time cancellation to prevent double-restoration
  const isNewlyCancelled =
    status === "cancelled" && order.status !== "cancelled";

  if (isNewlyCancelled) {
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
  }

  order.status = status;
  await order.save();

  res.status(200).json(order);
};
