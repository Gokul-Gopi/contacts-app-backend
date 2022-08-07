const mongoose = require("mongoose");

const connectToMongo = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/contacts`);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.log(error);
    console.log(`Error: ${error.message}`);
  }
};

module.exports = connectToMongo;
