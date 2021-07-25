import express from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

const productRouter = express.Router();

productRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const {email, url, price} = req.body;
    console.log('received', email, url, price);
    const product = await Product.findOne({url});
    if(product) {
      console.log("found")
        product.subscribers.set(email, Number(price));
        await product.save()
    }
    else{
      console.log("not-found")
        const newProduct = new Product({url});
        newProduct.subcribers = new Map()
        console.log(newProduct);
        newProduct.subscribers.set(email, Number(price));
        await newProduct.save()
          .then(() => {console.log("saved")})
          .catch(err => {throw new Error(err.message)})
    }
    console.log("success!!!")
    res.send({ message: "Subscribed successfully!!"});
  })
);

export default productRouter;
