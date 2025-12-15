import React, { useState, useEffect, useRef } from 'react';
import { Toolbar } from './Toolbar';
import { parseMarkdown } from '../../lib/markdown';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    isArabic?: boolean; // Determines text direction
    label?: string;
}

type ViewMode = 'edit' | 'preview' | 'split';

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, isArabic = false, label }) => {
    const [mode, setMode] = useState<ViewMode>('split');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInsert = (template: string, selectionOffset = 0) => {
        if (!textareaRef.current) return;

        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = textareaRef.current.value;

        // Insert text
        // If there is selection, wrap it? Use simple insertion for now
        // Advanced: check if wrapping bold around selection
        let newText = text.substring(0, start) + template + text.substring(end);

        // If wrapper style (e.g. **text**)
        if (template.includes('text') && start !== end) {
            // Wrap existing selection
            const selected = text.substring(start, end);
            const before = template.split('text')[0];
            const after = template.split('text')[1];
            newText = text.substring(0, start) + before + selected + after + text.substring(end);
        }

        onChange(newText);

        // Restore focus and move cursor
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const newCursorPos = start + (template.includes('text') && start !== end ? template.length - 4 + (end - start) : selectionOffset);
                // Simplified cursor logic
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    return (
        <div className="flex flex-col border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-sm h-[500px]">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <span className="font-medium text-sm text-slate-600 dark:text-slate-400">
                    {label || 'Markdown Editor'} {isArabic && '(Arabic)'}
                </span>
                <div className="flex gap-2 text-xs">
                    {(['edit', 'preview', 'split'] as ViewMode[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-3 py-1 rounded-full capitalize transition-colors ${mode === m
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 font-medium'
                                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            <Toolbar onInsert={handleInsert} onHelp={() => alert('Markdown Cheatsheet:\n**Bold**\n*Italic*\n# Header\n> Quote')} />

            <div className="flex-1 flex overflow-hidden">
                {/* Editor Pane */}
                {(mode === 'edit' || mode === 'split') && (
                    <div className={`flex-1 flex flex-col ${mode === 'split' ? 'border-r border-slate-200 dark:border-slate-700' : ''}`}>
                        <textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className={`flex-1 w-full p-4 resize-none bg-slate-50 dark:bg-slate-925 text-slate-800 dark:text-slate-200 focus:outline-none font-mono text-sm leading-relaxed ${isArabic ? 'text-right' : 'text-left'}`}
                            placeholder="Type markdown here..."
                            dir={isArabic ? 'rtl' : 'ltr'}
                        />
                        {/* Simple footer stats */}
                        <div className="px-3 py-1 bg-slate-50 dark:bg-slate-900 text-xs text-slate-400 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                            <span>{value.length} chars</span>
                            <span>{value.split(/\s+/).filter(Boolean).length} words</span>
                        </div>
                    </div>
                )}

                {/* Preview Pane */}
                {(mode === 'preview' || mode === 'split') && (
                    <div className="flex-1 overflow-auto bg-white dark:bg-slate-900 p-6">
                        <div
                            className={`prose dark:prose-invert prose-slate max-w-none ${isArabic ? 'text-right' : 'text-left'} ${isArabic ? 'font-arabic' : ''}`}
                            dangerouslySetInnerHTML={{ __html: parseMarkdown(value) }}
                            dir={isArabic ? 'rtl' : 'ltr'}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
