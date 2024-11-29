const mongoose = require('mongoose');
require('dotenv').config();
const DB = process.env.MONGO_URI; 


const connectDB= ()=>{
    mongoose
      .connect(DB)
      .then(() => {
        console.log("Successfully connected to db");
      })
      .catch((error) => {
        console.log(`can not connect to database, ${error}`);
      });
    }
    module.exports= connectDB 
