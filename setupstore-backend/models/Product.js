import mongoose from "mongoose";
import slugify from "slugify";
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      // References the Category model
      ref: "Category",
      required: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    // Using a flexible Object type to support varying component specifications like CPU sockets
    specs: {
      type: Object,
      default: () => ({}),
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      default: "In Stock",
      enum: ["In Stock", "Out of Stock"],
    },
  },
  { timestamps: true },
);

productSchema.pre("validate", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }

  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
