import mongoose from "mongoose";
// const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: { type: String },
    url: { type: String, required: true, unique: true },
    subscribers: {
      type: Map,
      of: Number,
    },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);

// module.exports = Product;
export default Product;
