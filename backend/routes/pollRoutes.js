const express = require('express');
const { protect } = require('../middleware/authMiddleware')
const {createPoll,}=require('../controllers/pollController')
const router = express.Router();
router.post('/create',protect,createPoll)
module.exports = router;