const mongoose = require('mongoose');

console.log(`Mongoose installed version: ${mongoose.version}`);

const MONG_URI = process.env.MONG_URI || 'mongodb://localhost:27017/BooksData';

async function connectDB() {
  try {
    await mongoose.connect(MONG_URI);
    console.log(`Connection successful to ${MONG_URI}`);
    console.log(`Current Mongoose version: ${mongoose.version}`);
  } catch (error) {
    console.error(`Error occurred: ${error.message}`);
    process.exit(1);
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB error: ${err}`);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;
