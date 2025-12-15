export type ContentStatus = 'draft' | 'published';

export interface Category {
    id: string;
    title: string;
    titleAr: string;
    description: string;
    icon: string; // Lucide icon name or emoji
    order: number;
}

export interface Book {
    id: string;
    categoryId: string;
    title: string;
    titleAr: string;
    abbreviation: string; // e.g., "Bukhari"
    description: string;
    itemCount: number;
    status: ContentStatus;
}

export interface Item {
    id: string;
    bookId: string;

    // CRITICAL NUMBERING FIELDS
    globalNumber: number; // Unique across the book (e.g., 256)
    bookNumber: number; // Volume/Book number (e.g., 2)
    chapterNumber: number; // Item number within the book (e.g., 25)

    // Display: "Bukhari 256" or "Bukhari Book 2, Hadith 25"
    referenceDisplay: string;

    title?: string;
    titleAr?: string;

    content: string; // Markdown
    contentAr: string; // Markdown

    narrator?: string;
    grade?: string; // e.g., "Sahih"
    notes?: string; // Markdown

    status: ContentStatus;
    createdAt: number;
    updatedAt: number;
}
