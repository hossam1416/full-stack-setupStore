import Product from "../models/Product.js";

// Controller to compare multiple products by fetching them using an array of IDs from query parameters
export const compareProducts = async (req, res) => {
  const { ids } = req.query;

  if (!ids) {
    return res
      .status(400)
      .json({ message: "Please provide product ids to compare" });
  }
  // Split the comma-separated string of IDs into an array
  const idsArray = ids.split(",");

  if (idsArray.length < 2) {
    return res
      .status(400)
      .json({ message: "Please provide at least two product ids" });
  }
  // Find all products whose IDs match the array using the $in operator
  const products = await Product.find({ _id: { $in: idsArray } });

  res.status(200).json(products);
};
