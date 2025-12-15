import React from 'react';
import { Book, LayoutDashboard, Settings, Moon, Sun, Search } from 'lucide-react';
import { Button } from '../common/Button';

interface SidebarProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ darkMode, toggleDarkMode, activeTab, onTabChange }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'books', label: 'Books', icon: <Book size={20} /> },
        { id: 'search', label: 'Search', icon: <Search size={20} /> },
        { id: 'admin', label: 'Manage Content', icon: <Settings size={20} /> },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
            <div className="p-6">
                <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <span className="text-amber-500 text-2xl">☪</span> Portal
                </h1>
                <p className="text-xs text-slate-500 mt-1">Islamic Knowledge Base</p>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${activeTab === item.id
                                ? 'bg-amber-600/10 text-amber-500'
                                : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 hover:bg-slate-800 hover:text-slate-200"
                    onClick={toggleDarkMode}
                >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </Button>
            </div>
        </aside>
    );
};
