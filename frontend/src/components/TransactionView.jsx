// frontend/src/components/TransactionView.jsx
import React, { useState } from 'react';
import axios from 'axios';

const API_ENDPOINT = 'http://localhost:5000/api/sales/process'; // Ajusta si el puerto es diferente

const TransactionView = ({ refreshInventoryList }) => {
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleProcessSale = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);

        try {
            // Consumo de API con axios [cite: 35]
            const response = await axios.post(API_ENDPOINT, { 
                productId, 
                quantity: Number(quantity) 
            });
            
            // Transacción exitosa
            setResult({ 
                status: 'SUCCESS', 
                message: response.data.message, 
                data: response.data 
            });
            // Actualización de datos después de la operación (simulado) [cite: 32]
            if (refreshInventoryList) refreshInventoryList(); 

        } catch (error) {
            // Transacción revertida (Rollback)
            const data = error.response ? error.response.data : {};
            setResult({ 
                status: 'FAILURE', 
                message: data.message || 'Error de conexión/servidor. La transacción fue revertida.', 
                data: data 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getResultStyle = () => {
        if (!result) return {};
        const color = result.status === 'SUCCESS' ? 'green' : 'red';
        return { border: `2px solid ${color}`, backgroundColor: `${color}10` };
    };

    return (
        <div className="transaction-container">
            <h3>🛒 Vista 2: Ejecución de la Transacción (Venta)</h3>
            <form onSubmit={handleProcessSale}>
                <label>ID de Producto (a Vender):</label>
                <input 
                    type="text" 
                    value={productId} 
                    onChange={(e) => setProductId(e.target.value)} 
                    placeholder="Ej. 60f..."
                    required 
                />
                
                <label>Cantidad:</label>
                <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    required 
                />
                
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Procesando Transacción...' : 'Ejecutar Transacción'}
                </button>
            </form>

            <div className="result-visualization" style={getResultStyle()}>
                {result && (
                    <>
                        <h4>Resultado: {result.status}</h4>
                        <p><strong>Mensaje:</strong> {result.message}</p> {/* Mensajes claros de éxito y error [cite: 37] */}
                        
                        {/* Visualización del dato que retorna la operación del backend [cite: 33] */}
                        <p>Datos retornados:</p>
                        <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#fff', padding: '5px' }}>
                            {JSON.stringify(result.data, null, 2)}
                        </pre>
                    </>
                )}
            </div>
        </div>
    );
};

export default TransactionView;