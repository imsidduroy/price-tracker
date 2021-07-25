import dotenv from "dotenv"
import sgMail from '@sendgrid/mail'
import Product from "./models/productModel.js"
import nightmare from "nightmare"

nightmare();
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function checkPrice(url) {
  try {
    console.log("trying", url);
    const priceString = await nightmare
      .goto(url)
      .wait("#priceblock_ourprice")
      .evaluate(() => document.getElementById("priceblock_ourprice").innerText)
      .end()
    console.log(priceString);
    const priceNumber = parseFloat(priceString.slice(7));
    return priceNumber;
  } catch (e) {
    throw new Error(e.message);
  }
}

async function rollEmails(){
    const products = await Product.find({});
    let emails = [];
    products.map(async product => {
      const price = await checkPrice(product.url);
          for (let [emailId, price_needed] of map) {
              if(price <= price_needed){
                emails.push({emailId, price, product_name: product.name}); 
              }
          }
    });
    sendEmails(emails);
}

async function sendEmails(emails){
    emails.map(async email => {
        const mail = {
            to: email.emailId,
            from: 'siddusiddartha3@gmail.com',
            subject: `Price alert for ${email.product_name}`,
            text: `The price of ${email.product_name} is ${email.price}`,
            html: `The price of ${email.product_name} is ${email.price}`
        };
        sgMail
          .send(email)
          .then(() => {
            console.log("Message sent");
          })
          .catch((error) => {
            console.log(error.response.body);
          });
    })
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
