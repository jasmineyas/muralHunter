import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique IDs
import Image from './models/Image.js'; // Import the Image model with .js extension
import mongoose from 'mongoose';
import { seedData } from './seed_data.js';

// Seed Function
export async function seedDatabase() {
  try {
    // Clear the database
    await Image.deleteMany({});
    console.log('Cleared existing data.');

    // Validate and insert seed data
    seedData.forEach((data) => {
      if (!data.imageId) {
        data.imageId = uuidv4(); // Generate unique IDs for each document
      }
    });

    // Insert seed data
    const result = await Image.insertMany(seedData);
    console.log(`Inserted ${result.length} records.`);
  } catch (err) {
    console.error('Error seeding the database:', err);
    mongoose.connection.close();
  }
}
