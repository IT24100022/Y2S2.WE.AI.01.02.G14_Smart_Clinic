const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.log('Starting in-memory MongoDB server as fallback...');
    
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`Fallback in-memory MongoDB Connected: ${conn.connection.host}`);
    } catch (memError) {
      console.error(`Error starting in-memory DB: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
