
import React, { useState, useEffect } from 'react';
import { Product, Inventory, InventoryEntry, ProductStatus } from '../types';
import { calculateConsolidated, formatDecimal } from '../utils/calculations';
import { Save, AlertCircle, X, ChevronRight, User, Store, CheckCircle2 } from 'lucide-react';

interface Props {
  products: Product[];
  inventories: Inventory[];
  saveInventory: (inv: Inventory) => void;
  editInventory?: Inventory | null;
  onCancel: () => void;
}

const STORES = [
  "ATIBAIA 44",
  "CAMBUÍ",
  "DOM 66",
  "ESPELHO 66",
  "FERNÃO 29"
].sort((a, b) => a.localeCompare(b));

const InventoryForm: React.FC<Props> = ({ products, inventories, saveInventory, editInventory, onCancel }) => {
  const [responsible, setResponsible] = useState(editInventory?.responsible || '');
  const [store, setStore] = useState(editInventory?.store || '');
  const [date, setDate] = useState(editInventory?.date || new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState<InventoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const activeProducts = products.filter(p => p.status === ProductStatus.Active);

  useEffect(() => {
    if (editInventory) {
      setEntries(editInventory.entries);
    } else {
      // Initialize with 0s for all active products
      const initial = activeProducts.map(p => ({
        productCode: p.code,
        boxes: 0,
        packs: 0,
        units: 0,
        totalConsolidated: 0
      }));
      setEntries(initial);
    }
  }, [editInventory, products]);

  const updateEntry = (code: string, field: keyof InventoryEntry, value: string) => {
    const num = parseFloat(value) || 0;
    if (num < 0) return;

    setEntries(prev => prev.map(e => {
      if (e.productCode === code) {
        const updated = { ...e, [field]: num };
        const product = products.find(p => p.code === code);
        if (product) {
          updated.totalConsolidated = calculateConsolidated(product, updated.boxes, updated.packs, updated.units);
        }
        return updated;
      }
      return e;
    }));
  };

  const handleOpenConfirmation = () => {
    setError(null);
    if (!responsible.trim()) {
      alert('POR FAVOR, PREENCHA O NOME DO RESPONSÁVEL.');
      return;
    }

    if (!store) {
      alert('POR FAVOR, SELECIONE UMA LOJA.');
      return;
    }

    // Regra atualizada: Bloquear apenas se for a MESMA LOJA na MESMA DATA
    const isDuplicateStoreDate = inventories.some(i => 
      i.date === date && 
      i.store === store && 
      i.id !== editInventory?.id
    );

    if (isDuplicateStoreDate) {
      setError(`Já existe um inventário registrado para a loja "${store}" nesta data. Não é permitido salvar contagens duplicadas para a mesma unidade no mesmo dia.`);
      return;
    }

    setShowConfirmModal(true);
  };

  const handleFinalSave = () => {
    const timestamp = new Date().toLocaleString('pt-BR');

    const newInventory: Inventory = {
      id: editInventory?.id || crypto.randomUUID(),
      date,
      responsible,
      store,
      entries,
      createdAt: editInventory?.createdAt || timestamp,
      updatedAt: editInventory ? timestamp : undefined
    };

    saveInventory(newInventory);
    setShowConfirmModal(false);
    onCancel(); 
  };

  // Calcula quantos itens possuem contagem registrada
  const itemsWithCount = entries.filter(e => e.totalConsolidated > 0).length;

  return (
    <div className="space-y-6">
      {/* Confirmation Modal Overlay */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
            <div className="bg-blue-600 p-6 text-white text-center">
              <CheckCircle2 size={48} className="mx-auto mb-2 text-blue-100" />
              <h2 className="text-xl font-bold">Confirmação de Registro</h2>
              <p className="text-blue-100 text-sm">Verifique os dados abaixo antes de salvar</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Loja</span>
                  <span className="font-bold text-gray-900 block truncate">{store}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Data</span>
                  <span className="font-bold text-gray-900 block">{new Date(date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Responsável</span>
                <span className="font-bold text-gray-900 block">{responsible}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100">
                <AlertCircle size={20} className="flex-shrink-0" />
                <span className="text-sm">Total de <strong>{itemsWithCount} itens</strong> com quantidades registradas.</span>
              </div>

              <div className="text-xs text-gray-500 italic text-center px-4 pt-2">
                Uma vez salvo, você poderá encontrar este registro na aba "Histórico" e exportá-lo para Excel.
              </div>
            </div>

            <div className="bg-gray-50 p-6 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-3 text-gray-600 font-semibold hover:bg-gray-200 rounded-xl transition"
              >
                Revisar Contagem
              </button>
              <button 
                onClick={handleFinalSave}
                className="flex-1 px-4 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-100 flex items-center justify-center gap-2"
              >
                <Save size={20} /> Confirmar e Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
            {editInventory ? 'Editar Contagem' : 'Nova Contagem de Inventário'}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Store size={16} /> Loja *
              </label>
              <select 
                value={store}
                onChange={e => setStore(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              >
                <option value="">Selecione a Loja</option>
                {STORES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <User size={16} /> Responsável *
              </label>
              <input 
                type="text" 
                value={responsible}
                onChange={e => setResponsible(e.target.value)}
                placeholder="Nome completo"
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
              <input 
                type="date" 
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">Cancelar</button>
           <button 
             onClick={handleOpenConfirmation}
             className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-semibold"
           >
             <Save size={20} /> Salvar Inventário
           </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 border border-red-200">
          <AlertCircle size={24} className="flex-shrink-0" />
          <div>
            <p className="font-bold">Erro de Validação</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {activeProducts.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300">
             <p className="text-gray-500">Nenhum produto ativo para contagem. Ative produtos no Cadastro primeiro.</p>
          </div>
        ) : (
          activeProducts.map(product => {
            const entry = entries.find(e => e.productCode === product.code) || { 
              boxes: 0, packs: 0, units: 0, totalConsolidated: 0 
            };

            return (
              <div key={product.code} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-4 transition hover:border-blue-200">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded uppercase">
                      {product.code}
                    </span>
                    <span className="text-xs text-gray-400">{product.category}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                </div>

                <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
                  <div className="text-center">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Caixas</label>
                    <input 
                      type="number" 
                      step="0.001"
                      min="0"
                      value={entry.boxes}
                      onChange={e => updateEntry(product.code, 'boxes', e.target.value)}
                      className="w-full md:w-20 border rounded-lg px-2 py-1.5 text-center bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                  <div className="text-center">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Pacotes</label>
                    <input 
                      type="number" 
                      step="0.001"
                      min="0"
                      value={entry.packs}
                      onChange={e => updateEntry(product.code, 'packs', e.target.value)}
                      className="w-full md:w-20 border rounded-lg px-2 py-1.5 text-center bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                  <div className="text-center">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Avulsos ({product.unit})</label>
                    <input 
                      type="number" 
                      step="0.001"
                      min="0"
                      value={entry.units}
                      onChange={e => updateEntry(product.code, 'units', e.target.value)}
                      className="w-full md:w-24 border rounded-lg px-2 py-1.5 text-center bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-48 bg-gray-50 p-2 px-4 rounded-lg border border-gray-100">
                   <ChevronRight className="text-gray-300 hidden md:block" />
                   <div className="flex-1 md:text-right">
                     <span className="block text-[10px] font-bold text-gray-400 uppercase">Consolidado ({product.unit})</span>
                     <span className="text-lg font-bold text-blue-600">{formatDecimal(entry.totalConsolidated)}</span>
                   </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InventoryForm;
