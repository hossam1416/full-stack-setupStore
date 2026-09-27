import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
      trim: true,
    },
    specifications: {
      type: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
          },
          type: {
            type: String,
            required: true,
            enum: ["text", "number", "select"],
          },
          unit: {
            type: String,
            default: "",
            trim: true,
          },
          options: {
            type: [String],
            default: [],
          },
          compare: {
            type: String,
            enum: ["higher", "lower", "none"],
            default: "none",
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

categorySchema.pre("validate", function () {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
