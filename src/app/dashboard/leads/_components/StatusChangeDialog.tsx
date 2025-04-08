import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
import { getStatusBadgeColor } from "./leadUtils";
import { formatDistanceToNow } from "date-fns";
import { Clock, MessageSquare, History } from "lucide-react";

// Status Change Dialog Component
const StatusChangeDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  currentStatus: string;
  newStatus: string;
  notes: Array<{
    text: string;
    status: string;
    addedBy?: string;
    createdAt: string;
  }>;
  onStatusChange: (id: string, status: string, note: string) => void;
}> = ({
  isOpen,
  onClose,
  leadId,
  currentStatus,
  newStatus,
  notes,
  onStatusChange,
}) => {
  const [noteText, setNoteText] = useState("");
  const [activeTab, setActiveTab] = useState("new");

  const handleSubmit = () => {
    if (!noteText.trim()) {
      toast.error("Please add a note about this status change");
      return;
    }

    onStatusChange(leadId, newStatus, noteText.trim());
    setNoteText("");
    onClose();
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()} (${formatDistanceToNow(
        date,
        { addSuffix: true }
      )})`;
    } catch (e) {
      return dateString;
    }
  };

  const reversedNotes = [...(notes || [])].reverse();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span>Update Lead Status</span>
            <div className="flex items-center gap-2 text-sm font-normal">
              <Badge
                variant="outline"
                className={getStatusBadgeColor(currentStatus)}
              >
                {currentStatus}
              </Badge>
              <span>→</span>
              <Badge
                variant="outline"
                className={getStatusBadgeColor(newStatus)}
              >
                {newStatus}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            Track your lead journey with detailed notes about each status change
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-2 flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="new" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Add New Note
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" /> Note History
              {notes && notes.length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-gray-200">
                  {notes.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="new"
            className="flex-1 overflow-auto data-[state=active]:flex flex-col space-y-4 pt-4"
          >
            <div className="mb-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Add a note about this status change
              </label>
              <Textarea
                placeholder="What actions have you taken or why are you changing this status?"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="min-h-[150px]"
                required
              />
              <p className="mt-1 text-xs text-slate-500">
                This note will be saved with the current timestamp and status
              </p>
            </div>

            <DialogFooter className="mt-auto">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!noteText.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save &amp; Update Status
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="history" className="flex-1 overflow-auto pt-2">
            {reversedNotes && reversedNotes.length > 0 ? (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {reversedNotes.map((note, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        variant="outline"
                        className={getStatusBadgeColor(note.status)}
                      >
                        {note.status}
                      </Badge>
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(note.createdAt)}
                      </div>
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap">
                      {note.text}
                    </p>
                    {note.addedBy && (
                      <p className="mt-2 text-xs text-slate-500">
                        Added by {note.addedBy}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-center bg-slate-50 rounded-lg p-6">
                <History className="h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-slate-700 font-medium text-lg mb-1">
                  No history available
                </h3>
                <p className="text-slate-500 max-w-md">
                  This lead has no status change history yet. Notes will appear
                  here when status changes are made.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default StatusChangeDialog;
