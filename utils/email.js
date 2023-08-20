const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "zainakabbani@gmail.com",
      pass: "mreltzmluggcarop",
    },
  });
  // Define the email options
  const mailDetails = {
    from: options.from,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Send the email
  await transporter.sendMail(mailDetails);

  // // Create a transporter
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });

  // // Define the email options
  // const mailOptions = {
  //   from: "ZainaKabbani<hello@gmail.com>",
  //   to: options.email,
  //   subject: options.subject,
  //   text: options.message,
  // };

  // Send the email
  // await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
