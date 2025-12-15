import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked
marked.setOptions({
    gfm: true,
    breaks: true,
    // highlight: function(code, lang) { ... } // Optional: Add highlighting later
});

export const parseMarkdown = (markdown: string): string => {
    const rawHtml = marked.parse(markdown) as string;
    return DOMPurify.sanitize(rawHtml);
};
