import React, { useState, useCallback } from 'react';
import './App.css'; // Mantenemos la importación CSS de Vite
import TransactionView from './components/TransactionView';
import ProductList from './components/ProductList'; 
// NOTA: Si creas un componente para el formulario, impórtalo aquí.
// import ProductForm from './components/ProductForm'; 

function App() {
    // Estado para forzar la actualización del listado sin recargar la página.
    // Esto es necesario para cumplir con el requisito de "Actualización de datos sin recarga completa".
    const [updateTrigger, setUpdateTrigger] = useState(0); 

    const refreshList = useCallback(() => {
        setUpdateTrigger(prev => prev + 1);
        console.log("Inventario actualizado después de una transacción.");
    }, []);

    return (
        <div className="App" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <header>
                <h1>🚀 Proyecto Exámen: Transacciones Cliente-Servidor</h1>
                <p>UNIDAD III: Venta de Productos y Gestión de Inventario</p>
            </header>

            <hr style={{ margin: '30px 0' }}/>

            {/* VISTA 1: Gestión de recursos (CRUD) */}
            <section style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '30px' }}>
                <h2>1. Gestión de Recursos (CRUD)</h2>
                {/* Aquí iría ProductForm para registrar nuevos productos. 
                Por simplicidad, solo incluimos la lista.
                */}
                <ProductList updateTrigger={updateTrigger} /> 
            </section>
            
            <hr style={{ margin: '30px 0' }}/>
            
            {/* VISTA 2: Ejecución de la operación transaccional */}
            <section style={{ border: '1px solid #ddd', padding: '15px' }}>
                <TransactionView refreshInventoryList={refreshList} /> 
            </section>
            
        </div>
    );
}

export default App;