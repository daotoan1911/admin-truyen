const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');

router.get('/all', async (req, res) => {
    try { res.json(await Ad.find()); }
    catch (err) { res.status(500).send(err.message); }
});

router.post('/', async (req, res) => {
    try {
        const { slot, label, url, imageUrl, isActive } = req.body;
        const ad = await Ad.findOneAndUpdate(
            { slot },
            { slot, label, url, imageUrl, isActive, updatedAt: new Date() },
            { upsert: true, new: true }
        );
        res.json(ad);
    } catch (err) { res.status(500).send(err.message); }
});

module.exports = router;
