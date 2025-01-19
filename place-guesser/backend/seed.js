import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique IDs
import Image from './models/Image.js'; // Import the Image model with .js extension
import mongoose from 'mongoose';

// Data to Insert
const seedData = [
  {
    latitude: 49.27650343461371,
    longitude: -123.13107557839683,
    url: 'https://imgur.com/IjjrJrT',
    description: 'Vancouver Art Gallery',
  },
  {
    latitude: 49.266137,
    longitude: -123.24789,
    url: 'https://imgur.com/hqBnI3y',
    description: 'UBC Museum of Anthropology',
  },
  {
    latitude: 49.28440191669053,
    longitude: -123.11432853974921,
    url: 'https://imgur.com/x8KgIEa',
    description: 'Science World',
  },
  {
    latitude: 49.25798463452297,
    longitude: -123.10086773750527,
    url: 'https://imgur.com/yoFIz57',
    description: 'BC Place',
  },
  {
    latitude: 49.27031694014467,
    longitude: -123.09902555769969,
    url: 'https://imgur.com/rQGdIfc',
    description: 'Rogers Arena',
  },
  {
    latitude: 49.262438985068464,
    longitude: -123.10064237780615,
    url: 'https://imgur.com/e86vAOr',
    description: 'Yaletown',
  },
  {
    latitude: 49.27475692799478,
    longitude: -123.07066978320995,
    url: 'https://imgur.com/MVwBzSQ',
    description: 'Commercial Drive',
  },
  {
    latitude: 49.27042843811737,
    longitude: -123.09917472065352,
    url: 'https://imgur.com/yfgFgok',
    description: 'Chinatown',
  },
  {
    latitude: 49.26731330635209,
    longitude: -123.10133716248448,
    url: 'https://imgur.com/zKGNAtd',
    description: 'Gastown',
  },
];

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
