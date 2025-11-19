import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Loader, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const SalesView = ({ products, onTransactionComplete }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleTransaction = async (e) => {
    e.preventDefault();
    
    if (!selectedProduct || quantity <= 0) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/transaction', {
        product_id: selectedProduct,
        quantity: parseInt(quantity)
      });

      if (response.data.status === 'SUCCESS') {
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="font-semibold">¡Venta exitosa!</p>
              <p className="text-sm">{response.data.message}</p>
            </div>
          </div>,
          { duration: 4000 }
        );
        setSelectedProduct('');
        setQuantity(1);
        onTransactionComplete();
      }
    } catch (error) {
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          <div>
            <p className="font-semibold">Error en la transacción</p>
            <p className="text-sm">{error.response?.data?.message || 'Intenta nuevamente'}</p>
          </div>
        </div>,
        { duration: 5000 }
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedProductData = products.find(p => p._id === selectedProduct);
  const totalAmount = selectedProductData ? selectedProductData.price * quantity : 0;

  return (
    <div className="max-w-2xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Punto de Venta</h2>
        <p className="text-slate-500">Procesar transacciones con integridad ACID</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-8"
      >
        <form onSubmit={handleTransaction} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Seleccionar Producto
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="input-field"
              disabled={loading}
            >
              <option value="">-- Elige un producto --</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} - Stock: {product.quantity_available} - ${product.price.toLocaleString('es-MX')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Cantidad
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="input-field"
              disabled={loading}
              placeholder="Ingresa la cantidad"
            />
          </div>

          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 border border-primary-200"
            >
              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-medium">Total a pagar:</span>
                <span className="text-2xl font-bold text-primary-600">
                  ${totalAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading || !selectedProduct}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Ejecutar Transacción
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SalesView;