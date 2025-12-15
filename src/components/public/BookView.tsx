import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import type { Book, Item } from '../../types';
import { Button } from '../common/Button';
import { ArrowLeft } from 'lucide-react';
import { Input } from '../common/Input';

interface BookViewProps {
    bookId: string;
    onNavigate: (view: 'item', id: string) => void;
    onBack: () => void;
}

export const BookView: React.FC<BookViewProps> = ({ bookId, onNavigate, onBack }) => {
    const [book, setBook] = useState<Book>();
    const [items, setItems] = useState<Item[]>([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        setBook(storage.getBook(bookId));
        setItems(storage.getItems(bookId));
    }, [bookId]);

    if (!book) return <div>Loading...</div>;

    const filteredItems = items.filter(i =>
        i.content.toLowerCase().includes(filter.toLowerCase()) ||
        i.referenceDisplay.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <Button variant="ghost" onClick={onBack} className="self-start pl-0"><ArrowLeft size={16} className="mr-2" /> Back to Dashboard</Button>
                <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-700 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{book.title}</h1>
                        <h2 className="text-xl text-slate-500 font-arabic">{book.titleAr}</h2>
                    </div>
                    <div className="w-64">
                        <Input
                            placeholder="Search currently loaded items..."
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                            className="h-9 text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {filteredItems.map(item => (
                    <div
                        key={item.id}
                        onClick={() => onNavigate('item', item.id)}
                        className="group p-4 bg-white dark:bg-slate-915 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg cursor-pointer transition-colors flex gap-4"
                    >
                        <div className="w-24 shrink-0 pt-1">
                            <span className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-xs font-mono font-bold">
                                {item.referenceDisplay}
                            </span>
                        </div>
                        <div className="flex-1">
                            {item.title && <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{item.title}</h3>}
                            <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">{item.content.replace(/[#*`>]/g, '')}</p>
                        </div>
                    </div>
                ))}
                {filteredItems.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        No items found.
                    </div>
                )}
            </div>
        </div>
    );
};
