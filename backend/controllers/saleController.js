// backend/controllers/saleController.js
const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');

exports.processSale = async (req, res) => {
    // Simulamos la venta de 1 item
    const { productId, quantity } = req.body;
    const session = await mongoose.startSession();
    
    let resultData = { status: 'FAILED', message: 'Transaction failed due to server error.' };

    try {
        session.startTransaction();

        // SCENARIO 2: Transacción revertida por validación [cite: 20]
        if (!productId || typeof quantity !== 'number' || quantity <= 0) {
            throw new Error('Validation Error: Quantity must be a positive number.');
        }

        // --- 1. BUSCAR Y VERIFICAR RECURSO ---
        const inventoryItem = await Inventory.findOne({ product: productId }).session(session);

        // SCENARIO 3: Transacción revertida por recurso necesario que no existe o no cumple [cite: 21]
        if (!inventoryItem) {
            throw new Error('Resource Error: Inventory not found for the specified Product ID.');
        }
        if (inventoryItem.quantity_available < quantity) {
            throw new Error(`Resource Error: Insufficient stock. Available: ${inventoryItem.quantity_available}.`);
        }
        
        // --- 2. OPERACIÓN CRÍTICA DENTRO DE LA TRANSACCIÓN ---
        inventoryItem.quantity_available -= quantity;
        await inventoryItem.save({ session });
        
        // --- 3. COMMIT: Si el flujo completo es correcto [cite: 10, 12, 19]
        await session.commitTransaction();
        
        // Retornar dato que describa la operación [cite: 22]
        resultData = {
            status: 'SUCCESS',
            message: 'Transacción exitosa: Venta procesada e inventario actualizado.',
            transaction_type: 'SALE_COMMIT',
            product_id: productId,
            items_sold: quantity,
            new_stock: inventoryItem.quantity_available 
        };

        res.status(200).json(resultData);

    } catch (error) {
        // --- 4. ROLLBACK: Si algo falla en el proceso [cite: 11, 13]
        await session.abortTransaction();
        
        // Personalizar el mensaje del rollback
        const isValidationError = error.message.includes('Validation Error');
        const isResourceError = error.message.includes('Resource Error');

        if (isValidationError || isResourceError) {
            resultData.message = error.message;
        } else {
            resultData.message = `Rollback general: La transacción falló. ${error.message}`;
        }
        
        res.status(400).json(resultData);

    } finally {
        session.endSession();
    }
};