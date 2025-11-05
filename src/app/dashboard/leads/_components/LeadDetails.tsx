'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Phone,
  Mail,
  Globe,
  Calendar,
  Clock,
  MessageSquare,
  User,
  TagIcon,
  BookOpen,
} from 'lucide-react';
import { Lead } from './types';
import { getStatusBadgeColor, getTypeBadgeColor } from './leadUtils';
import NotesComponent from './NotesComponent';
import StatusChangeDialog from './StatusChangeDialog';

interface LeadDetailDialogProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: string, note: string) => Promise<void>;
  onAddComment: (id: string, comment: string) => Promise<void>;
  onAddNote: (id: string, text: string, status: string) => Promise<void>;
}

const LeadDetailDialog: React.FC<LeadDetailDialogProps> = ({
  lead,
  isOpen,
  onClose,
  onStatusChange,
  onAddComment,
  onAddNote,
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [newComment, setNewComment] = useState(lead.comment || '');
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddComment(lead._id, newComment);
      // Don't clear the comment after submission to avoid confusion
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusClick = (status: string) => {
    setNewStatus(status);
    setIsStatusDialogOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  {lead.name}
                  <Badge variant="outline" className={getTypeBadgeColor(lead.type)}>
                    {lead.type.toUpperCase()}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <span>Course: {lead.course?.title || 'Unknown Course'}</span>
                  <span>•</span>
                  <span>
                    Category: {lead.course?.category?.map(c => c.name).join(', ') || 'N/A'}
                  </span>
                </DialogDescription>
              </div>
              <Badge variant="outline" className={getStatusBadgeColor(lead.status)}>
                {lead.status}
              </Badge>
            </div>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="mt-4 flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Lead Details
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Notes
                {lead.notes.length > 0 && (
                  <Badge variant="secondary" className="ml-1 bg-slate-200">
                    {lead.notes.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="status" className="flex items-center gap-2">
                <TagIcon className="h-4 w-4" /> Status
              </TabsTrigger>
            </TabsList>

            {/* Lead Details Tab */}
            <TabsContent value="details" className="flex-1 overflow-auto">
              <div className="space-y-6 p-1">
                {/* Basic info section */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-500">Contact Information</h4>
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
                    <h4 className="text-sm font-medium text-slate-500">Lead Information</h4>
                    <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-800 font-medium">
                            {lead.course?.title || 'Unknown Course'}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="bg-slate-100 text-xs">
                              {lead.course?.category?.map(c => c.name).join(', ') || 'No Category'}
                            </Badge>
                            {lead.subCategory && (
                              <Badge
                                variant="outline"
                                className="bg-indigo-50 text-indigo-700 border-indigo-100 text-xs"
                              >
                                {lead.subCategory}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-800">
                            {new Date(lead.createdAt).toLocaleDateString()} at{' '}
                            {new Date(lead.createdAt).toLocaleTimeString()}
                          </p>
                          <p className="text-xs text-slate-500">Created</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-800">
                            {new Date(lead.updatedAt).toLocaleDateString()} at{' '}
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
                  <h4 className="text-sm font-medium text-slate-500">Query / Message</h4>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-slate-700 whitespace-pre-wrap">{lead.query}</p>
                  </div>
                </div>

                {/* Comment section */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-500">Lead Comment</h4>
                  <Textarea
                    placeholder="Add or update general comment about this lead..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleCommentSubmit}
                      disabled={!newComment.trim() || isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : lead.comment ? 'Update Comment' : 'Add Comment'}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="flex-1 overflow-auto p-1">
              <NotesComponent
                notes={lead.notes}
                leadId={lead._id}
                currentStatus={lead.status}
                onAddNote={onAddNote}
              />
            </TabsContent>

            {/* Status Tab */}
            <TabsContent value="status" className="flex-1 overflow-auto p-1">
              <div className="space-y-4">
                <h3 className="font-medium text-slate-800 mt-6">Change Status</h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {[
                    'NEW',
                    'Attempted to Contact',
                    'Not Contacted',
                    'In-conversation',
                    'Prospect',
                    'Not-Eligible',
                    'Not-Interested',
                    'Spam',
                    'Opportunity',
                    'Contact-in-Future',
                    'Closed-Won',
                    'Closed-Lost',
                  ].map(status => (
                    <Button
                      key={status}
                      variant="outline"
                      size="sm"
                      className={`border ${status === lead.status ? 'bg-slate-100 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                      disabled={status === lead.status}
                      onClick={() => handleStatusClick(status)}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mr-2 ${getStatusBadgeColor(status)
                          .replace('bg-', '')
                          .replace('text-', '')
                          .replace('border-', '')
                          .split(' ')[0]
                          .replace('100', '500')}`}
                      />
                      {status}
                    </Button>
                  ))}
                </div>

                <div className="mt-6">
                  <p className="text-sm text-slate-500">
                    When you change the status, you'll be asked to add a note about the change. This
                    helps keep a detailed history of your interactions with this lead.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      {isStatusDialogOpen && (
        <StatusChangeDialog
          isOpen={isStatusDialogOpen}
          onClose={() => setIsStatusDialogOpen(false)}
          leadId={lead._id}
          currentStatus={lead.status}
          newStatus={newStatus}
          notes={lead.notes}
          onStatusChange={onStatusChange}
        />
      )}
    </>
  );
};

export default LeadDetailDialog;
