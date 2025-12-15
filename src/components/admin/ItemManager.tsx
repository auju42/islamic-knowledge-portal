import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import type { Book, Item } from '../../types';
import { Button } from '../common/Button';
import { ItemEditor } from './ItemEditor';
import { Edit, Trash2, Plus } from 'lucide-react';

export const ItemManager: React.FC = () => {
    const [selectedBookId, setSelectedBookId] = useState<string>('');
    const [books, setBooks] = useState<Book[]>([]);
    const [items, setItems] = useState<Item[]>([]);

    const [editingItem, setEditingItem] = useState<Partial<Item> | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const loadBooks = () => setBooks(storage.getBooks());
    const loadItems = () => {
        if (selectedBookId) {
            setItems(storage.getItems(selectedBookId));
        } else {
            setItems([]);
        }
    };

    useEffect(() => {
        loadBooks();
    }, []);

    useEffect(() => {
        loadItems();
    }, [selectedBookId]);

    const handleDelete = (id: string) => {
        if (confirm('Delete this item?')) {
            storage.deleteItem(id);
            loadItems();
        }
    };

    if (isEditing && selectedBookId) {
        return (
            <ItemEditor
                bookId={selectedBookId}
                initialItem={editingItem || undefined}
                onSave={() => {
                    setIsEditing(false);
                    setEditingItem(null);
                    loadItems();
                }}
                onCancel={() => {
                    setIsEditing(false);
                    setEditingItem(null);
                }}
            />
        );
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Manage Content</h2>
            </div>

            {/* Book Selector */}
            <div className="flex gap-4 items-end">
                <div className="flex-1 max-w-md">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Book to Manage</label>
                    <select
                        className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                        value={selectedBookId}
                        onChange={e => setSelectedBookId(e.target.value)}
                    >
                        <option value="">-- Choose Book --</option>
                        {books.map(b => <option key={b.id} value={b.id}>{b.title} ({b.abbreviation})</option>)}
                    </select>
                </div>
                <Button
                    disabled={!selectedBookId}
                    onClick={() => {
                        setEditingItem(null);
                        setIsEditing(true);
                    }}
                >
                    <Plus size={16} className="mr-2" />
                    Add New Item
                </Button>
            </div>

            {/* Items List */}
            {selectedBookId ? (
                <div className="flex-1 overflow-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                            <tr>
                                <th className="p-4 w-24">Global #</th>
                                <th className="p-4 w-24">Ref</th>
                                <th className="p-4">Content Preview</th>
                                <th className="p-4 w-32">Status</th>
                                <th className="p-4 w-32 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {items.length === 0 && (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-400">No items found. Add one!</td></tr>
                            )}
                            {items.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-4 font-mono">{item.globalNumber}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded text-xs font-bold">
                                            {item.referenceDisplay}
                                        </span>
                                    </td>
                                    <td className="p-4 max-w-md truncate" title={item.content}>
                                        {item.content.replace(/[#*`>]/g, '').substring(0, 60)}...
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button onClick={() => { setEditingItem(item); setIsEditing(true); }} className="p-1 hover:text-blue-500"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-1 hover:text-red-500"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                    Select a book to manage its items
                </div>
            )}
        </div>
    );
};
