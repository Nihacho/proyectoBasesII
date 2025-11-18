// backend/models/Inventory.js
const mongoose = require('mongoose');
const InventorySchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true, 
        unique: true 
    },
    quantity_available: { 
        type: Number, 
        required: true, 
        min: 0 
    },
});
module.exports = mongoose.model('Inventory', InventorySchema);