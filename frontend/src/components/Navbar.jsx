import { Package, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ activeView, setActiveView }) => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-card sticky top-0 z-50 mb-8"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-xl shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Sistema de Inventario
              </h1>
              <p className="text-xs text-slate-500">Gestión Transaccional</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView('inventory')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                activeView === 'inventory'
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'text-slate-600 hover:bg-white/50'
              }`}
            >
              <Package className="w-4 h-4" />
              Inventario
            </button>
            <button
              onClick={() => setActiveView('sales')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                activeView === 'sales'
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'text-slate-600 hover:bg-white/50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Punto de Venta
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;