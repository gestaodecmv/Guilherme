
import React, { useState } from 'react';
import { Product, UnitType, ProductStatus } from '../types';
import { Plus, Trash2, Edit2, Check, X, AlertCircle } from 'lucide-react';

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductManagement: React.FC<Props> = ({ products, setProducts }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Product>({
    code: '',
    name: '',
    category: '',
    unit: UnitType.UN,
    factorBox: 0,
    factorPack: 0,
    factorUnit: 1,
    status: ProductStatus.Active
  });

  const handleSave = () => {
    if (!formData.code || !formData.name) {
      setError('Código e Nome são obrigatórios.');
      return;
    }

    const isDuplicate = products.some(p => p.code === formData.code && p.code !== editingCode);
    if (isDuplicate) {
      setError('Este código de material já está cadastrado.');
      return;
    }

    if (editingCode) {
      setProducts(prev => prev.map(p => p.code === editingCode ? formData : p));
    } else {
      setProducts(prev => [...prev, formData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      category: '',
      unit: UnitType.UN,
      factorBox: 0,
      factorPack: 0,
      factorUnit: 1,
      status: ProductStatus.Active
    });
    setIsAdding(false);
    setEditingCode(null);
    setError(null);
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditingCode(product.code);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (code: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(prev => prev.filter(p => p.code !== code));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Cadastro de Produtos</h1>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} /> Novo Produto
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">{editingCode ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2 border border-red-100">
              <AlertCircle size={20} /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código do Material *</label>
              <input 
                type="text" 
                value={formData.code}
                disabled={!!editingCode}
                onChange={e => setFormData({...formData, code: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <input 
                type="text" 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidade Padrão</label>
              <select 
                value={formData.unit}
                onChange={e => setFormData({...formData, unit: e.target.value as UnitType})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value={UnitType.UN}>UN (Unidade)</option>
                <option value={UnitType.KG}>KG (Quilograma)</option>
                <option value={UnitType.L}>L (Litro)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fator: Quantidade p/ Caixa</label>
              <input 
                type="number" 
                step="0.001"
                min="0"
                value={formData.factorBox}
                onChange={e => setFormData({...formData, factorBox: parseFloat(e.target.value) || 0})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fator: Quantidade p/ Pacote</label>
              <input 
                type="number" 
                step="0.001"
                min="0"
                value={formData.factorPack}
                onChange={e => setFormData({...formData, factorPack: parseFloat(e.target.value) || 0})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fator: Qtd p/ Unid. Avulsa</label>
              <input 
                type="number" 
                step="0.001"
                min="0"
                value={formData.factorUnit}
                onChange={e => setFormData({...formData, factorUnit: parseFloat(e.target.value) || 0})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as ProductStatus})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value={ProductStatus.Active}>Ativo</option>
                <option value={ProductStatus.Inactive}>Inativo</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button 
              onClick={resetForm}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Check size={20} /> Salvar Produto
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Cód.</th>
                <th className="px-6 py-4 font-semibold">Nome</th>
                <th className="px-6 py-4 font-semibold">Unid.</th>
                <th className="px-6 py-4 font-semibold">Fatores (Cx/Pc/Un)</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Nenhum produto cadastrado.</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.code} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{p.code}</td>
                    <td className="px-6 py-4">
                      <div>{p.name}</div>
                      <div className="text-xs text-gray-400">{p.category || 'Sem categoria'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-600">{p.unit}</td>
                    <td className="px-6 py-4 text-sm">
                      {p.factorBox} / {p.factorPack} / {p.factorUnit}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        p.status === ProductStatus.Active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(p.code)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
