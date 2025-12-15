import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import type { Book, Item } from '../../types';
import { Button } from '../common/Button';
import { ArrowLeft, ArrowRight, Book as BookIcon } from 'lucide-react';
import { parseMarkdown } from '../../lib/markdown';

interface ReadingViewProps {
    itemId: string;
    onBack: () => void;
    onNavigate: (id: string) => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ itemId, onBack, onNavigate }) => {
    const [item, setItem] = useState<Item>();
    const [book, setBook] = useState<Book>();
    const [nextId, setNextId] = useState<string>();
    const [prevId, setPrevId] = useState<string>();

    useEffect(() => {
        const currentItem = storage.getItem(itemId);
        if (currentItem) {
            setItem(currentItem);
            setBook(storage.getBook(currentItem.bookId));

            const allItems = storage.getItems(currentItem.bookId);
            const idx = allItems.findIndex(i => i.id === itemId);
            setPrevId(allItems[idx - 1]?.id);
            setNextId(allItems[idx + 1]?.id);
        }
    }, [itemId]);

    if (!item || !book) return <div>Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm mb-8">
                <Button variant="ghost" onClick={onBack} size="sm"><ArrowLeft size={16} className="mr-2" /> Back to {book.title}</Button>
                <div className="flex items-center gap-2">
                    <BookIcon size={16} />
                    <span>{book.title}</span>
                    <span>•</span>
                    <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">{item.referenceDisplay}</span>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                {/* Arabic Section */}
                <div className="p-8 md:p-12 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 relative">
                    <div className="absolute top-4 left-4 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 rounded text-xs uppercase tracking-wide font-bold">Arabic</div>
                    <div
                        className="prose dark:prose-invert prose-lg max-w-none font-arabic text-right leading-relaxed"
                        dir="rtl"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(item.contentAr) }}
                    />
                </div>

                {/* English Section */}
                <div className="p-8 md:p-12 relative">
                    <div className="absolute top-4 right-4 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded text-xs uppercase tracking-wide font-bold">English</div>
                    {item.title && <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{item.title}</h1>}
                    <div
                        className="prose dark:prose-invert prose-lg max-w-none text-slate-800 dark:text-slate-200 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(item.content) }}
                    />
                </div>

                {/* Footer Metadata */}
                <div className="bg-slate-50 dark:bg-slate-950 p-6 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Narrated by:</span> {item.narrator || 'Unknown'}
                    </div>
                    <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Grade:</span> {item.grade || 'Not Graded'}
                    </div>
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center pt-8 border-t border-slate-200 dark:border-slate-800">
                <div>
                    {prevId && (
                        <Button variant="outline" onClick={() => onNavigate(prevId)}>
                            <ArrowLeft size={16} className="mr-2" /> Previous
                        </Button>
                    )}
                </div>
                <div>
                    {nextId && (
                        <Button variant="outline" onClick={() => onNavigate(nextId)}>
                            Next <ArrowRight size={16} className="ml-2" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
