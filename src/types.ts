export interface Note {
  id: string;
  title: string;
  content: string;
  language: string;
  createdAt: number;
  tags: string[];
}

export type NewNote = Omit<Note, 'id' | 'createdAt'>;
