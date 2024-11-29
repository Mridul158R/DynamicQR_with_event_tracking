const mongoose = require("mongoose");

const dbSchema = new mongoose.Schema({
  user: {
    type : mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  ID: {
    type: String,
    required: true,
  },
  OriginalUrl: {
    type: String,
    required: true,
  },
  ShortUrl: {
    type: String,
    required: true,
  },
  QrCode:{
    type: String,
    required: true, 
  },
  ClickCount: {
    type: Number,
    required: true,
    default: 0,
  },
  Events: [
    {
      timestamp: { type: Date, default: Date.now },
      location: { type: String },
      deviceType: { type: String },
      url: { type: String },
    },
  ],
  History: [
    {
      timestamp: { type: Date, default: Date.now },
      previousUrl: { type: String },
      newURl: { type: String },
    },
  ],
  date: {
    type: String,
    default: Date.now(),
  },
});

module.exports = mongoose.model('qrcodedb',dbSchema);
