// auth-backend/server.js

const express = require("express");
const cors = require("cors");
const chatRoute = require('./routes/chatRoutes');
const authRoutes = require("./routes/authRoutes");
const historyRoutes = require("./routes/historyRoutes");
const medicationRoutes = require("./routes/medicationRoutes");
const mongoose = require('mongoose')
require("dotenv").config();

const app = express();


app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoute);
app.use("/api/auth", authRoutes);
app.use("/api/medicalHistory", historyRoutes);
app.use("/api/medicalReminder", medicationRoutes);


// const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`connected to db and app listening on port ${process.env.PORT}`)
    })
  })
  .catch((error) => {
    console.log(error)
  });
