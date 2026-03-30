const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/all', async (req, res) => {
    try {
        const users = await User.find().select('-passwordHash -otp -otpExpiry').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:id/admin-vip', async (req, res) => {
    try {
        const { action } = req.body;
        const update = action === 'grant'
            ? { isVIP: true, vipExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
            : { isVIP: false, vipExpiry: null };
        const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-passwordHash');
        if (!user) return res.status(404).send('Không tìm thấy user');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đã xoá tài khoản' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
