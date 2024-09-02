import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.MAILING_EMAIL,
    pass: config.MAILING_PASSWORD,
  },
});

// Email con ticket de compra
const sendEmailTicket = (to, subject, text, html) => {
  const mailOptions = {
    from: config.MAILING_EMAIL,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

// Email para reseteo de contraseña
export const sendResetEmail = async (email, token) => {
  const resetUrl = `http://localhost:8080/api/sessions/reset-password/${token}`;
  const message = `
    <h1>Password Reset Request</h1>
    <h4>You requested a password reset</h4>
    <p>Click this <a href="${resetUrl}">link</a> to reset your password</p>
  `;

  await transporter.sendMail({
    to: email,
    subject: "Password Reset Request",
    html: message,
  });
};

export default { sendEmailTicket };