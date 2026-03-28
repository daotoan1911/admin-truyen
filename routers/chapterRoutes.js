const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');
const Story = require('../models/Story');

router.get('/', async (req, res) => {
    try {
        const chapters = await Chapter.find({ storyId: req.query.storyId }).sort({ number: 1 });
        res.json(chapters);
    } catch (err) { res.status(500).send(err.message); }
});

router.get('/:id', async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (!chapter) return res.status(404).send('Không tìm thấy');
        res.json(chapter);
    } catch (err) { res.status(500).send(err.message); }
});

router.post('/', async (req, res) => {
    try {
        const chapter = await new Chapter(req.body).save();
        const count = await Chapter.countDocuments({ storyId: chapter.storyId });
        await Story.findByIdAndUpdate(chapter.storyId, { totalChapters: count });
        res.json(chapter);
    } catch (err) { res.status(500).send(err.message); }
});

router.put('/:id', async (req, res) => {
    try {
        const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(chapter);
    } catch (err) { res.status(500).send(err.message); }
});

router.delete('/:id', async (req, res) => {
    try {
        const chapter = await Chapter.findByIdAndDelete(req.params.id);
        if (!chapter) return res.status(404).send('Không tìm thấy');
        const count = await Chapter.countDocuments({ storyId: chapter.storyId });
        await Story.findByIdAndUpdate(chapter.storyId, { totalChapters: count });
        res.json({ message: 'Đã xoá' });
    } catch (err) { res.status(500).send(err.message); }
});

module.exports = router;
