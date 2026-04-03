const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Thiếu text' });

    const token = process.env.GITHUB_TOKEN;
    if (!token) return res.status(500).json({ error: 'Chưa cấu hình GITHUB_TOKEN' });

    try {
        const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'Bạn là dịch giả chuyên nghiệp dịch truyện tiếng Trung sang tiếng Việt. Dịch tự nhiên, giữ nguyên tên nhân vật phiên âm Hán Việt, giữ phong cách văn học. Chỉ trả về bản dịch, không giải thích.'
                    },
                    {
                        role: 'user',
                        content: text
                    }
                ],
                temperature: 0.3,
                max_tokens: 4096
            })
        });

        const data = await response.json();
        if (!response.ok) return res.status(500).json({ error: data.error?.message || 'Lỗi API' });
        const translated = data.choices[0].message.content;
        res.json({ translated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
