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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border-2 border-black brutal-shadow-hover transition-all group flex flex-col"
    >
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-accent border-2 border-black text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <Code className="w-3 h-3" />
                {note.language}
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-tighter text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(note.createdAt, 'yyyy.MM.dd')}
              </span>
            </div>
            <h3 className="text-2xl font-display uppercase leading-none tracking-tight">
              {note.title}
            </h3>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="p-2 border-2 border-black hover:bg-accent transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="p-2 border-2 border-black hover:bg-red-500 hover:text-white transition-colors"
              title="Delete note"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="markdown-body prose prose-sm max-w-none mb-8">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
      </div>

      {note.tags.length > 0 && (
        <div className="px-6 py-4 border-t-2 border-black bg-gray-50 flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-1 border-2 border-black bg-white text-[10px] font-bold uppercase tracking-tighter"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
