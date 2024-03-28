const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Mongo Db connected !!!: ${conn.connection.host}`.bgMagenta);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDb;
