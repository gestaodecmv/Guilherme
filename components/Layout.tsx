
import React from 'react';
import { AppView } from '../types';
import { Package, ClipboardList, History, LayoutDashboard } from 'lucide-react';

interface LayoutProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  const navItems = [
    { id: 'INVENTORY', label: 'Realizar Contagem', icon: ClipboardList },
    { id: 'PRODUCTS', label: 'Cadastro de Produtos', icon: Package },
    { id: 'HISTORY', label: 'Histórico de Contagens', icon: History },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar - Alterada de bg-slate-900 para bg-gray-100 */}
      <nav className="w-full md:w-64 bg-gray-100 text-gray-800 flex-shrink-0 border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-2 text-xl font-bold mb-8 text-gray-900">
            <LayoutDashboard className="text-blue-600" />
            <span>CONTAGEM DIÁRIA<span className="text-blue-600"> FA</span></span>
          </div>
          
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as AppView)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === item.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
