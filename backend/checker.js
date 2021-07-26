import dotenv from "dotenv"
import sgMail from '@sendgrid/mail'
import Product from "./models/productModel.js"
import Nightmare from "nightmare"

export function checkerInit(){
  dotenv.config();
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("checker initiated");
}

export async function checkPrice(url) {
  try {
    const nightmare = Nightmare({
      // waitTimeout: 5000,
      // gotoTimeout: 5000,
      // executionTimeout: 5000
    });
    console.log("trying", url)
    const priceString = await nightmare
      .goto(url)
      .wait("#priceblock_ourprice")
      .evaluate(() => document.getElementById("priceblock_ourprice").innerText)
      .end()
    console.log("from funciton", priceString);
    const priceNumber = Number(priceString.replace(/[^0-9.-]+/g,""));
    return priceNumber;
  } catch (e) {
    return -1;
  }
}

export async function getProductName(url) {
  try {
    const nightmare = Nightmare({
      // waitTimeout: 5000,
      // gotoTimeout: 5000,
      // executionTimeout: 5000
    });
    console.log("trying_name")
    const productName = await nightmare
      .goto(url)
      .wait("#productTitle")
      .evaluate(() => document.getElementById("productTitle").innerText)
      .end()
    console.log("from funciton", productName);
    return productName;
  } catch (e) {
    console.log(e.message);
    return 'SOMETHING';
  }
}

export async function rollEmails(){
    const products = await Product.find({});
    console.log("entered rollEmails", products)
    async function getEmails(products){
      const emails = [];
      for(const product of products){
        const {url, name} = product;
        const sentTo = []
        const price = await checkPrice(url);
        console.log(price);
        for (let {_id, emailId, price_needed} of product.subscribers) {
          console.log(emailId, price_needed);
          if(price !== -1 && price <= price_needed){
            emails.push({emailId, price, name, url}); 
            sentTo.push(_id);
          }
        }
        sentTo.forEach(_id => {
          product.subscribers.pull({_id})
        });
        await product.save();
      }
      return emails
    };
    const emails = await getEmails(products);
    sendEmails(emails);
}

function sendEmails(emails){
    console.log('entered sendEmails', emails)
    for(let email of emails){
      console.log(email)
      const {emailId, price, name, url} = email;
        const mail = {
            to: emailId,
            from: 'siddusiddartha3@gmail.com',
            subject: `Price alert for ${name}`,
            text: `The price of ${name} is ${price}\n
                   Click here to visit product page ${url}`,
            html: `The price of ${name} is ${price}`
        };
        sgMail
          .send(mail)
          .then(() => {
            console.log(`Message sent to ${emailId}`);

          })
          .catch((error) => {
            console.log(error.message);
          });
    }
}

function sendEmail(subject, body) {
  const email = {
    to: "imsidduroy@gmail.com",
    from: "yadapi1959@28woman.com",
    subject: subject,
    text: body,
    html: body,
  };
  sgMail
    .send(email)
    .then(() => {
      console.log("Message sent");
    })
    .catch((error) => {
      console.log(error.response.body);
    });
}
