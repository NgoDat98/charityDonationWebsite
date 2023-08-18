const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const DBconfig = process.env.MONGODB_CONNECT_KEY;

    const connect = await mongoose.connect(DBconfig);
    console.log(connect.connection.host);
  } catch (err) {
    console.log("err");
  }
};

module.exports = connectDB;
