const mongoose = require("mongoose");
require("dotenv").config();

const DB_KEY = process.env.DB_KEY;

const connectionString = `mongodb+srv://${DB_KEY}@cluster0.mh6vioy.mongodb.net/hackatweet`;

mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error(error));
