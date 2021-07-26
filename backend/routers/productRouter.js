import express from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import {checkPrice, getProductName} from "../checker.js"

const productRouter = express.Router();

productRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const {email: emailId, url, price} = req.body;
    console.log('received', emailId, url, price);
    const product = await Product.findOne({url});
    if(product) {
      console.log("found") 
        if(!product.name === 'SOMETHING'){
          const productName = await getProductName(url)
          product.name = productName
        }
        const result = product.subscribers.find( ({emailId}) => emailId === req.body.email);
        console.log(result)
        if(result){
          console.log('already subscribed to this product')
          await Product.updateOne(
            { url, "subscribers.emailId": emailId },
            { $set: { "subscribers.$.price_needed" : price } }
          )
          console.log(product)
        }
        else{
          console.log("else")
          product.subscribers.push({emailId, price_needed: Number(price)});
        }
        await product.save()
          .then(() => {console.log("saved")})
          .catch(err => {
            console.log(err.message)
            throw new Error(err.message)
          })
    }
    else{
      console.log("not-found")
        const productName = await getProductName(url)
        const newProduct = new Product({url, name: productName});
        newProduct.subscribers.push({emailId, price_needed: Number(price)});
        console.log(newProduct);
        await newProduct.save()
          .then(() => {console.log("saved")})
          .catch(err => {
            console.log(err.message)
            throw new Error(err.message)
          })
    }
    console.log("success!!!")
    res.send({ message: "Subscribed successfully!!"});
  })
);

productRouter.get(
  "/getname",
  expressAsyncHandler(async (req, res) => {
      const url = req.body.url
      const productName = await getProductName(url)
      console.log(productName)
      res.send({productName});
      // res.send({priceNumber: "0"});
  })
);
productRouter.get(
  "/checkprice",
  expressAsyncHandler(async (req, res) => {
      const url = req.body.url
      const priceNumber = await checkPrice(url)
      // console.log(priceNumber)
      res.send({priceNumber})
      // res.send({priceNumber: "0"});
  })
);
productRouter.get(
  "/checkprice",
  expressAsyncHandler(async (req, res) => {
      const url = req.body.url
      const priceNumber = await checkPrice(url)
      const productName = await getProductName(url)
      // console.log(priceNumber)
      res.send({priceNumber, productName})
      // res.send({priceNumber: "0"});
  })
);


export default productRouter;
