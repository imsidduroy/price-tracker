import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'
dotenv.config()
console.log(process.env.SENDGRID_API_KEY)
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const name = 'test', price = 2000, url = 'http://www.test.com'
const msg = {
  to: 'imsidduroy@gmail.com', // Change to your recipient
  from: {
    email: 'siddusiddartha3@gmail.com', // Change to your verified sender
    name: 'Price-Tracker'
  },
  subject: `Price alert for ${name}`,
            text: `Rs. ${price} is the price of ${name}\n
                   Click here to visit product page ${url}`,
            html: `<h1>Rs. ${price} is the price of ${name}\n
                    <h4>Click here to visit product page ${url}</h4>`
  // subject: 'Sending with SendGrid is Fun',
  // text: 'and easy to do anywhere, even with Node.js',
  // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })