import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import type { Book, Category } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Trash2, Book as BookIcon } from 'lucide-react';

export const BookManager: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newBook, setNewBook] = useState<Partial<Book>>({ title: '', categoryId: '', abbreviation: '', status: 'draft' });

    const load = () => {
        setBooks(storage.getBooks());
        setCategories(storage.getCategories());
    };
    useEffect(load, []);

    const handleSave = () => {
        if (!newBook.title || !newBook.categoryId || !newBook.abbreviation) {
            alert('Title, Category, and Abbreviation are required');
            return;
        }
        storage.addBook({
            id: crypto.randomUUID(),
            categoryId: newBook.categoryId,
            title: newBook.title,
            titleAr: newBook.titleAr || '',
            abbreviation: newBook.abbreviation,
            description: newBook.description || '',
            itemCount: 0,
            status: 'published'
        });
        setNewBook({ title: '', categoryId: '', abbreviation: '', description: '', titleAr: '' });
        setIsAdding(false);
        load();
    };

    const handleDelete = (id: string) => {
        if (confirm('Delete this book?')) {
            storage.deleteBook(id);
            load();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Books</h2>
                <Button onClick={() => setIsAdding(!isAdding)}>{isAdding ? 'Cancel' : 'Add Book'}</Button>
            </div>

            {isAdding && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                        <select
                            className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                            value={newBook.categoryId}
                            onChange={e => setNewBook({ ...newBook, categoryId: e.target.value })}
                        >
                            <option value="">Select Category...</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                    </div>
                    <Input label="Title (English)" value={newBook.title} onChange={e => setNewBook({ ...newBook, title: e.target.value })} />
                    <Input label="Title (Arabic)" value={newBook.titleAr} onChange={e => setNewBook({ ...newBook, titleAr: e.target.value })} className="font-arabic" dir="rtl" />
                    <Input label="Abbreviation (e.g. Bukhari)" value={newBook.abbreviation} onChange={e => setNewBook({ ...newBook, abbreviation: e.target.value })} />
                    <Input label="Description" value={newBook.description} onChange={e => setNewBook({ ...newBook, description: e.target.value })} />
                    <Button onClick={handleSave}>Save Book</Button>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {books.map(book => {
                    const cat = categories.find(c => c.id === book.categoryId);
                    return (
                        <div key={book.id} className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-500 h-fit">
                                        <BookIcon size={20} />
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{cat?.title}</span>
                                        <h3 className="font-medium text-slate-900 dark:text-slate-100">{book.title}</h3>
                                        <p className="font-arabic text-sm text-slate-500 dark:text-slate-400">{book.titleAr}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(book.id)} className="text-red-500 hover:text-red-600">
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
                                <span>Code: {book.abbreviation}</span>
                                <span>{book.itemCount} Items</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
