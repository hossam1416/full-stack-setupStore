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

// Controller to create a new product after validating fields, category, and slug uniqueness
const createProduct = async (req, res) => {
  const {
    name,
    slug,
    description,
    price,
    category,
    brand,
    specs,
    images,
    stock,
  } = req.body;

  if (!name || !slug || !description || price === undefined || !category) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const categoryExists = await resolveCategory(category);
  if (!categoryExists) {
    return res.status(400).json({ message: "Category not found" });
  }

  const slugExists = await Product.findOne({ slug });
  if (slugExists) {
    return res
      .status(400)
      .json({ message: "Product with this slug already exists" });
  }

  const product = await Product.create({
    name,
    slug,
    description,
    price,
    category: categoryExists._id,
    brand,
    specs,
    images,
    stock: stock ?? 0,
    status: stock > 0 ? "In Stock" : "Out of Stock",
  });

  res.status(201).json(product);
};

// Controller to fetch products with filtering, search, pagination, and population options
const getProducts = async (req, res) => {
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
const getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate(
    "category",
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
};

// Controller to update an existing product by its ID with validation
const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Check if the new slug is already taken by another product
  if (req.body.slug && req.body.slug !== product.slug) {
    const slugExists = await Product.findOne({ slug: req.body.slug });
    if (slugExists) {
      return res
        .status(400)
        .json({ message: "Product with this slug already exists" });
    }
  }

  product.name = req.body.name || product.name;
  product.slug = req.body.slug || product.slug;
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
  product.status = product.stock > 0 ? "In Stock" : "Out of Stock";

  const updatedProduct = await product.save();

  res.status(200).json(updatedProduct);
};

// Controller to delete a product by its ID
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await product.deleteOne();

  res.status(200).json({ message: "Product deleted successfully" });
};
// Controller to bulk import products from a JSON array with validation and category resolution
const importProducts = async (req, res) => {
  const { products } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return res
      .status(400)
      .json({ message: "Please provide an array of products" });
  }

  const processedProducts = [];

  for (const item of products) {
    const {
      name,
      slug,
      description,
      price,
      category,
      brand,
      specs,
      images,
      stock,
    } = item;

    // Skip items missing required fields
    if (!name || !slug || !description || price === undefined || !category) {
      continue;
    }

    // Check if a product with the same slug already exists in the database
    const slugExists = await Product.findOne({ slug });
    if (slugExists) {
      continue; // Skip duplicates instead of failing the whole request
    }

    // Resolve category by ID or name; if it doesn't exist, CREATE IT automatically!
    let categoryDoc = await resolveCategory(category);
    if (!categoryDoc) {
      try {
        const catName = typeof category === "string" ? category : "General";
        const catSlug = catName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        // Ensure category slug uniqueness or fallback
        let existingCatSlug = await Category.findOne({ slug: catSlug });
        const finalCatSlug = existingCatSlug
          ? `${catSlug}-${Date.now()}`
          : catSlug;

        categoryDoc = await Category.create({
          name: catName,
          slug: finalCatSlug,
        });
      } catch (err) {
        // If category creation fails, skip this product
        continue;
      }
    }

    processedProducts.push({
      name,
      slug,
      description,
      price,
      category: categoryDoc._id,
      brand,
      specs,
      images: images || (item.image ? [item.image] : []),
      stock: stock ?? 0,
      status: (stock ?? 0) > 0 ? "In Stock" : "Out of Stock",
    });
  }

  if (processedProducts.length === 0) {
    return res.status(400).json({
      message:
        "No valid products to import. Check if slugs are already taken or fields are missing.",
    });
  }

  // Insert valid products into the database in bulk
  const insertedProducts = await Product.insertMany(processedProducts, {
    ordered: false,
  });

  res.status(201).json({
    message: `Successfully imported ${insertedProducts.length} products!`,
    count: insertedProducts.length,
  });
};
export default {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  importProducts,
};
