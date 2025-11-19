import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Navbar from './components/Navbar';
import InventoryView from './components/InventoryView';
import SalesView from './components/SalesView';

function App() {
  const [products, setProducts] = useState([]);
  const [activeView, setActiveView] = useState('inventory');
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen pb-12 relative overflow-hidden">
      {/* Fondo decorativo con efectos modernos */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Toaster con estilos mejorados */}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'glass-card !bg-white/95 !backdrop-blur-xl !shadow-2xl',
          duration: 3000,
          style: {
            borderRadius: '1rem',
            padding: '16px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* Navbar con efecto de glassmorphism */}
      <div className="sticky top-0 z-50 animate-slide-down">
        <Navbar activeView={activeView} setActiveView={setActiveView} />
      </div>
      
      {/* Contenedor principal con animaciones */}
      <main className="section-container">
        <div className="animate-fade-in-up">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="loading-spinner mx-auto mb-4"></div>
                <p className="text-slate-600 font-medium">Cargando datos...</p>
              </div>
            </div>
          ) : (
            <div className="transition-all duration-500">
              {activeView === 'inventory' ? (
                <InventoryView products={products} />
              ) : (
                <SalesView products={products} onTransactionComplete={fetchProducts} />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer decorativo */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 bg-white/80 backdrop-blur-lg border-t border-white/20 shadow-lg z-40">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-600">
            Sistema de Gestión de Inventario
            <span className="mx-2">•</span>
            <span className="inline-flex items-center">
              <span className="status-indicator active"></span>
              Sistema activo
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;