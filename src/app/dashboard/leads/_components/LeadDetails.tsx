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
import NotesDisplay from "./NoteDisplay";
const LeadDetailDialog: React.FC<{
  lead: Lead;
  onStatusChange: (id: string, status: string) => void;
  onAddComment: (id: string, comment: string) => void;
  // onAddNote: (
  //   id: string,
  //   text: string,
  //   status: string,
  //   addedBy?: string
  // ) => void;
}> = ({ lead, onStatusChange, onAddComment }) => {
  const [newComment, setNewComment] = useState(lead.comment || "");
  const [activeTab, setActiveTab] = useState("details");

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      onAddComment(lead._id, newComment);
    }
  };
  // Status color function - used in multiple components
  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-500 text-white";
      case "Attempted to Contact":
        return "bg-amber-500 text-white";
      case "Not Contact":
        return "bg-gray-500 text-white";
      case "In-conversation":
        return "bg-purple-500 text-white";
      case "Prospect":
        return "bg-emerald-500 text-white";
      case "Not-Eligible":
        return "bg-red-400 text-white";
      case "Not-Interested":
        return "bg-pink-500 text-white";
      case "Spam":
        return "bg-orange-500 text-white";
      case "Opportunity":
        return "bg-teal-500 text-white";
      case "Contact-in-Future":
        return "bg-indigo-500 text-white";
      case "Closed-Won":
        return "bg-green-600 text-white";
      case "Closed-Lost":
        return "bg-red-600 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  // For badge variants
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Attempted to Contact":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Not Contact":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "In-conversation":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Prospect":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Not-Eligible":
        return "bg-red-100 text-red-800 border-red-200";
      case "Not-Interested":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "Spam":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Opportunity":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "Contact-in-Future":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Closed-Won":
        return "bg-green-100 text-green-800 border-green-200";
      case "Closed-Lost":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <div className="flex justify-between items-center">
          <div>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {lead.name}
              <Badge variant="outline" className="ml-2">
                {lead.type.toUpperCase()}
              </Badge>
            </DialogTitle>
            <DialogDescription>Lead ID: {lead._id}</DialogDescription>
          </div>
          <Badge variant="outline" className={getStatusColor(lead.status)}>
            {lead.status}
          </Badge>
        </div>
      </DialogHeader>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-4 flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Lead Details
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Notes History
            {lead.notes && lead.notes.length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-slate-200">
                {lead.notes.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="flex-1 overflow-auto">
          <div className="space-y-6 p-1">
            {/* Basic info section */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-500">
                  Contact Information
                </h4>
                <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-800">{lead.email}</p>
                      <p className="text-xs text-slate-500">Email</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-800">
                        {lead.countryCode} {lead.phoneNumber}
                      </p>
                      <p className="text-xs text-slate-500">Phone</p>
                    </div>
                  </div>

                  {lead.websiteUrl && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-slate-400" />
                      <div>
                        <a
                          href={lead.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {lead.websiteUrl}
                        </a>
                        <p className="text-xs text-slate-500">Website</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-500">
                  Lead Information
                </h4>
                <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TagIcon className="h-5 w-5 text-slate-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-slate-800">
                          {lead.category}
                        </p>
                        {lead.subCategory && (
                          <Badge
                            variant="outline"
                            className="bg-indigo-50 text-indigo-700 border-indigo-100"
                          >
                            {lead.subCategory}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">Category</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-800">
                        {new Date(lead.createdAt).toLocaleDateString()} at{" "}
                        {new Date(lead.createdAt).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-slate-500">Created</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-800">
                        {new Date(lead.updatedAt).toLocaleDateString()} at{" "}
                        {new Date(lead.updatedAt).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-slate-500">Last Updated</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Query section */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-500">
                Query / Message
              </h4>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-slate-700 whitespace-pre-wrap">
                  {lead.query}
                </p>
              </div>
            </div>

            {/* Status section */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-500">
                Lead Status
              </h4>
              <Select
                defaultValue={lead.status}
                onValueChange={(value) => onStatusChange(lead._id, value)}
              >
                <SelectTrigger
                  className={`w-full ${getStatusColor(lead.status)}`}
                >
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">NEW</SelectItem>
                  <SelectItem value="Attempted to Contact">
                    Attempted to Contact
                  </SelectItem>
                  <SelectItem value="Not Contact">Not Contact</SelectItem>
                  <SelectItem value="In-conversation">
                    In-conversation
                  </SelectItem>
                  <SelectItem value="Prospect">Prospect</SelectItem>
                  <SelectItem value="Not-Eligible">Not Eligible</SelectItem>
                  <SelectItem value="Not-Interested">Not Interested</SelectItem>
                  <SelectItem value="Spam">Spam</SelectItem>
                  <SelectItem value="Opportunity">Opportunity</SelectItem>
                  <SelectItem value="Contact-in-Future">
                    Contact in Future
                  </SelectItem>
                  <SelectItem value="Closed-Won">Closed-Won</SelectItem>
                  <SelectItem value="Closed-Lost">Closed-Lost</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                When you change the status, a note will be automatically added
                to the history.
              </p>
            </div>

            {/* Comment section */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-500">
                Lead Comment
              </h4>
              <Textarea
                placeholder="Add or update general comment about this lead..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleCommentSubmit}
                  disabled={!newComment.trim()}
                >
                  <SaveIcon className="h-4 w-4 mr-2" />
                  {lead.comment ? "Update Comment" : "Add Comment"}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="flex-1 overflow-auto p-1">
          <NotesDisplay
            notes={lead.notes || []}
            leadId={lead._id}
            currentStatus={lead.status}
          />
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

export default LeadDetailDialog;
