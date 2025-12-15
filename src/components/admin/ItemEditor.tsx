import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import type { Book, Item } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { MarkdownEditor } from '../editor/MarkdownEditor';

interface ItemEditorProps {
    initialItem?: Partial<Item>;
    bookId: string;
    onSave: () => void;
    onCancel: () => void;
}

export const ItemEditor: React.FC<ItemEditorProps> = ({ initialItem, bookId, onSave, onCancel }) => {
    const [item, setItem] = useState<Partial<Item>>({
        globalNumber: 0,
        bookNumber: 0,
        chapterNumber: 0,
        content: '',
        contentAr: '',
        status: 'draft',
        grade: '',
        narrator: '',
        ...initialItem
    });

    const [book, setBook] = useState<Book | undefined>(undefined);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const b = storage.getBook(bookId);
        setBook(b);
        // If new item, suggest next numbers?
        if (!initialItem && b) {
            const existingItems = storage.getItems(bookId);
            const maxGlobal = Math.max(0, ...existingItems.map(i => i.globalNumber));
            const maxChapter = Math.max(0, ...existingItems.map(i => i.chapterNumber)); // Approximate
            setItem(prev => ({
                ...prev,
                globalNumber: maxGlobal + 1,
                bookNumber: 1, // Default or previous?
                chapterNumber: maxChapter + 1
            }));
        }
    }, [bookId, initialItem]);

    const validate = (): boolean => {
        if (!item.globalNumber || !item.bookNumber || !item.chapterNumber) {
            setError('All numbering fields are required.');
            return false;
        }
        if (!item.content) {
            setError('English content is required.');
            return false;
        }

        // Check duplicates
        const existing = storage.getItems(bookId);
        const duplicateGlobal = existing.find(i => i.globalNumber === item.globalNumber && i.id !== item.id);
        if (duplicateGlobal) {
            setError(`Global Number ${item.globalNumber} already exists in this book.`);
            return false;
        }

        const duplicateChapter = existing.find(i =>
            i.bookNumber === item.bookNumber &&
            i.chapterNumber === item.chapterNumber &&
            i.id !== item.id
        );
        if (duplicateChapter) {
            // Warning or Error? Prompt said "Book + Chapter combination is unique"
            setError(`Book ${item.bookNumber}, Hadith ${item.chapterNumber} already exists.`);
            return false;
        }

        setError('');
        return true;
    };

    const handleSave = () => {
        if (!validate()) return;
        if (!book) return;

        const refDisplay = `${book.abbreviation} ${item.globalNumber}`;

        const newItem: Item = {
            id: item.id || crypto.randomUUID(),
            bookId,
            globalNumber: Number(item.globalNumber),
            bookNumber: Number(item.bookNumber),
            chapterNumber: Number(item.chapterNumber),
            referenceDisplay: refDisplay,
            title: item.title || '',
            titleAr: item.titleAr || '',
            content: item.content || '',
            contentAr: item.contentAr || '',
            narrator: item.narrator || '',
            grade: item.grade || '',
            status: item.status || 'draft',
            createdAt: item.createdAt || Date.now(),
            updatedAt: Date.now()
        };

        if (item.id) {
            storage.updateItem(newItem);
        } else {
            try {
                storage.addItem(newItem);
            } catch (e: any) {
                setError(e.message);
                return;
            }
        }
        onSave();
    };

    if (!book) return <div>Loading Book...</div>;

    return (
        <div className="space-y-8 bg-white dark:bg-slate-900 min-h-screen pb-20">
            <div className="flex justify-between items-center sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 py-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold dark:text-white">
                    {item.id ? 'Edit Item' : 'New Hadith/Item'} <span className="text-slate-500 font-normal">in {book.title}</span>
                </h2>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button onClick={handleSave}>Save Item</Button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                    {error}
                </div>
            )}

            {/* Numbering Section */}
            <section className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Numbering System (Mandatory)</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Input
                        label="Global Number"
                        type="number"
                        value={item.globalNumber}
                        onChange={e => setItem({ ...item, globalNumber: Number(e.target.value) })}
                        help="Unique sequential number in the entire collection"
                    />
                    <Input
                        label="Book/Vol Number"
                        type="number"
                        value={item.bookNumber}
                        onChange={e => setItem({ ...item, bookNumber: Number(e.target.value) })}
                    />
                    <Input
                        label="Item/Chapter Number"
                        type="number"
                        value={item.chapterNumber}
                        onChange={e => setItem({ ...item, chapterNumber: Number(e.target.value) })}
                    />
                    <div className="flex flex-col justify-end">
                        <div className="text-sm font-medium text-slate-500 mb-1">Preview Reference</div>
                        <div className="h-10 px-3 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded font-mono font-bold flex items-center">
                            {book.abbreviation} {item.globalNumber}
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <section className="space-y-4">
                    <Input label="Title (Functional/English)" value={item.title} onChange={e => setItem({ ...item, title: e.target.value })} placeholder="e.g. Actions are by intentions" />
                    <MarkdownEditor
                        label="Content (English)"
                        value={item.content || ''}
                        onChange={val => setItem({ ...item, content: val })}
                    />
                </section>
                <section className="space-y-4">
                    <Input label="Title (Arabic)" value={item.titleAr} onChange={e => setItem({ ...item, titleAr: e.target.value })} className="font-arabic" dir="rtl" />
                    <MarkdownEditor
                        label="Content (Arabic)"
                        value={item.contentAr || ''}
                        onChange={val => setItem({ ...item, contentAr: val })}
                        isArabic
                    />
                </section>
            </div>

            {/* Metadata */}
            <section className="p-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label="Narrator" value={item.narrator} onChange={e => setItem({ ...item, narrator: e.target.value })} />
                <Input label="Grade" value={item.grade} onChange={e => setItem({ ...item, grade: e.target.value })} placeholder="Sahih, Hasan..." />
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                    <select
                        className="h-10 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                        value={item.status}
                        onChange={e => setItem({ ...item, status: e.target.value as any })}
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
            </section>
        </div>
    );
};
