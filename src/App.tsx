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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Navigation - Brutalist Bar */}
      <nav className="border-b-2 border-black flex items-stretch h-16 sticky top-0 z-20 bg-white">
        <div className="border-r-2 border-black px-6 flex items-center gap-3 bg-black text-white">
          <Terminal className="w-6 h-6" />
          <span className="font-display text-2xl uppercase tracking-tighter">DevNotes</span>
        </div>
        
        <div className="flex-1 flex items-center px-6 gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
            <input
              type="text"
              placeholder="SEARCH_NOTES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-black font-mono text-sm focus:outline-none focus:bg-accent transition-colors"
            />
          </div>
        </div>

        <div className="border-l-2 border-black flex items-center px-4 gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              "p-2 border-2 border-black transition-all",
              viewMode === 'grid' ? "bg-accent shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-white hover:bg-gray-100"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              "p-2 border-2 border-black transition-all",
              viewMode === 'list' ? "bg-accent shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-white hover:bg-gray-100"
            )}
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar - Vertical Rail */}
        <aside className="w-64 border-r-2 border-black hidden md:flex flex-col bg-white">
          <div className="p-4 border-b-2 border-black bg-black text-white">
            <h3 className="font-display text-sm uppercase tracking-widest flex items-center gap-2">
              <Filter className="w-3 h-3" />
              Languages
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {languages.map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={cn(
                  "w-full text-left px-4 py-3 border-2 border-transparent font-mono text-xs uppercase tracking-tight transition-all",
                  selectedLanguage === lang 
                    ? "bg-accent border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1" 
                    : "hover:bg-gray-100"
                )}
              >
                {lang}
              </button>
            ))}
          </div>
          
          <div className="p-4 border-t-2 border-black bg-accent">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="border-2 border-black bg-white p-2">
                <p className="text-xl font-black">{notes.length}</p>
                <p className="text-[8px] font-bold uppercase">Notes</p>
              </div>
              <div className="border-2 border-black bg-white p-2">
                <p className="text-xl font-black">{languages.length - 1}</p>
                <p className="text-[8px] font-bold uppercase">Langs</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            <NoteForm onSubmit={handleAddNote} />

            <div className={cn(
              "grid gap-8 mt-12",
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
                    className="col-span-full py-20 text-center border-4 border-dashed border-black"
                  >
                    <Terminal className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="font-display text-2xl uppercase">System Empty</h3>
                    <p className="font-mono text-sm mt-2">No matching records found in database.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
