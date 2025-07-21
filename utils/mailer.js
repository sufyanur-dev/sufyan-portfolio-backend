import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transpoter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  console.log("to", to);
  const receiver = {
    from: process.env.EMAIL_USER,
    to,
    cc: process.env.EMAIL_USER,
    subject,
    text,
    html,
  };

  try {
    const info = await transpoter.sendMail(receiver);
    console.log("Email sent!", info);
    return info;
  } catch (error) {
    console.log(error);
  }
};
