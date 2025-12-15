import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import type { Category, Book } from '../../types';
import { Book as BookIcon, FolderOpen, ChevronRight } from 'lucide-react';

interface DashboardProps {
    onNavigate: (view: 'book', id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        setCategories(storage.getCategories());
        setBooks(storage.getBooks());
    }, []);

    return (
        <div className="space-y-8">
            <div className="text-center py-10">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 font-serif">Islamic Knowledge Portal</h1>
                <p className="text-slate-500 dark:text-slate-400">Explore authentic collections and knowledge</p>
            </div>

            <div className="grid gap-8">
                {categories.map(cat => {
                    const catBooks = books.filter(b => b.categoryId === cat.id);
                    return (
                        <div key={cat.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 rounded-lg">
                                    <FolderOpen size={24} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{cat.title}</h2>
                                    <p className="text-sm text-slate-500 font-arabic">{cat.titleAr}</p>
                                </div>
                            </div>

                            <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {catBooks.length > 0 ? (
                                    catBooks.map(book => (
                                        <button
                                            key={book.id}
                                            onClick={() => onNavigate('book', book.id)}
                                            className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30 hover:bg-amber-50 dark:hover:bg-amber-900/10 border border-slate-200 dark:border-slate-700 hover:border-amber-200 transition-all text-left group"
                                        >
                                            <BookIcon className="text-slate-400 group-hover:text-amber-500 transition-colors mt-1" size={24} />
                                            <div>
                                                <h3 className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-amber-700 dark:group-hover:text-amber-400">{book.title}</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 font-arabic mb-1">{book.titleAr}</p>
                                                <p className="text-xs text-slate-400">{book.itemCount} Items</p>
                                            </div>
                                            <ChevronRight className="ml-auto text-slate-300 group-hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-all" size={20} />
                                        </button>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-8 text-slate-400 text-sm italic">
                                        No books available in this category yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
