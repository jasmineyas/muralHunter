const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import uuid for unique IDs

// MongoDB Connection
const mongoURI = 'mongodb://127.0.0.1:27017/placeGuesser'; // Replace with your connection string if needed
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define the Image Schema
const imageSchema = new mongoose.Schema({
  imageId: {
    type: String,
    unique: true,
    default: uuidv4, // Automatically generate a unique imageId
  },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  url: { type: String, required: true },
});
const Image = mongoose.model('Image', imageSchema);

// Data to Insert
const seedData = [
  { latitude: 49.27650343461371, longitude: -123.13107557839683, url: "https://imgur.com/IjjrJrT" },
  { latitude: 49.266137, longitude: -123.247890, url: "https://imgur.com/hqBnI3y"},
  { latitude: 49.28440191669053, longitude: -123.11432853974921, url: "https://imgur.com/x8KgIEa"},
  { latitude: 49.25798463452297, longitude:  -123.10086773750527, url: "https://imgur.com/yoFIz57"},
  { latitude: 49.27031694014467, longitude:  -123.09902555769969, url: "https://imgur.com/rQGdIfc"},
  { latitude: 49.262438985068464, longitude: -123.10064237780615, url: "https://imgur.com/e86vAOr"},
  { latitude: 49.27475692799478, longitude: -123.07066978320995, url: "https://imgur.com/MVwBzSQ"},
  { latitude: 49.27042843811737, longitude:  -123.09917472065352, url: "https://imgur.com/yfgFgok"},
  { latitude: 49.26731330635209, longitude:  -123.10133716248448, url: "https://imgur.com/zKGNAtd"}
];

// Seed Function
async function seedDatabase() {
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

    // Close connection
    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error seeding the database:', err);
    mongoose.connection.close();
  }
}

// Run the seeding process
seedDatabase();
