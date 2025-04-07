import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FiHome, FiBriefcase, FiFileText, FiBarChart2, FiSettings, FiMenu, FiX, FiUser, FiLogOut, FiBell, FiSun, FiMoon } from 'react-icons/fi';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  const navItems = [
    { name: 'Dashboard', to: '/', icon: <FiHome /> },
    { name: 'Jobs', to: '/jobs', icon: <FiBriefcase /> },
    { name: 'Proposals', to: '/proposals', icon: <FiFileText /> },
    { name: 'Analytics', to: '/analytics', icon: <FiBarChart2 /> },
    { name: 'Settings', to: '/settings', icon: <FiSettings /> }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-200">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-0`}>
        <div className="glass-card h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 w-8 h-8 flex items-center justify-center rounded-lg shadow-glow">A</div>
              <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">AutoMonet</span>
            </div>
            <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-white">
              <FiX size={20} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map(item => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' : 'hover:bg-slate-700/50 hover:text-white text-slate-300'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <FiUser size={16} />
              </div>
              <div className="flex-1">
                <div className="font-medium">AI Freelancer</div>
                <div className="text-xs text-slate-400">Autonomous System</div>
              </div>
              <button className="text-slate-400 hover:text-white">
                <FiLogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="glass-card flex items-center justify-between px-6 py-4 border-b border-slate-700 z-10">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-white">
              <FiMenu size={24} />
            </button>
            <div className="hidden md:block text-slate-400 text-sm">
              {new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">
              <FiBell size={18} />
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm font-medium text-slate-300">System Active</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
