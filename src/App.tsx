import { useState, useEffect, useMemo } from 'react';
import { Search, Terminal, Filter, LayoutGrid, List as ListIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Note, NewNote } from './types';
import { NoteCard } from './components/NoteCard';
import { NoteForm } from './components/NoteForm';
import { cn } from './lib/utils';

const STORAGE_KEY = 'devnotes_data';

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved notes', e);
      }
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = (newNote: NewNote) => {
    const note: Note = {
      ...newNote,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setNotes([note, ...notes]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLanguage = selectedLanguage === 'all' || note.language === selectedLanguage;
      
      return matchesSearch && matchesLanguage;
    });
  }, [notes, searchQuery, selectedLanguage]);

  const languages = useMemo(() => {
    const langs = new Set(notes.map(n => n.language));
    return ['all', ...Array.from(langs)];
  }, [notes]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">DevNotes</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Programming Journal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
              <input
                type="text"
                placeholder="Search notes, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-gray-200 rounded-full text-sm w-64 transition-all focus:ring-4 focus:ring-black/5 outline-none"
              />
            </div>
            <div className="h-6 w-px bg-gray-200 mx-2" />
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === 'grid' ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === 'list' ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <Filter className="w-3 h-3" />
                Filter by Language
              </h3>
              <div className="space-y-1">
                {languages.map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                      selectedLanguage === lang 
                        ? "bg-black text-white" 
                        : "text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </section>

            <section className="p-4 bg-black/5 rounded-2xl border border-black/5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold">{notes.length}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Total Notes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{languages.length - 1}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Languages</p>
                </div>
              </div>
            </section>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <NoteForm onSubmit={handleAddNote} />

            <div className={cn(
              "grid gap-6",
              viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            )}>
              <AnimatePresence mode="popLayout">
                {filteredNotes.length > 0 ? (
                  filteredNotes.map(note => (
                    <NoteCard key={note.id} note={note} onDelete={handleDeleteNote} />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-20 text-center"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <Terminal className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No notes found</h3>
                    <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
