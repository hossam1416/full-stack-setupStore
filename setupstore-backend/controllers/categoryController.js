import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Please provide category name" });
  }
  const category = await Category.create({
    name,
    description,
  });
  res.status(201).json(category);
};

// Controller to fetch all categories from the database
export const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
};

// Controller to update an existing category by ID with validation
export const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  category.name = req.body.name || category.name;
  category.description = req.body.description || category.description;

  const updatedCategory = await category.save();
  res.status(200).json(updatedCategory);
};

// Controller to delete a category by its ID
export const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  await category.deleteOne();

  res.status(200).json({ message: "Category deleted successfully" });
};
