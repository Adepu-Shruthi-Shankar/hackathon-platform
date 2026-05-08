const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error(' Mail transporter error:', error.message);
  } else {
    console.log(' Mail transporter ready');
  }
});

module.exports = transporter;