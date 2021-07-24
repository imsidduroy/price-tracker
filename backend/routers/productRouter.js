import express from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// const express = require('express')
// const expressAsyncHandler = require('express-async-handler')
// const product = require('../models/productModel.js')

const productRouter = express.Router();

productRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const {email, url, price} = req.body;
    console.log(email, url, price);
    res.send({ message: "Product Created"});
  })
);

productRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const {email, url, price} = req.body;
    console.log(email, url, price);
    res.send({ message: "Product Created"});
  })
);

// module.exports = productRouter;
export default productRouter;
