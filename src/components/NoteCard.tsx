import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { Trash2, Code, Calendar, Tag, Copy, Check } from 'lucide-react';
import { Note } from '../types';
import { motion } from 'motion/react';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(note.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-black/5 transition-all group"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500 rounded flex items-center gap-1">
                <Code className="w-3 h-3" />
                {note.language}
              </span>
              <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(note.createdAt, 'MMM d, yyyy')}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-black transition-colors">
              {note.title}
            </h3>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-2 text-gray-300 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Delete note"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="markdown-body prose prose-sm max-w-none text-gray-600 mb-6">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>

        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-500 text-[10px] font-medium rounded-full border border-gray-100"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
