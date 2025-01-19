const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const imageSchema = new mongoose.Schema({
  imageId: {
    type: String,
    unique: true,
    default: uuidv4,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  url: {
    type: String, // URL of the image
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);
