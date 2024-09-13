const mongoose = require('mongoose');

const dbConfig = {
  url: 'mongodb+srv://rudrasharmaup52:Fi1kUqANI12FdC7P@cluster0.jbo6j.mongodb.net/nodeexp_db',
};

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    mongoose.set('debug', true);

    await mongoose.connect(dbConfig.url);

    console.log("Successfully connected to MongoDB.");
  } catch (err) {
    console.error("Connection error", err);
    process.exit();
  }
};

module.exports = connectDB;
