import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { forgotTemplete } from "./forgotTemplete.js";
import { complaintResponseTemplate } from "./autoReplyTemplate.js";

async function autoReplyEmail(email, name) {
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
    subject: "no reply", // Subject from the function parameter
    text: "noo reply", // Message from the function parameter
    html: complaintResponseTemplate(name),
  });

  console.log("Message sent: %s", info.messageId);
}

export default autoReplyEmail;
