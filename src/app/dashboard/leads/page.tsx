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
} from "lucide-react";
import { toast } from "sonner";

// Backend URL
const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "https://backendbskilling-production-20ff.up.railway.app";

// TypeScript interfaces
interface Lead {
  _id: string;
  name: string;
  email: string;
  countryCode: string;
  phoneNumber: string;

  type: "b2i" | "b2b" | "b2c" | "b2g";
  subCategory?: "jobs" | "skills";
  query: string;
  createdAt: string;
  updatedAt: string;
  contactStatus?: "pending" | "contacted" | "converted" | "rejected";
  comments?: string[];
}

interface FilterOptions {
  type: string;
  subCategory: string;
  contactStatus: string;
  searchQuery: string;
}

// Comment Dialog Component
const CommentDialog: React.FC<{
  leadId: string;
  comments: string[];
  onAddComment: (id: string, comment: string) => void;
}> = ({ leadId, comments, onAddComment }) => {
  const [newComment, setNewComment] = useState("");

  const handleSendComment = () => {
    if (newComment.trim()) {
      onAddComment(leadId, newComment);
      setNewComment("");
    }
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Comments</DialogTitle>
        <DialogDescription>
          View past comments and add new ones
        </DialogDescription>
      </DialogHeader>

      {/* Comments list */}
      <div className="max-h-60 overflow-y-auto space-y-2 my-4">
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-md text-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-700">
                  Comment {index + 1}
                </span>
              </div>
              <p className="text-gray-700">{comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">No comments yet</div>
        )}
      </div>

      {/* Add new comment */}
      <div className="space-y-2">
        <Textarea
          placeholder="Add a new comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px]"
        />
        <div className="flex justify-end">
          <Button onClick={handleSendComment}>
            <SendIcon className="h-4 w-4 mr-2" /> Add Comment
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

// Lead Detail Dialog Component
const LeadDetailDialog: React.FC<{
  lead: Lead;
  onStatusChange: (id: string, status: string) => void;
  onAddComment: (id: string, comment: string) => void;
}> = ({ lead, onStatusChange, onAddComment }) => {
  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {lead.name}
          <Badge variant="outline" className="ml-2">
            {lead.type.toUpperCase()}
          </Badge>
        </DialogTitle>
        <DialogDescription>Lead details and management</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* Basic info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Email</h4>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              {lead.email}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Phone</h4>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              {lead.countryCode} {lead.phoneNumber}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Sub-Category</h4>
            <p>{lead.subCategory || "N/A"}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Date</h4>
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              {format(new Date(lead.createdAt), "PPP")}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Status</h4>
            <Select
              defaultValue={lead.contactStatus || "pending"}
              onValueChange={(value) => onStatusChange(lead._id, value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Query */}
        <div>
          <h4 className="text-sm font-medium text-gray-500">Query</h4>
          <div className="p-3 bg-gray-50 rounded-md mt-1">{lead.query}</div>
        </div>

        {/* Comments */}
        <div>
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-500">Comments</h4>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {lead.comments && lead.comments.length > 0
                    ? `View All (${lead.comments.length})`
                    : "Add Comment"}
                </Button>
              </DialogTrigger>
              <CommentDialog
                leadId={lead._id}
                comments={lead.comments || []}
                onAddComment={onAddComment}
              />
            </Dialog>
          </div>

          {lead.comments && lead.comments.length > 0 && (
            <div className="max-h-24 overflow-y-auto space-y-1 mt-2">
              {lead.comments.slice(0, 2).map((comment, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-50 rounded text-xs text-gray-700"
                >
                  {comment}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DialogContent>
  );
};

// Main Dashboard component
export default function AdminLeadsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [filters, setFilters] = useState<FilterOptions>({
    type: "",
    subCategory: "",
    contactStatus: "",
    searchQuery: "",
  });

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Fetch leads data
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/lead`);
        // Add default contactStatus and empty comments array if they don't exist
        const processedLeads = response.data.data.map((lead: any) => ({
          ...lead,
          contactStatus: lead.contactStatus || "pending",
          comments: lead.comments || [],
        }));
        setLeads(processedLeads);
        setError("");
      } catch (err) {
        console.error("Error fetching leads:", err);
        setError("Failed to fetch leads. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Update lead status
  const handleStatusChange = async (id: string, status: string) => {
    try {
      await axios.patch(`${backendUrl}/api/lead/${id}`, {
        contactStatus: status,
      });

      // Update local state
      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead._id === id ? { ...lead, contactStatus: status as any } : lead
        )
      );

      // toast({
      //   title: "Status Updated",
      //   description: `Lead status has been updated to ${status}`,
      //   variant: "default",
      // });
      toast(`Lead status has been updated to ${status}`);
    } catch (err) {
      console.error("Error updating lead status:", err);
      toast.error("Failed to update lead status. Please try again.");
    }
  };

  // Add comment to lead
  const handleAddComment = async (id: string, comment: string) => {
    try {
      const lead = leads.find((l) => l._id === id);
      const updatedComments = [...(lead?.comments || []), comment];

      await axios.patch(`${backendUrl}/api/lead/${id}`, {
        comments: updatedComments,
      });

      // Update local state
      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead._id === id ? { ...lead, comments: updatedComments } : lead
        )
      );

      // toast({
      //   title: "Comment Added",
      //   description: "Your comment has been added successfully",
      //   variant: "default",
      // });
      toast("Your comment has been added successfully");
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment. Please try again.");
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: "",
      subCategory: "",
      contactStatus: "",
      searchQuery: "",
    });
  };

  // Filter leads based on current filters and active tab
  const filteredLeads = leads.filter((lead) => {
    // Filter by tab first
    if (activeTab !== "all" && lead.type !== activeTab) {
      return false;
    }

    // Then apply additional filters
    return (
      (filters.type === "" || lead.type === filters.type) &&
      (filters.subCategory === "" ||
        lead.subCategory === filters.subCategory) &&
      (filters.contactStatus === "" ||
        lead.contactStatus === filters.contactStatus) &&
      (filters.searchQuery === "" ||
        lead.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        lead.query.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    );
  });

  // Get counts for each type
  const getCounts = () => {
    const counts = {
      all: leads.length,
      b2i: leads.filter((lead) => lead.type === "b2i").length,
      b2b: leads.filter((lead) => lead.type === "b2b").length,
      b2c: leads.filter((lead) => lead.type === "b2c").length,
      b2g: leads.filter((lead) => lead.type === "b2g").length,
    };
    return counts;
  };

  const counts = getCounts();

  // Status badge rendering
  const renderStatusBadge = (status?: string) => {
    let badgeClass = "";
    switch (status) {
      case "contacted":
        badgeClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
        break;
      case "converted":
        badgeClass = "bg-green-100 text-green-800 border-green-200";
        break;
      case "rejected":
        badgeClass = "bg-red-100 text-red-800 border-red-200";
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800 border-gray-200";
    }

    return (
      <Badge variant="outline" className={badgeClass}>
        {status || "Pending"}
      </Badge>
    );
  };

  // Type badge rendering
  const renderTypeBadge = (type: string) => {
    let badgeClass = "";
    switch (type) {
      case "b2i":
        badgeClass = "bg-indigo-100 text-indigo-800 border-indigo-200";
        break;
      case "b2b":
        badgeClass = "bg-blue-100 text-blue-800 border-blue-200";
        break;
      case "b2c":
        badgeClass = "bg-green-100 text-green-800 border-green-200";
        break;
      case "b2g":
        badgeClass = "bg-orange-100 text-orange-800 border-orange-200";
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800 border-gray-200";
    }

    return (
      <Badge variant="outline" className={badgeClass}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  // Category icon rendering
  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case "individual_course":
        return <UserSquare className="h-5 w-5 text-blue-500" />;
      case "corporate_training":
        return <Briefcase className="h-5 w-5 text-purple-500" />;
      case "institutional":
        return <GraduationCap className="h-5 w-5 text-green-500" />;
      case "government":
        return <LandmarkIcon className="h-5 w-5 text-red-500" />;
      default:
        return <Building2 className="h-5 w-5 text-gray-500" />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Leads
          </h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600">
            Manage and track all your business leads in one place
          </p>
        </div>

        <div className="flex gap-4 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search leads..."
              className="pl-10 w-full md:w-64"
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters({ ...filters, searchQuery: e.target.value })
              }
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filter menu */}
      {isFilterMenuOpen && (
        <div className="mb-6 p-4 border rounded-md bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Lead Type
              </label>
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters({ ...filters, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="b2i">B2I</SelectItem>
                  <SelectItem value="b2b">B2B</SelectItem>
                  <SelectItem value="b2c">B2C</SelectItem>
                  <SelectItem value="b2g">B2G</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Sub Category
              </label>
              <Select
                value={filters.subCategory}
                onValueChange={(value) =>
                  setFilters({ ...filters, subCategory: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="jobs">Jobs</SelectItem>
                  <SelectItem value="skills">Skills</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Contact Status
              </label>
              <Select
                value={filters.contactStatus}
                onValueChange={(value) =>
                  setFilters({ ...filters, contactStatus: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={resetFilters} className="mr-2">
              Reset Filters
            </Button>
            <Button onClick={() => setIsFilterMenuOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      {/* Tabs for lead types */}
      <Tabs
        defaultValue="all"
        className="mb-6"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            All{" "}
            <Badge variant="outline" className="ml-1">
              {counts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="b2i" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            B2I{" "}
            <Badge variant="outline" className="ml-1">
              {counts.b2i}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="b2b" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            B2B{" "}
            <Badge variant="outline" className="ml-1">
              {counts.b2b}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="b2c" className="flex items-center gap-2">
            <UserSquare className="h-4 w-4" />
            B2C{" "}
            <Badge variant="outline" className="ml-1">
              {counts.b2c}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="b2g" className="flex items-center gap-2">
            <LandmarkIcon className="h-4 w-4" />
            B2G{" "}
            <Badge variant="outline" className="ml-1">
              {counts.b2g}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="m-0">
          <LeadsTableView
            leads={filteredLeads}
            onStatusChange={handleStatusChange}
            onAddComment={handleAddComment}
            renderStatusBadge={renderStatusBadge}
            renderTypeBadge={renderTypeBadge}
            renderCategoryIcon={renderCategoryIcon}
          />
        </TabsContent>
        <TabsContent value="b2i" className="m-0">
          <LeadsTableView
            leads={filteredLeads}
            onStatusChange={handleStatusChange}
            onAddComment={handleAddComment}
            renderStatusBadge={renderStatusBadge}
            renderTypeBadge={renderTypeBadge}
            renderCategoryIcon={renderCategoryIcon}
          />
        </TabsContent>
        <TabsContent value="b2b" className="m-0">
          <LeadsTableView
            leads={filteredLeads}
            onStatusChange={handleStatusChange}
            onAddComment={handleAddComment}
            renderStatusBadge={renderStatusBadge}
            renderTypeBadge={renderTypeBadge}
            renderCategoryIcon={renderCategoryIcon}
          />
        </TabsContent>
        <TabsContent value="b2c" className="m-0">
          <LeadsTableView
            leads={filteredLeads}
            onStatusChange={handleStatusChange}
            onAddComment={handleAddComment}
            renderStatusBadge={renderStatusBadge}
            renderTypeBadge={renderTypeBadge}
            renderCategoryIcon={renderCategoryIcon}
          />
        </TabsContent>
        <TabsContent value="b2g" className="m-0">
          <LeadsTableView
            leads={filteredLeads}
            onStatusChange={handleStatusChange}
            onAddComment={handleAddComment}
            renderStatusBadge={renderStatusBadge}
            renderTypeBadge={renderTypeBadge}
            renderCategoryIcon={renderCategoryIcon}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const LeadsTableView: React.FC<{
  leads: Lead[];
  onStatusChange: (id: string, status: string) => void;
  onAddComment: (id: string, comment: string) => void;
  renderStatusBadge: (status?: string) => React.ReactNode;
  renderTypeBadge: (type: string) => React.ReactNode;
  renderCategoryIcon: (category: string) => React.ReactNode;
}> = ({
  leads,
  onStatusChange,
  onAddComment,
  renderStatusBadge,
  renderTypeBadge,
  renderCategoryIcon,
}) => {
  const [commentText, setCommentText] = useState("");
  const [activeLead, setActiveLead] = useState(null);

  if (leads.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No leads found
        </h3>
        <p className="text-gray-600">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border shadow-md overflow-hidden p-6 bg-white w-full max-w-7xl mx-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="w-[280px] p-4">Lead Details</TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" /> Phone
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" /> Email
              </div>
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Query</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead._id} className="hover:bg-gray-50 p-4">
              <TableCell>
                <div className="flex items-start gap-3">
                  <div>
                    <p className="font-medium text-lg">{lead.name}</p>
                    <div className="flex gap-2 mt-1">
                      {lead.subCategory && (
                        <Badge
                          variant="outline"
                          className="bg-purple-100 text-purple-800 border-purple-200"
                        >
                          {lead.subCategory}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm text-gray-700">
                  {lead.countryCode} {lead.phoneNumber}
                </p>
              </TableCell>
              <TableCell>
                <p className="text-sm text-gray-700 truncate max-w-[200px]">
                  {lead.email}
                </p>
              </TableCell>

              <TableCell>
                <p className="truncate max-w-[180px] text-sm text-gray-700">
                  {lead.query}
                </p>
              </TableCell>
              <TableCell>
                <Select
                  defaultValue={lead.contactStatus || "pending"}
                  onValueChange={(value) => onStatusChange(lead._id, value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue>{lead.contactStatus}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!lead) return toast.error("No lead selected");
                        // @ts-expect-error
                        setActiveLead(lead);
                      }}
                    >
                      Comment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Comment</DialogTitle>
                    </DialogHeader>
                    <textarea
                      className="w-full border rounded-md p-2 text-sm"
                      rows={3}
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        if (commentText.trim()) {
                          // @ts-expect-error
                          if (!activeLead?._id) {
                            toast.error("No lead selected");
                            return;
                          }
                          // @ts-expect-error
                          onAddComment(activeLead?._id, commentText.trim());
                          toast.success("Comment added successfully!");
                          setCommentText("");
                        }
                      }}
                      className="w-full"
                    >
                      Submit Comment
                    </Button>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
