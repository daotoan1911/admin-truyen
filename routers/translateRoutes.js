const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Thiếu text' });

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=vi&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const data = await response.json();
        const translated = data[0].map(item => item[0]).join('');
        res.json({ translated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
