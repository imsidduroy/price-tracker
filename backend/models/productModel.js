import mongoose from "mongoose";
// const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: { type: String },
    url: { type: String, required: true, unique: true },
    subscribers: [{emailId: String, price_needed: Number}]
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);

// module.exports = Product;
export default Product;
