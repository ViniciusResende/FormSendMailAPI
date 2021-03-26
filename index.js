const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

app.post('/api/form', (request, response) => {
  let data = request.body;
  let smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    logger: true,
    debug: true,
    secureConnection: false,
    ignoreTLS: true,
    auth: {
      user: process.env.EMAIL || 'user@gmail.com',
      pass: process.env.PASSWORD || '123456'
    },
    tls: {
      rejectUnAuthorized: true,
    }
  }
  let smtpTransport = nodemailer.createTransport(smtpConfig);

  let mailOptions = {
    to: process.env.email || 'user@gmail.com',
    subject: `Contact from your website: ${data.subject}`,
    html: `
      <h3>Informations</h3>
      <h4>You have received an email from ${data.name}</h4>
      <p>${data.name} data is: </p>
      <ul>
        <li>Name: ${data.name}</li>
        <li>E-mail: ${data.email}</li>
        <li>Cellphone: ${data.number}</li>
      </ul>
      <h4> The message was: </h4>
      <p>${data.message}</p>
    `
  }

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if(error){
      console.log(error);
    } else {
      response.send('Success')
    }
  })

  smtpTransport.close();
})

const PORT = process.env.PORT||3001;

app.listen(PORT, ()=>{
  console.log(`server starting at port ${PORT}`)
})