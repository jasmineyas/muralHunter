import { seedDatabase } from './seed.js'; // Import the seedDatabase function using require
import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import Image from './models/Image.js'; // Import the Image model with .js extension
const app = express();

// Middleware
app.use(json());
app.use(cors());

// Connect to MongoDB
const mongoURI = 'mongodb://127.0.0.1:27017/placeGuesser'; // Replace with your connection string if needed

async function main() {
  try {
    await connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    await seedDatabase();
    // Start the server
    const PORT = 3001;
    app.listen(PORT, () => {
      console.log(`Backend server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

// GET: Retrieve all images
app.get('/api/images', async (req, res) => {
  try {
    const images = await Image.find(); // Retrieve all images from the
    res.json(images); // Send the images as a JSON response
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

main()
  .then(() => console.log('Server started'))
  .catch(console.error);
