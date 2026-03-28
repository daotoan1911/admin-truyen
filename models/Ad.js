const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    slot: { type: String, unique: true },
    label: String,
    url: String,
    imageUrl: String,
    isActive: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ad', adSchema);
