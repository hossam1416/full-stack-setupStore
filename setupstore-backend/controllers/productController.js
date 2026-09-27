import Product from "../models/Product.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";
// Helper function to resolve category input by either its ID or name
async function resolveCategory(categoryInput) {
  if (!categoryInput) return null;

  if (mongoose.Types.ObjectId.isValid(categoryInput)) {
    return await Category.findById(categoryInput);
  }

  return await Category.findOne({
    $or: [{ name: categoryInput }, { slug: categoryInput }],
  });
}

function validateProductSpecs(specs, categorySpecifications) {
  if (!specs || typeof specs !== "object") {
    return false;
  }

  for (const specification of categorySpecifications) {
    const value = specs[specification.name];

    if (value === undefined || value === null || value === "") {
      continue;
    }

    if (specification.type === "number" && typeof value !== "number") {
      return false;
    }

    if (
      specification.type === "select" &&
      !specification.options.includes(value)
    ) {
      return false;
    }

    if (specification.type === "text" && typeof value !== "string") {
      return false;
    }
  }

  const allowedNames = categorySpecifications.map(
    (specification) => specification.name,
  );

  return Object.keys(specs).every((name) => allowedNames.includes(name));
}

// Controller to create a new product after validating fields, category, and slug uniqueness
export const createProduct = async (req, res) => {
  const { name, description, price, category, brand, specs, images, stock } =
    req.body;

  if (!name || !description || price === undefined || !category) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const categoryExists = await resolveCategory(category);
  if (!categoryExists) {
    return res.status(400).json({ message: "Category not found" });
  }

  const validSpecs = validateProductSpecs(specs, categoryExists.specifications);

  if (!validSpecs) {
    return res.status(400).json({
      message: "Invalid product specifications",
    });
  }

  const product = await Product.create({
    name,
    description,
    price,
    category: categoryExists._id,
    brand,
    specs,
    images,
    stock: stock ?? 0,
  });

  res.status(201).json(product);
};

// Controller to fetch products with filtering, search, pagination, and population options
export const getProducts = async (req, res) => {
  const { search, category, minPrice, maxPrice, page, limit } = req.query;
  const filter = {};

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }
  if (category) {
    const categoryDoc = await resolveCategory(category);

    if (categoryDoc) {
      filter.category = categoryDoc._id;
    }
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const currentPage = Number(page) || 1;
  const pageLimit = Number(limit) || 10;
  const skip = (currentPage - 1) * pageLimit;

  const products = await Product.find(filter)
    .skip(skip)
    .limit(pageLimit)
    // Populate category reference to retrieve full category details instead of just its ID
    .populate("category");
  const total = await Product.countDocuments(filter);

  res.status(200).json({
    products,
    total,
    currentPage,
    totalPages: Math.ceil(total / pageLimit),
  });
};

// Controller to fetch a single product by its unique slug
export const getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate(
    "category",
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
};

// Controller to update an existing product by its ID with validation
export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  product.name = req.body.name || product.name;
  product.description = req.body.description || product.description;
  product.price = req.body.price ?? product.price;

  if (req.body.category) {
    const categoryExists = await resolveCategory(req.body.category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found" });
    }
    product.category = categoryExists._id;
  }

  product.brand = req.body.brand || product.brand;
  product.specs = req.body.specs || product.specs;
  product.images = req.body.images || product.images;
  product.stock = req.body.stock ?? product.stock;
  const updatedProduct = await product.save();

  res.status(200).json(updatedProduct);
};

// Controller to delete a product by its ID
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await product.deleteOne();

  res.status(200).json({ message: "Product deleted successfully" });
};
