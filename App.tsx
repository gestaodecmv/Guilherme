
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ProductManagement from './components/ProductManagement';
import InventoryForm from './components/InventoryForm';
import HistoryList from './components/HistoryList';
import { Product, Inventory, AppView } from './types';

const STORAGE_KEY_PRODUCTS = 'invtrack_products';
const STORAGE_KEY_INVENTORIES = 'invtrack_history';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('INVENTORY');
  const [products, setProducts] = useState<Product[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [editingInventory, setEditingInventory] = useState<Inventory | null>(null);

  // Load data
  useEffect(() => {
    const savedProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    const savedInventories = localStorage.getItem(STORAGE_KEY_INVENTORIES);

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedInventories) setInventories(JSON.parse(savedInventories));
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_INVENTORIES, JSON.stringify(inventories));
  }, [inventories]);

  const saveInventory = (newInv: Inventory) => {
    setInventories(prev => {
      const index = prev.findIndex(i => i.id === newInv.id);
      if (index > -1) {
        // Edit
        const updated = [...prev];
        updated[index] = newInv;
        return updated;
      }
      // New
      return [...prev, newInv];
    });
    setEditingInventory(null);
  };

  const handleEditHistory = (inv: Inventory) => {
    setEditingInventory(inv);
    setView('INVENTORY');
  };

  const handleDeleteHistory = (id: string) => {
    const password = prompt('Para excluir esta contagem, digite a senha de autorização:');
    
    if (password === null) return; // Usuário cancelou o prompt

    if (password === '102030') {
      if (confirm('ATENÇÃO: A exclusão do histórico é irreversível. Deseja realmente prosseguir com a exclusão desta contagem?')) {
        setInventories(prev => prev.filter(i => i.id !== id));
      }
    } else {
      alert('SENHA INCORRETA. A exclusão não foi autorizada.');
    }
  };

  const handleCancelInventory = () => {
    setEditingInventory(null);
    if (view === 'INVENTORY' && inventories.length > 0) {
      setView('HISTORY');
    }
  };

  return (
    <Layout currentView={view} setView={(v) => { setView(v); setEditingInventory(null); }}>
      {view === 'PRODUCTS' && (
        <ProductManagement products={products} setProducts={setProducts} />
      )}
      {view === 'INVENTORY' && (
        <InventoryForm 
          products={products} 
          inventories={inventories} 
          saveInventory={saveInventory}
          editInventory={editingInventory}
          onCancel={handleCancelInventory}
        />
      )}
      {view === 'HISTORY' && (
        <HistoryList 
          inventories={inventories} 
          products={products} 
          onEdit={handleEditHistory} 
          onDelete={handleDeleteHistory}
        />
      )}
    </Layout>
  );
};

export default App;
