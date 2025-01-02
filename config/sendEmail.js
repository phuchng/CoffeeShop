
const nodemailer = require("nodemailer");
const sendVerificationEmail = (email, verificationLink) => {
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
      html: `
        <p>Thank you for registering. Please verify your email by clicking the link below: </p>
        <a href="${verificationLink}">${verificationLink}</a>
      `,
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