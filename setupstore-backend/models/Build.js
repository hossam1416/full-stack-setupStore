import mongoose from "mongoose";

const buildSchema = new mongoose.Schema(
  {
    user: {
      // Unique 24-character hexadecimal identifier used to reference documents across collections
      type: mongoose.Schema.Types.ObjectId,
      // References the User model
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    components: {
      cpu: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      motherboard: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      ram: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      gpu: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      storage: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      psu: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      case: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

const Build = mongoose.model("Build", buildSchema);

export default Build;
