
import React from 'react';
import { Inventory, Product } from '../types';
import { FileDown, Edit, Trash2, Calendar, User, Clock, Store } from 'lucide-react';
import { exportInventoryToExcel } from '../utils/excelExport';

interface Props {
  inventories: Inventory[];
  products: Product[];
  onEdit: (inv: Inventory) => void;
  onDelete: (id: string) => void;
}

const HistoryList: React.FC<Props> = ({ inventories, products, onEdit, onDelete }) => {
  const sortedInventories = [...inventories].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Histórico de Contagens</h1>

      <div className="grid grid-cols-1 gap-4">
        {sortedInventories.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Nenhum inventário registrado no histórico.</p>
          </div>
        ) : (
          sortedInventories.map(inv => (
            <div key={inv.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center gap-6 group">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                    <Store size={20} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Loja</span>
                    <span className="font-bold text-gray-800">{inv.store}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Data</span>
                    <span className="font-bold text-gray-800">{new Date(inv.date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-lg text-green-600">
                    <User size={20} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Responsável</span>
                    <span className="font-medium text-gray-700">{inv.responsible}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">1º Lançamento</span>
                    <span className="text-sm text-gray-600">{inv.createdAt}</span>
                  </div>
                </div>

                {inv.updatedAt && (
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                      <Clock size={20} />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase">Última Edição</span>
                      <span className="text-sm text-gray-600">{inv.updatedAt}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                <button 
                  onClick={() => exportInventoryToExcel(inv, products)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-green-700 hover:bg-green-50 rounded-lg transition border border-green-200 font-medium"
                >
                  <FileDown size={18} /> Exportar
                </button>
                <button 
                  onClick={() => onEdit(inv)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition border border-transparent hover:border-blue-100"
                  title="Reabrir contagem"
                >
                  <Edit size={20} />
                </button>
                <button 
                  onClick={() => onDelete(inv.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100"
                  title="Excluir contagem"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryList;
