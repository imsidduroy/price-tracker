require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const nightmare = require("nightmare")();

const args = process.argv.slice(2);
const url = args[0];
const minPrice = args[1];

checkPrice();

async function checkPrice() {
  try {
    const priceString = await nightmare
      .goto(url)
      .wait("#priceblock_dealprice")
      .evaluate(() => document.getElementById("priceblock_dealprice").innerText)
      .end();
    const priceNumber = parseFloat(priceString.slice(7));
    if (priceNumber < minPrice) {
      console.log("price is low");
      await sendEmail(
        "Price Is Low",
        `The price on ${url} has dropped below ${minPrice}`
      );
    }
  } catch (e) {
    await sendEmail("Amazon Price Checker Error", e.message);
    throw e;
  }
}

function sendEmail(subject, body) {
  const email = {
    to: "yadapi1959@28woman.com",
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
      // console.log(error.response.body.errors[0].message)
    });
//   return sgMail.send(email);
}
