const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `MongoDB Connected: ${connection.connection.host}`.cyan.underline.bold,
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
