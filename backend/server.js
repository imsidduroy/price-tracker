import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import productRouter from "./routers/productRouter.js";
import {checkerInit, rollEmails} from "./checker.js"

dotenv.config();
checkerInit();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/amazona", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
.then(() => console.log("mongodb connected ..."))
.catch(err => console.error(err));

app.use("/api/", productRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
);

setInterval(rollEmails, 1000 * 60 * 60);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
  rollEmails();
});
