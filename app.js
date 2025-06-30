import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes.js";
import { db } from "./utils/db.js";
import { Server } from "socket.io";
import http from "http";
import { sendEmail } from "./utils/mailer.js";
const PORT = 5000;

const app = express();

dotenv.config();

app.use(
  cors({
    origin: "https://sufyanurrasheed.onrender.com",
    methods: ["GET", "POST"],
  })
);

const server = http.createServer(app);

app.use(express.json());

db();

app.use("/api", router);

server.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});

const io = new Server(server, {
  cors: {
    origin: "https://sufyanurrasheed.onrender.com",
    methods: ["GET", "POST"],
  },
});

const userProgress = {};
const userDetails = {};

io.on("connection", (socket) => {
  userProgress[socket.id] = {
    name: false,
    phone: false,
    email: false,
    sendingEmail: false,
  };

  userDetails[socket.id] = {
    name: "",
    phone: null,
    email: "",
  };

  const userTrack = userProgress[socket.id];
  const userDetailsSave = userDetails[socket.id];

  socket.on("send_message", (data) => {
    const text = data.text.trim(); // remove spaces

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10}$/;

    const isEmail = emailRegex.test(text);
    const isMobile = mobileRegex.test(text);

    // Time formatting
    const date = new Date();
    let hh = date.getHours() % 12 || 12;
    let mm = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    const time = `${hh.toString().padStart(2, "0")}:${mm} ${ampm}`;

    let reply = "";

    // STEP 1: Name
    if (!userTrack.name) {
      reply = `Nice to meet you, ${text}!\nPlease provide your mobile number.`;
      userTrack.name = true;
      userDetailsSave.name = text;
    }

    // STEP 2: Phone
    else if (!userTrack.phone) {
      if (isMobile) {
        reply = `✅ Thank you for your mobile number.\n🎉 Now please share your email address.`;
        userTrack.phone = true;
        userDetailsSave.phone = text;
      } else {
        reply = `❌ Invalid phone number.\nPlease enter a 10-digit mobile number.`;
      }
    }

    // STEP 3: email
    else if (!userTrack.email) {
      if (isEmail) {
        reply = `✅ Thanks for providing your email. \n We've completed the chat. Visit again!`;
        userTrack.email = true;
        userDetailsSave.email = text;

        if (!userTrack.sendingEmail) {
          sendEmail({
            to: userDetailsSave.email,
            subject: "New Chatbot Submission Received",
            text: `A new user has completed the chatbot form.
            Details:
            Name: ${userDetailsSave.name}
            Email: ${userDetailsSave.email}
            Phone: ${userDetailsSave.phone}

            Regards,
            Chatbot System`,
            html: null,
          });
          userTrack.sendingEmail = true;
        }
      } else {
        reply = `❌ Invalid email format.\nPlease enter a valid email address.`;
      }
    } else {
      reply = `✅ All steps completed.\nThank you!`;
    }

    // Show current tracking for debugging
    console.log("Progress:", userProgress[socket.id]);

    socket.emit("received_message", {
      sender: "bot",
      text: reply,
      time: time,
    });
  });

  socket.on("disconnect", () => {
    delete userProgress[socket.id];
  });
});
