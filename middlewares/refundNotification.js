import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { refundNotificationTemplate } from "./refundNotificationTemplate.js";

async function emailNotificatoin(email, name, amount) {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "s4alpy@gmail.com",
      pass: "ejsh gyoe lnuj zrqf", // Make sure this is correct
    },
    tls: {
      rejectUnauthorized: false, // Ignore self-signed certificates
    },
  });

  // Send email with defined transport object
  const info = await transporter.sendMail({
    from: '"Nestoria🪑" <s4alpy@gmail.com>',
    to: email, // Email address should be passed correctly
    subject: "refund notification", // Subject from the function parameter
    text: "refund notification", // Message from the function parameter
    html: refundNotificationTemplate(name, amount),
  });

  console.log("Message sent: %s", info.messageId);
}

export default emailNotificatoin;
