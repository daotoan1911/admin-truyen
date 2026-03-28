const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const Chapter = require('../models/Chapter');

router.get('/', async (req, res) => {
    try {
        const { genre, all } = req.query;
        const filter = genre ? { genre } : {};
        if (all === 'true') {
            return res.json(await Story.find(filter).sort({ createdAt: -1 }));
        }
        res.json(await Story.find(filter).sort({ createdAt: -1 }));
    } catch (err) { res.status(500).send(err.message); }
});

router.get('/:id', async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).send('Không tìm thấy');
        res.json(story);
    } catch (err) { res.status(500).send(err.message); }
});

router.post('/', async (req, res) => {
    try {
        const story = await new Story(req.body).save();
        res.json(story);
    } catch (err) { res.status(500).send(err.message); }
});

router.put('/:id', async (req, res) => {
    try {
        const story = await Story.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(story);
    } catch (err) { res.status(500).send(err.message); }
});

router.delete('/:id', async (req, res) => {
    try {
        await Story.findByIdAndDelete(req.params.id);
        await Chapter.deleteMany({ storyId: req.params.id });
        res.json({ message: 'Đã xoá' });
    } catch (err) { res.status(500).send(err.message); }
});

module.exports = router;
