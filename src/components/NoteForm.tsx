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
    <div className="mb-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-4 bg-white border border-[#e9ecef] rounded-xl text-[#6c757d] hover:border-[#0066ff] hover:text-[#0066ff] transition-all flex items-center justify-center gap-2 group card-shadow"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Create new entry</span>
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl border border-[#e9ecef] card-shadow"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-semibold text-[#212529]">New Technical Note</h2>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1.5 text-[#adb5bd] hover:text-[#212529] hover:bg-[#f8f9fa] rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#adb5bd] mb-2">Title</label>
                <input
                  autoFocus
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Memory Management in Rust"
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0066ff]/10 focus:border-[#0066ff] transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#adb5bd] mb-2">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg text-sm focus:outline-none focus:bg-white focus:border-[#0066ff] transition-all appearance-none cursor-pointer"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="rust">Rust</option>
                  <option value="go">Go</option>
                  <option value="css">CSS</option>
                  <option value="html">HTML</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#adb5bd] mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="concurrency, systems, safety"
                className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0066ff]/10 focus:border-[#0066ff] transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#adb5bd] mb-2">Content (Markdown)</label>
              <textarea
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Document your findings here..."
                className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg text-sm font-mono focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0066ff]/10 focus:border-[#0066ff] transition-all resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 text-sm font-medium text-[#6c757d] hover:text-[#212529] transition-colors"
              >
                Discard
              </button>
              <button
                type="submit"
                className="px-8 py-2 bg-[#0066ff] text-white rounded-lg text-sm font-semibold hover:bg-[#0052cc] transition-all shadow-sm"
              >
                Save Entry
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
