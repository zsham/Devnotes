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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="bg-white border border-[#e9ecef] rounded-2xl overflow-hidden hover:border-[#0066ff]/30 transition-all group flex flex-col card-shadow"
    >
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#f1f3f5] text-[10px] font-bold uppercase tracking-wider text-[#495057] rounded flex items-center gap-1">
                <Code className="w-3 h-3" />
                {note.language}
              </span>
              <span className="text-[10px] font-medium text-[#adb5bd] flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(note.createdAt, 'MMM d, yyyy')}
              </span>
            </div>
            <h3 className="text-base font-semibold text-[#212529] leading-tight">
              {note.title}
            </h3>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-1.5 text-[#adb5bd] hover:text-[#0066ff] hover:bg-[#0066ff]/5 rounded-lg transition-all"
              title="Copy content"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="p-1.5 text-[#adb5bd] hover:text-[#fa5252] hover:bg-[#fa5252]/5 rounded-lg transition-all"
              title="Delete note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="markdown-body prose prose-sm max-w-none mb-4 text-[#495057]">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
      </div>

      {note.tags.length > 0 && (
        <div className="px-6 py-3 bg-[#f8f9fa] border-t border-[#e9ecef] flex flex-wrap gap-1.5">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-0.5 bg-white border border-[#e9ecef] text-[#6c757d] text-[9px] font-bold uppercase tracking-wider rounded-md"
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
