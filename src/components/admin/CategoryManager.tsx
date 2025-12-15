import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import type { Category } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Trash2, FolderOpen } from 'lucide-react';

export const CategoryManager: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newCat, setNewCat] = useState<Partial<Category>>({ title: '', titleAr: '', description: '', icon: 'folder', order: 0 });

    const load = () => setCategories(storage.getCategories());
    useEffect(load, []);

    const handleSave = () => {
        if (!newCat.title) return;
        storage.addCategory({
            id: crypto.randomUUID(),
            title: newCat.title,
            titleAr: newCat.titleAr || '',
            description: newCat.description || '',
            icon: newCat.icon || 'folder',
            order: categories.length + 1
        });
        setNewCat({ title: '', titleAr: '', description: '', icon: 'folder', order: 0 });
        setIsAdding(false);
        load();
    };

    const handleDelete = (id: string) => {
        if (confirm('Delete this category?')) {
            storage.deleteCategory(id);
            load();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Categories</h2>
                <Button onClick={() => setIsAdding(!isAdding)}>{isAdding ? 'Cancel' : 'Add Category'}</Button>
            </div>

            {isAdding && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
                    <Input label="Title (English)" value={newCat.title} onChange={e => setNewCat({ ...newCat, title: e.target.value })} />
                    <Input label="Title (Arabic)" value={newCat.titleAr} onChange={e => setNewCat({ ...newCat, titleAr: e.target.value })} className="font-arabic" dir="rtl" />
                    <Input label="Description" value={newCat.description} onChange={e => setNewCat({ ...newCat, description: e.target.value })} />
                    <Button onClick={handleSave}>Save Category</Button>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map(cat => (
                    <div key={cat.id} className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-start">
                        <div className="flex gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded text-amber-600 dark:text-amber-500">
                                <FolderOpen size={20} />
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-900 dark:text-slate-100">{cat.title}</h3>
                                <p className="font-arabic text-sm text-slate-500 dark:text-slate-400 mb-1">{cat.titleAr}</p>
                                <p className="text-xs text-slate-500">{cat.description}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                            <Trash2 size={16} />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};
