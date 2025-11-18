// backend/routes/saleRoutes.js
const express = require('express');
const router = express.Router();
const { processSale } = require('../controllers/saleController');

router.post('/process', processSale); 

module.exports = router;