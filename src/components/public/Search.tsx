import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import type { Book, Item } from '../../types';
import { Input } from '../common/Input';
import { Search as SearchIcon, BookOpen } from 'lucide-react';


interface SearchProps {
    onNavigate: (view: 'item', id: string) => void;
}

export const Search: React.FC<SearchProps> = ({ onNavigate }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ item: Item, book: Book, matchType: 'ref' | 'text' }[]>([]);
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        setBooks(storage.getBooks());
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const q = query.toLowerCase().trim();
        const allItems = storage.getItems(); // Get all items from all books? storage.getItems() returns items from store. 
        // Wait, storage.getItems() loads all? Yes, implementation: `this.get<Item>(KEYS.ITEMS)`.

        // 1. Reference Parsing
        // "Bukhari 256" -> Book abbreviation "Bukhari", Global 256
        // "Bukhari 2:25" -> Book abbreviation "Bukhari", Book 2, Chapter 25

        const refResults: typeof results = [];
        const textResults: typeof results = [];

        // Helper to find book
        const findBook = (abbr: string) => books.find(b => b.abbreviation.toLowerCase() === abbr.toLowerCase());

        // Regex for "Abbr Num"
        const simpleRef = /^([a-zA-Z]+)\s+(\d+)$/;
        const complexRef = /^([a-zA-Z]+)\s+(\d+):(\d+)$/;

        const simpleMatch = q.match(simpleRef);
        const complexMatch = q.match(complexRef);

        if (simpleMatch) {
            const bookAbbr = simpleMatch[1];
            const globalNum = parseInt(simpleMatch[2]);
            const book = findBook(bookAbbr);
            if (book) {
                const item = allItems.find(i => i.bookId === book.id && i.globalNumber === globalNum);
                if (item) refResults.push({ item, book, matchType: 'ref' });
            }
        }

        if (complexMatch) {
            const bookAbbr = complexMatch[1];
            const bookNum = parseInt(complexMatch[2]);
            const chNum = parseInt(complexMatch[3]);
            const book = findBook(bookAbbr);
            if (book) {
                const item = allItems.find(i => i.bookId === book.id && i.bookNumber === bookNum && i.chapterNumber === chNum);
                if (item) refResults.push({ item, book, matchType: 'ref' });
            }
        }

        // 2. Text Search
        // If we haven't found a perfect reference match, or user wants text search too?
        // Let's do text search for matches
        if (q.length > 2) {
            allItems.forEach(item => {
                // Avoid duplicates if already found by ref
                if (refResults.some(r => r.item.id === item.id)) return;

                const book = books.find(b => b.id === item.bookId);
                if (!book) return;

                if (item.content.toLowerCase().includes(q) ||
                    item.contentAr.includes(q) ||
                    item.title?.toLowerCase().includes(q) ||
                    item.referenceDisplay.toLowerCase().includes(q)) {
                    textResults.push({ item, book, matchType: 'text' });
                }
            });
        }

        setResults([...refResults, ...textResults]);
    }, [query, books]);

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Detailed Search</h2>
                <div className="relative">
                    <Input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search e.g. 'Bukhari 1', 'Intention', 'Actions'..."
                        className="pl-10 h-12 text-lg shadow-sm"
                        autoFocus
                    />
                    <SearchIcon className="absolute left-3 top-3.5 text-slate-400" size={20} />
                </div>
                <p className="text-xs text-slate-500">
                    Try: <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">Bukhari 1</span> or <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">Bukhari 1:1</span> or keywords.
                </p>
            </div>

            <div className="space-y-4">
                {results.map(({ item, book, matchType }) => (
                    <div
                        key={item.id}
                        onClick={() => onNavigate('item', item.id)}
                        className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all flex gap-4 ${matchType === 'ref'
                            ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                            }`}
                    >
                        <div className="shrink-0 pt-1">
                            <BookOpen className={matchType === 'ref' ? 'text-amber-600' : 'text-slate-400'} size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-slate-800 dark:text-slate-200">{book.title}</span>
                                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    {item.referenceDisplay}
                                </span>
                                {matchType === 'ref' && <span className="text-xs text-amber-600 font-medium">Exact Match</span>}
                            </div>
                            {item.title && <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">{item.title}</h3>}
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 font-serif">
                                {item.content.replace(/[#*`>]/g, '')}
                            </p>
                        </div>
                    </div>
                ))}

                {query && results.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        No results found for "{query}"
                    </div>
                )}
            </div>
        </div>
    );
};
