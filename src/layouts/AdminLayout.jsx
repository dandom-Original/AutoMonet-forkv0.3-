import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiSettings, FiDatabase, FiBarChart2, FiLogOut, FiArrowLeft } from 'react-icons/fi';

const AdminLayout = () => {
  const navigate = useNavigate();
  
  const adminNavigation = [
    { name: 'Dashboard', href: '/admin', icon: FiHome },
    { name: 'Benutzer', href: '/admin/users', icon: FiUsers },
    { name: 'System', href: '/admin/system', icon: FiSettings },
    { name: 'Daten', href: '/admin/data', icon: FiDatabase },
    { name: 'Berichte', href: '/admin/reports', icon: FiBarChart2 },
  ];

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800">
        <div className="flex items-center justify-between px-4 py-6">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-white">AutoMonet Admin</span>
          </div>
        </div>
        
        <nav className="mt-5 px-2">
          {adminNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 mt-1 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-300 hover:bg-slate-700'
                }`
              }
            >
              <item.icon className="mr-3" size={20} />
              {item.name}
            </NavLink>
          ))}
          
          <div className="border-t border-slate-700 mt-6 pt-4">
            <button
              onClick={() => navigate('/')}
              className="flex w-full items-center px-4 py-3 mt-1 rounded-md text-gray-300 hover:bg-slate-700"
            >
              <FiArrowLeft className="mr-3" size={20} />
              Zurück zur App
            </button>
            
            <button
              className="flex w-full items-center px-4 py-3 mt-1 rounded-md text-gray-300 hover:bg-slate-700"
            >
              <FiLogOut className="mr-3" size={20} />
              Abmelden
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-slate-800 shadow-md">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold text-white">Admin-Bereich</h1>
            <div className="flex items-center">
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-300">Admin Mode</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-900 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
