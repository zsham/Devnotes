import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NewNote } from '../types';
import { cn } from '../lib/utils';

interface NoteFormProps {
  onSubmit: (note: NewNote) => void;
}

export function NoteForm({ onSubmit }: NoteFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    onSubmit({
      title,
      content,
      language,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });

    setTitle('');
    setContent('');
    setTags('');
    setIsOpen(false);
  };

  return (
    <div className="mb-12">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-6 border-4 border-dashed border-black text-black hover:bg-accent transition-all flex items-center justify-center gap-4 group"
        >
          <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform" />
          <span className="font-display text-3xl uppercase tracking-tighter">Initialize_New_Note</span>
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 border-4 border-black brutal-shadow"
        >
          <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
            <h2 className="text-4xl font-display uppercase tracking-tighter">New_Entry</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block font-mono text-xs font-black uppercase mb-2">Title_Header</label>
                <input
                  autoFocus
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ENTRY_TITLE"
                  className="w-full px-4 py-3 border-2 border-black font-mono text-sm focus:outline-none focus:bg-accent transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-black uppercase mb-2">Syntax_Lang</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black font-mono text-sm focus:outline-none focus:bg-accent transition-colors appearance-none"
                >
                  <option value="javascript">JS</option>
                  <option value="typescript">TS</option>
                  <option value="python">PY</option>
                  <option value="rust">RS</option>
                  <option value="go">GO</option>
                  <option value="css">CSS</option>
                  <option value="html">HTML</option>
                  <option value="other">ETC</option>
                </select>
              </div>
              
              <div>
                <label className="block font-mono text-xs font-black uppercase mb-2">Metadata_Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="TAG1, TAG2..."
                  className="w-full px-4 py-3 border-2 border-black font-mono text-sm focus:outline-none focus:bg-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase mb-2">Content_Body (Markdown)</label>
              <textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="SYSTEM_INPUT..."
                className="w-full px-4 py-3 border-2 border-black font-mono text-sm focus:outline-none focus:bg-accent transition-colors"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-8 py-3 border-2 border-black font-display text-xl uppercase hover:bg-gray-100 transition-colors"
              >
                Abort
              </button>
              <button
                type="submit"
                className="px-12 py-3 bg-black text-white border-2 border-black font-display text-xl uppercase hover:bg-accent hover:text-black transition-all brutal-shadow"
              >
                Commit_Note
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
