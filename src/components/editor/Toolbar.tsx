import React from 'react';
import {
    Bold, Italic, Heading, List, ListOrdered, Quote, Code, Link as LinkIcon, HelpCircle
} from 'lucide-react';

interface ToolbarProps {
    onInsert: (template: string, selectionOffset?: number) => void;
    onHelp: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onInsert, onHelp }) => {
    return (
        <div className="flex items-center gap-1 p-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <ToolbarButton
                icon={<Bold size={18} />}
                label="Bold"
                onClick={() => onInsert('**text**', 2)}
            />
            <ToolbarButton
                icon={<Italic size={18} />}
                label="Italic"
                onClick={() => onInsert('*text*', 1)}
            />
            <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1" />
            <ToolbarButton
                icon={<Heading size={18} />}
                label="Heading"
                onClick={() => onInsert('## Heading', 3)}
            />
            <ToolbarButton
                icon={<Quote size={18} />}
                label="Quote"
                onClick={() => onInsert('> ', 2)}
            />
            <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1" />
            <ToolbarButton
                icon={<List size={18} />}
                label="Bullet List"
                onClick={() => onInsert('- ', 2)}
            />
            <ToolbarButton
                icon={<ListOrdered size={18} />}
                label="Numbered List"
                onClick={() => onInsert('1. ', 3)}
            />
            <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1" />
            <ToolbarButton
                icon={<Code size={18} />}
                label="Code"
                onClick={() => onInsert('`code`', 1)}
            />
            <ToolbarButton
                icon={<LinkIcon size={18} />}
                label="Link"
                onClick={() => onInsert('[Title](url)', 1)}
            />
            <div className="flex-1" />
            <ToolbarButton
                icon={<HelpCircle size={18} />}
                label="Help"
                onClick={onHelp}
            />
        </div>
    );
};

const ToolbarButton: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        title={label}
        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
    >
        {icon}
    </button>
);
