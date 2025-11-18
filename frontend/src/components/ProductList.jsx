// frontend/src/components/ProductList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/products'; // Confirma tu puerto de Backend

const ProductList = ({ updateTrigger }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para obtener los productos y su inventario
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_BASE);
            setProducts(response.data);
        } catch (err) {
            setError('Error al cargar la lista de productos. Asegúrate de que el Backend esté corriendo en el puerto 5000.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Se ejecuta al montar y cuando el App.jsx pide una actualización (updateTrigger)
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts, updateTrigger]); 

    // Aquí iría la lógica para handleDelete (DELETE API)
    const handleDelete = async (id) => {
        if (!window.confirm('¿Confirmar eliminación del producto e inventario?')) return;
        try {
            await axios.delete(`${API_BASE}/${id}`);
            fetchProducts(); // Refrescar la lista después de eliminar
        } catch (err) {
            alert('Error al eliminar producto: ' + (err.response?.data?.message || 'Error de conexión'));
        }
    };
    
    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p style={{color: 'red'}}>{error}</p>;

    return (
        <div>
            <h4>Inventario Actual</h4>
            <p>El campo "Stock" se actualizará automáticamente después de una transacción.</p>
            <table border="1" width="100%" style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock Disponible</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                         <tr><td colSpan="4">No hay productos. Usa un formulario (POST) para agregar.</td></tr>
                    ) : (
                        products.map(p => (
                            <tr key={p._id}>
                                <td>{p.name}</td>
                                <td>${p.price?.toFixed(2) || 'N/A'}</td>
                                <td>{p.quantity_available}</td>
                                <td>
                                    {/* Aquí puedes agregar un botón de Editar (PUT) */}
                                    <button onClick={() => handleDelete(p._id)} style={{ marginLeft: '10px' }}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;