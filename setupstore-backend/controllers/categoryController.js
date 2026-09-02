import Category from "../models/Category.js";

// Controller to create a new category after checking required fields and unique slug
const createCategory = async (req, res) => {
  const { name, slug, description } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ message: "Please provide name and slug" });
  }
  const categoryExists = await Category.findOne({ slug });
  if (categoryExists) {
    return res
      .status(400)
      .json({ message: "Category with this slug already exists" });
  }
  const category = await Category.create({ name, slug, description });
  res.status(201).json(category);
};

// Controller to fetch all categories from the database
const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
};

// Controller to update an existing category by ID with validation
const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  // Check if the new slug is already taken by another category
  if (req.body.slug && req.body.slug !== category.slug) {
    const slugExists = await Category.findOne({ slug: req.body.slug });
    if (slugExists) {
      return res
        .status(400)
        .json({ message: "Category with this slug already exists" });
    }
  }

  category.name = req.body.name || category.name;
  category.slug = req.body.slug || category.slug;
  category.description = req.body.description || category.description;

  const updatedCategory = await category.save();
  res.status(200).json(updatedCategory);
};

// Controller to delete a category by its ID
const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  await category.deleteOne();

  res.status(200).json({ message: "Category deleted successfully" });
};

export default {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
