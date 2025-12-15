import React, { useState } from 'react';
import { Book, Settings, Moon, Sun, Search, Menu, X } from 'lucide-react';
import { Button } from '../common/Button';

interface SidebarProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ darkMode, toggleDarkMode, activeTab, onTabChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { id: 'books', label: 'Books', icon: <Book size={20} /> },
        { id: 'search', label: 'Search', icon: <Search size={20} /> },
        { id: 'admin', label: 'Manage Content', icon: <Settings size={20} /> },
    ];

    const handleNavClick = (tabId: string) => {
        onTabChange(tabId);
        setIsOpen(false); // Close sidebar on mobile after clicking
    };

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-2 bg-slate-800 text-white rounded-lg md:hidden shadow-lg"
                aria-label="Toggle menu"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:relative z-40 w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}>
                <div className="p-6 pt-16 md:pt-6">
                    <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                        <span className="text-amber-500 text-2xl">☪</span> Portal
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">Islamic Knowledge Base</p>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
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
        </>
    );
};
