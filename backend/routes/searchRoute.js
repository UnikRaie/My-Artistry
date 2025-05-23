const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist'); // Assuming you have a model for your artists
const auth = require('../middleware/auth');

// Helper function to construct the filter object
const constructFilter = ({ name, location, genre, priceFrom, priceTo, type, specialization, userId }) => {
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' }; // Case-insensitive name search
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (genre) filter.genres = { $regex: genre, $options: 'i' };
    if (priceFrom && priceTo) {
        filter.pricePerShow = { $gte: priceFrom, $lte: priceTo };
    } else if (priceFrom) {
        filter.pricePerShow = { $gte: priceFrom };
    } else if (priceTo) {
        filter.pricePerShow = { $lte: priceTo };
    }
    if (type && type !== 'all') filter.type = { $regex: type, $options: 'i' };
    if (specialization) filter.specialization = { $regex: specialization, $options: 'i' };
    if (userId) filter.userId = { $ne: userId }; // Exclude the user's own ID

    return filter;
};

// API endpoint for searching artists with pagination
router.get('/search', auth, async (req, res) => {
    try {
        const { name, location, genre, priceFrom, priceTo, type, specialization, page = 1, limit = 6 } = req.query;
        const userId = req.userId;

        const filter = constructFilter({ name, location, genre, priceFrom, priceTo, type, specialization, userId });

        const artists = await Artist.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Artist.countDocuments(filter);

        res.json({
            artists,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        console.error('Error searching artists:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Search artists without login with pagination
router.get('/nologinsearch', async (req, res) => {
    try {
        const { name, location, genre, priceFrom, priceTo, type, specialization, page = 1, limit = 6 } = req.query;

        const filter = constructFilter({ name, location, genre, priceFrom, priceTo, type, specialization });

        const artists = await Artist.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Artist.countDocuments(filter);

        res.json({
            artists,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        console.error('Error searching artists:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
