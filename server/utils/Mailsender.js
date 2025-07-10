const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,      
    pass: process.env.PASSWORD_USER     
  }
});

const SendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"LEAVE MANAGEMENT SYSTEM" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log(" Email sent:", info.messageId);
  } catch (error) {
    console.error(" Email failed:", error);
  }
};

module.exports = SendMail;
