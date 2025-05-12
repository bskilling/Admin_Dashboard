'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageSquare } from 'lucide-react';
import { Note } from './types';
import { getStatusBadgeColor, formatDate, sortNotesByDate } from './leadUtils';

interface NotesComponentProps {
  notes: Note[];
  leadId: string;
  currentStatus: string;
  onAddNote: (leadId: string, text: string, status: string) => Promise<void>;
}

const NotesComponent: React.FC<NotesComponentProps> = ({
  notes,
  leadId,
  currentStatus,
  onAddNote,
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sort notes by date (most recent first)
  const sortedNotes = sortNotesByDate(notes);

  const handleAddNote = async () => {
    if (!newNoteText.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddNote(leadId, newNoteText.trim(), currentStatus);
      setNewNoteText(''); // Clear input after successful submission
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-slate-800 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-slate-500" />
        Lead Notes History
      </h3>

      {/* Add new note section */}
      <div className="space-y-3 mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="text-sm font-medium text-blue-800">Add a new note</h4>
        <Textarea
          placeholder="Type your note here..."
          value={newNoteText}
          onChange={e => setNewNoteText(e.target.value)}
          className="min-h-[100px] bg-white"
        />
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            Current status:{' '}
            <Badge className={getStatusBadgeColor(currentStatus)}>{currentStatus}</Badge>
          </div>
          <Button
            onClick={handleAddNote}
            disabled={!newNoteText.trim() || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            {isSubmitting ? 'Adding...' : 'Add Note'}
          </Button>
        </div>
      </div>

      {/* Notes list */}
      <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
        {sortedNotes.length > 0 ? (
          sortedNotes.map((note, index) => (
            <div key={index} className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className={getStatusBadgeColor(note.status)}>
                  {note.status}
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">
                    {note.addedBy || 'Admin'}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(note.createdAt)}</span>
                </div>
              </div>
              <p className="text-slate-700 whitespace-pre-wrap">{note.text}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-lg">
            <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No notes yet</p>
            <p className="text-slate-400 text-sm">
              Add a note to keep track of interactions with this lead
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesComponent;
