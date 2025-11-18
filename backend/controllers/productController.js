// backend/controllers/productController.js
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

// GET: Listado de recursos
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            { $lookup: { from: 'inventories', localField: '_id', foreignField: 'product', as: 'inventory_data' } },
            { $unwind: { path: '$inventory_data', preserveNullAndEmptyArrays: true } },
            { $project: { _id: 1, name: 1, price: 1, quantity_available: '$inventory_data.quantity_available' || 0 } }
        ]);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
};

// POST: Registro de recursos
exports.createProduct = async (req, res) => {
    const { name, price, initial_stock } = req.body;
    if (!name || !price || initial_stock === undefined || price < 0 || initial_stock < 0) {
        return res.status(400).json({ message: 'Validación: Todos los campos son requeridos y deben ser positivos.' }); // Validaciones básicas [cite: 17, 49]
    }
    try {
        const newProduct = new Product({ name, price });
        await newProduct.save();
        const newInventory = new Inventory({ product: newProduct._id, quantity_available: initial_stock });
        await newInventory.save();
        res.status(201).json({ message: 'Producto registrado exitosamente.', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear producto.', error: error.message });
    }
};

// PUT: Actualización de recursos
exports.updateProduct = async (req, res) => {
    const { name, price } = req.body;
    if (price < 0) return res.status(400).json({ message: 'Validación: El precio debe ser positivo.' });
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { name, price }, { new: true, runValidators: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Producto no encontrado.' });
        res.status(200).json({ message: 'Producto actualizado.', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto.', error: error.message });
    }
};

// DELETE: Eliminación de recursos
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Producto no encontrado.' });
        await Inventory.deleteOne({ product: req.params.id });
        res.status(200).json({ message: 'Producto e Inventario eliminados.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto.', error: error.message });
    }
};