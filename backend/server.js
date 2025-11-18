// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config(); 
connectDB(); 

const app = express();
app.use(cors()); 
app.use(express.json()); 

// Rutas de la API REST [cite: 7]
app.use('/api/products', require('./routes/productRoutes')); 
app.use('/api/sales', require('./routes/saleRoutes'));       

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));