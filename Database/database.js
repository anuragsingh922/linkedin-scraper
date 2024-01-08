const mongoose = require("mongoose");
const dotenv = require("dotenv");
const env = require('../env/config')

const dbUrl = env.DB_URL;

const connectDB = async () => {
  try {
    // console.log(dbUrl);
    const connection = await mongoose.connect(dbUrl);
    if (connection) console.log("DB connected");
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = connectDB;
