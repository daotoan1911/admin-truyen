const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

router.post('/', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Thiếu URL' });

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'vi-VN,vi;q=0.9'
            },
            timeout: 15000
        });

        const $ = cheerio.load(response.data);

        // Lấy tiêu đề chương
        let title = $('h1').first().text().trim() ||
            $('h2').first().text().trim() ||
            $('title').text().trim();

        // Lấy nội dung — etruyen.net dùng div#chapter-c hoặc div.chapter-c
        let content = '';
        const selectors = ['#chapter-c', '.chapter-c', '#chapter-content', '.chapter-content', '#content', '.content-chapter'];
        for (const sel of selectors) {
            if ($(sel).length) {
                content = $(sel).text().trim();
                break;
            }
        }

        // Fallback: lấy đoạn văn dài nhất
        if (!content) {
            let maxLen = 0;
            $('div, article, section').each((_, el) => {
                const text = $(el).clone().children('script,style,nav,header,footer').remove().end().text().trim();
                if (text.length > maxLen && text.length > 500) {
                    maxLen = text.length;
                    content = text;
                }
            });
        }

        // Làm sạch nội dung
        content = content
            .replace(/\t/g, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        if (!content) return res.status(404).json({ error: 'Không tìm thấy nội dung chương' });

        res.json({ title, content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
