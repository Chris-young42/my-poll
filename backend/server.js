require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes=require('./routes/authRoutes')
const connectDB = require('./config/db');
const pollRoutes = require('./routes/pollRoutes');
const app = express();
app.use(cors(
    {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }
));
app.use(express.json());
connectDB()
app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/poll', pollRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const POST = process.env.PORT || 5000;
app.listen(POST, () => {
    console.log(`server is running on port ${POST}`);
});
