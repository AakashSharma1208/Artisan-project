const express = require('express');
const router = express.Router();
const { chatWithAI, getRecommendations } = require('../controllers/aiController');

router.post('/chat', chatWithAI);
router.get('/recommendations', getRecommendations);

module.exports = router;
