import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Destructure Schema from mongoose for clarity
const { Schema, model } = mongoose;

// Define the Image schema
const imageSchema = new Schema(
  {
    imageId: {
      type: String,
      unique: true,
      default: uuidv4, // Correctly set to the function reference
      index: true, // Ensures an index is created for faster queries
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
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true, // Removes whitespace from both ends
    },
  },
  { timestamps: true }
);

// Create a unique index on imageId if not already created
imageSchema.index({ imageId: 1 }, { unique: true });

const Image = model('Image', imageSchema);

export default Image;
