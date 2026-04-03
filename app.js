require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/stories', require('./routers/storyRoutes'));
app.use('/chapters', require('./routers/chapterRoutes'));
app.use('/ads', require('./routers/adRoutes'));
app.use('/users', require('./routers/userRoutes'));
app.use('/translate', require('./routers/translateRoutes'));
app.use('/crawl', require('./routers/crawlRoutes'));

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(5000, () => console.log('Admin: http://localhost:5000'));
}

module.exports = app;
