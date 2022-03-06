const mongoose = require('mongoose')

const MONGODB_URI =  process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;
const connectDB = () => mongoose.connect(MONGODB_URI)
  
module.exports = connectDB;
