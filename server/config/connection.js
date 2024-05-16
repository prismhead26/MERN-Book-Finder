// requires mongoose and connects to the mongo database
const mongoose = require("mongoose");
require("dotenv").config();

// Connect to the Mongo DB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/googlebooks"
);

// Export the connection
module.exports = mongoose.connection;
