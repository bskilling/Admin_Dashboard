"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
// import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  Search,
  UserSquare,
  LandmarkIcon,
  SendIcon,
  Filter,
  MoreHorizontal,
  EyeIcon,
  Check,
  X,
  Globe,
  Plus,
  SaveIcon,
  User,
  TagIcon,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Lead } from "./type";

const NotesDisplay: React.FC<{
  notes: Array<{
    text: string;
    status: string;
    addedBy?: string;
    createdAt: string;
    updatedAt?: string;
  }>;
  leadId: string;

  currentStatus: string;
}> = ({ notes, leadId, currentStatus }) => {
  const [newNote, setNewNote] = useState("");

  const handleSubmit = () => {
    if (newNote.trim()) {
      //   onAddNote(leadId, newNote.trim(), currentStatus);
      setNewNote("");
    }
  };

  // Function to format the note date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Attempted to Contact":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "In-conversation":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Prospect":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Closed-Won":
        return "bg-green-100 text-green-800 border-green-200";
      case "Closed-Lost":
        return "bg-red-100 text-red-800 border-red-200";
      case "Not-Interested":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "Spam":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Contact-in-Future":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-slate-800">Lead Notes History</h3>

      {/* Notes list */}
      <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
        {notes && notes.length > 0 ? (
          notes.map((note, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">
                    {note.addedBy || "Admin"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatDate(note.createdAt)}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={getStatusColor(note.status)}
                >
                  {note.status}
                </Badge>
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

      {/* Add new note */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <h4 className="text-sm font-medium text-slate-700">Add a new note</h4>
        <Textarea
          placeholder="Type your note here..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Current status:{" "}
            <Badge className={getStatusColor(currentStatus)}>
              {currentStatus}
            </Badge>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!newNote.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Note
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotesDisplay;
