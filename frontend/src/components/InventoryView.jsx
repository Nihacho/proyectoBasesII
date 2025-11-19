import { motion } from 'framer-motion';
import { Package, DollarSign, Hash } from 'lucide-react';

const InventoryView = ({ products }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Inventario Actual</h2>
        <p className="text-slate-500">Gestión y monitoreo de recursos</p>
      </motion.div>

      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl p-12 text-center"
        >
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No hay productos registrados</p>
          <p className="text-slate-400 text-sm mt-2">Usa Postman para agregar productos</p>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {products.map((product) => (
            <motion.div
              key={product._id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-primary-600" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  product.quantity_available > 10
                    ? 'bg-success-50 text-success-600'
                    : product.quantity_available > 5
                    ? 'bg-yellow-50 text-yellow-600'
                    : 'bg-danger-50 text-danger-600'
                }`}>
                  {product.quantity_available > 10 ? 'Stock Alto' : 
                   product.quantity_available > 5 ? 'Stock Medio' : 'Stock Bajo'}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-4">{product.name}</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Precio</span>
                  </div>
                  <span className="text-lg font-bold text-primary-600">
                    ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Hash className="w-4 h-4" />
                    <span className="text-sm">Disponible</span>
                  </div>
                  <span className="text-lg font-bold text-slate-700">
                    {product.quantity_available} unidades
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default InventoryView;