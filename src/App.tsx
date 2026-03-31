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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-[#e9ecef] flex items-center justify-between px-8 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#0066ff] rounded-lg flex items-center justify-center text-white">
            <Terminal className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-[#212529]">DevNotes</h1>
        </div>

        <div className="flex-1 max-w-2xl mx-12">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#adb5bd] group-focus-within:text-[#0066ff] transition-colors" />
            <input
              type="text"
              placeholder="Search your technical notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#f1f3f5] border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#0066ff]/10 focus:border-[#0066ff] transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#f1f3f5] p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'grid' ? "bg-white shadow-sm text-[#0066ff]" : "text-[#adb5bd] hover:text-[#495057]"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'list' ? "bg-white shadow-sm text-[#0066ff]" : "text-[#adb5bd] hover:text-[#495057]"
              )}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-[#e9ecef] hidden lg:flex flex-col p-6 overflow-y-auto">
          <div className="mb-8">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#adb5bd] mb-4 flex items-center gap-2">
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
                      ? "bg-[#0066ff]/5 text-[#0066ff]" 
                      : "text-[#495057] hover:bg-[#f1f3f5]"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-[#e9ecef]">
            <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#e9ecef]">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#adb5bd] mb-3">Library Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xl font-bold text-[#212529]">{notes.length}</p>
                  <p className="text-[9px] text-[#adb5bd] font-bold uppercase">Notes</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#212529]">{languages.length - 1}</p>
                  <p className="text-[9px] text-[#adb5bd] font-bold uppercase">Langs</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] p-8">
          <div className="max-w-5xl mx-auto">
            <NoteForm onSubmit={handleAddNote} />

            <div className={cn(
              "grid gap-6 mt-8",
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
                    className="col-span-full py-24 text-center bg-white rounded-2xl border border-dashed border-[#dee2e6]"
                  >
                    <div className="w-12 h-12 bg-[#f1f3f5] rounded-full flex items-center justify-center mx-auto mb-4 text-[#adb5bd]">
                      <Terminal className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-semibold text-[#212529]">No records found</h3>
                    <p className="text-sm text-[#adb5bd] mt-1">Try adjusting your search or language filters.</p>
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
