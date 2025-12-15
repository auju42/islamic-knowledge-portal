import type { Category, Book, Item } from '../types';
import { SEED_CATEGORIES, SEED_BOOKS, SEED_ITEMS } from '../lib/seed';

const KEYS = {
    CATEGORIES: 'ikp_categories',
    BOOKS: 'ikp_books',
    ITEMS: 'ikp_items'
};

class StorageService {
    // Initialization
    init() {
        if (!localStorage.getItem(KEYS.CATEGORIES)) {
            this.saveCategories(SEED_CATEGORIES);
        }
        if (!localStorage.getItem(KEYS.BOOKS)) {
            this.saveBooks(SEED_BOOKS);
        }
        if (!localStorage.getItem(KEYS.ITEMS)) {
            this.saveItems(SEED_ITEMS);
        }
    }

    // Generic Helpers
    private get<T>(key: string): T[] {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    private save<T>(key: string, data: T[]) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Categories
    getCategories(): Category[] {
        return this.get<Category>(KEYS.CATEGORIES).sort((a, b) => a.order - b.order);
    }

    saveCategories(categories: Category[]) {
        this.save(KEYS.CATEGORIES, categories);
    }

    addCategory(category: Category) {
        const categories = this.getCategories();
        categories.push(category);
        this.saveCategories(categories);
    }

    updateCategory(category: Category) {
        const categories = this.getCategories().map(c => c.id === category.id ? category : c);
        this.saveCategories(categories);
    }

    deleteCategory(id: string) {
        // Note: Should check for dependencies before delete in a real app
        const categories = this.getCategories().filter(c => c.id !== id);
        this.saveCategories(categories);
    }

    // Books
    getBooks(categoryId?: string): Book[] {
        const books = this.get<Book>(KEYS.BOOKS);
        if (categoryId) {
            return books.filter(b => b.categoryId === categoryId);
        }
        return books;
    }

    saveBooks(books: Book[]) {
        this.save(KEYS.BOOKS, books);
    }

    addBook(book: Book) {
        const books = this.getBooks();
        books.push(book);
        this.saveBooks(books);
    }

    updateBook(book: Book) {
        const books = this.getBooks().map(b => b.id === book.id ? book : b);
        this.saveBooks(books);
    }

    deleteBook(id: string) {
        const books = this.getBooks().filter(b => b.id !== id);
        this.saveBooks(books);
    }

    getBook(id: string): Book | undefined {
        return this.getBooks().find(b => b.id === id);
    }

    // Items
    getItems(bookId?: string): Item[] {
        const items = this.get<Item>(KEYS.ITEMS);
        if (bookId) {
            return items.filter(i => i.bookId === bookId).sort((a, b) => a.globalNumber - b.globalNumber);
        }
        return items.sort((a, b) => a.globalNumber - b.globalNumber);
    }

    saveItems(items: Item[]) {
        this.save(KEYS.ITEMS, items);
    }

    addItem(item: Item) {
        const items = this.getItems();
        // Unique Constraint Check for Global Number within Book? 
        // Wait, Global Number is unique per book usually, or per collection? 
        // Requirement: "Global Number - The hadith's number in the complete collection"
        // So distinct global number per Book.
        const exists = items.some(i => i.bookId === item.bookId && i.globalNumber === item.globalNumber);
        if (exists) {
            throw new Error(`Item with Global Number ${item.globalNumber} already exists in this book.`);
        }

        items.push(item);
        this.saveItems(items);
    }

    updateItem(item: Item) {
        const items = this.getItems().map(i => i.id === item.id ? item : i);
        this.saveItems(items);
    }

    deleteItem(id: string) {
        const items = this.getItems().filter(i => i.id !== id);
        this.saveItems(items);
    }

    getItem(id: string): Item | undefined {
        return this.getItems().find(i => i.id === id);
    }
}

export const storage = new StorageService();
