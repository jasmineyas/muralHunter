// routes/images.js
const express = require('express');
const router = express.Router();
const Image = require('../models/Image');

// POST: create a new “image” document
router.post('/', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const newImage = new Image({ latitude, longitude });
    const saved = await newImage.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: retrieve all images
router.get('/', async (req, res) => {
  try {
    const images = await Image.find();
    console.log(images);
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
