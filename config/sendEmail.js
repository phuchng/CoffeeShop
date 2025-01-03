
const nodemailer = require("nodemailer");
const sendVerificationEmail = (email, message) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Email Verification",
      html: message,
    };
  
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Verification email sent:", info.response);
      }
    });
  };

  module.exports = sendVerificationEmail;