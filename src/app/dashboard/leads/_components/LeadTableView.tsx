// "use client";

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { format } from "date-fns";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Textarea } from "@/components/ui/textarea";
// // import { toast } from "@/components/ui/use-toast";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Building2,
//   Users,
//   Briefcase,
//   GraduationCap,
//   Phone,
//   Mail,
//   Calendar,
//   MessageSquare,
//   CheckCircle,
//   XCircle,
//   Search,
//   UserSquare,
//   LandmarkIcon,
//   SendIcon,
//   Filter,
//   MoreHorizontal,
//   EyeIcon,
//   Check,
//   X,
//   Globe,
//   Plus,
//   SaveIcon,
//   User,
//   TagIcon,
//   Clock,
//   ChevronDown,
//   PencilIcon,
// } from "lucide-react";
// import { toast } from "sonner";
// import { Lead } from "./type";
// import LeadDetailDialog from "./LeadDetails";
// import StatusChangeDialog from "./StatusChangeDialog";

// const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
// const LeadsTableView: React.FC<{
//   leads: Lead[];
//   onStatusChange: (id: string, status: string) => void;
//   onAddComment: (id: string, comment: string) => void;
//   renderStatusBadge: (status?: string) => React.ReactNode;
//   renderTypeBadge: (type: string) => React.ReactNode;
//   renderCategoryIcon: (category: string) => React.ReactNode;
// }> = ({
//   leads,
//   onStatusChange,
//   onAddComment,
//   renderStatusBadge,
//   renderTypeBadge,
//   renderCategoryIcon,
// }) => {
//   // Inside the LeadsTableView component, add these state variables:
//   const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
//   const [newStatus, setNewStatus] = useState("");

//   // Add the color dot helper function
//   const getStatusDotColor = (status: string) => {
//     switch (status) {
//       case "NEW":
//         return "bg-blue-500";
//       case "Attempted to Contact":
//         return "bg-amber-500";
//       case "In-conversation":
//         return "bg-purple-500";
//       case "Prospect":
//         return "bg-emerald-500";
//       case "Closed-Won":
//         return "bg-green-600";
//       case "Closed-Lost":
//         return "bg-red-600";
//       case "Not-Interested":
//         return "bg-pink-500";
//       case "Spam":
//         return "bg-orange-500";
//       case "Contact-in-Future":
//         return "bg-indigo-500";
//       default:
//         return "bg-slate-500";
//     }
//   };

//   // Add these functions to the LeadsTableView component:
//   // This integrates with your existing updateStatusWithNote function
//   //   const handleStatusChange1 = (id: string, status: string, note: string) => {
//   //     updateStatusWithNote(id, status, note);
//   //   };

//   // Make sure to pass this function as a prop to the StatusChangeDialog:
//   // onStatusChange={handleStatusChange}

//   // Also make sure to include the StatusChangeDialog component itself
//   // either inside the LeadsTableView component or imported from another file

//   const [commentText, setCommentText] = useState("");
//   const [activeLead, setActiveLead] = useState<any>(null);
//   const [changedLeads, setChangedLeads] = useState<Record<string, boolean>>({});
//   const [tempStatus, setTempStatus] = useState<Record<string, string>>({});
//   const [tempComment, setTempComment] = useState<Record<string, string>>({});
//   const [leads1, setLeads] = useState<any[]>([]);

//   // Function to update lead status and add a note in one operation
//   const updateStatusWithNote = async (
//     id: string,
//     status: string,
//     noteText: string,
//     addedBy?: string
//   ) => {
//     try {
//       // Create the new note object
//       const newNote = {
//         text: noteText,
//         status: status,
//         addedBy: addedBy || "Admin",
//       };

//       // Make the API call to update both status and add a note
//       await axios.put(`${backendUrl}/api/lead/${id}`, {
//         status: status,
//         notes: newNote, // This should be handled by your backend to push to the notes array
//       });

//       // Update the local state
//       setLeads((currentLeads) =>
//         currentLeads.map((lead) =>
//           lead._id === id
//             ? {
//                 ...lead,
//                 status: status,
//                 notes: [
//                   ...(lead.notes || []),
//                   {
//                     ...newNote,
//                     createdAt: new Date().toISOString(),
//                   },
//                 ],
//               }
//             : lead
//         )
//       );

//       toast.success(`Status updated to ${status} and note added`);
//     } catch (err) {
//       console.error("Error updating status and adding note:", err);
//       toast.error("Failed to update status. Please try again.");
//     }
//   };

//   // Then in your component, you can use handleStatusChange like this:
//   //   const handleStatusChange = (id: string, status: string, note: string) => {
//   //     updateStatusWithNote(id, status, note);
//   //   };

//   // Handle status change
//   const handleStatusChange = (id: string, value: string) => {
//     const lead = leads.find((l) => l._id === id);
//     if (lead) {
//       setTempStatus({ ...tempStatus, [id]: value });
//       setChangedLeads({ ...changedLeads, [id]: true });
//     }
//   };

//   // Handle update
//   const handleUpdate = (id: string) => {
//     if (tempStatus[id]) {
//       onStatusChange(id, tempStatus[id]);
//     }
//     if (tempComment[id] !== undefined) {
//       onAddComment(id, tempComment[id]);
//     }
//     // Clear the changed state for this lead
//     const newChangedLeads = { ...changedLeads };
//     delete newChangedLeads[id];
//     setChangedLeads(newChangedLeads);
//   };

//   // Handle revert
//   const handleRevert = (id: string) => {
//     const lead = leads.find((l) => l._id === id);
//     if (lead) {
//       // Remove temporary values
//       const newTempStatus = { ...tempStatus };
//       delete newTempStatus[id];
//       setTempStatus(newTempStatus);

//       const newTempComment = { ...tempComment };
//       delete newTempComment[id];
//       setTempComment(newTempComment);

//       // Remove from changed leads
//       const newChangedLeads = { ...changedLeads };
//       delete newChangedLeads[id];
//       setChangedLeads(newChangedLeads);
//     }
//   };

//   // Save comment change to temp state
//   const saveCommentToTemp = (id: string, comment: string) => {
//     setTempComment({ ...tempComment, [id]: comment });
//     setChangedLeads({ ...changedLeads, [id]: true });
//     setCommentText("");
//   };

//   if (leads.length === 0) {
//     return (
//       <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
//         <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6">
//           <Search className="h-10 w-10 text-slate-400" />
//         </div>
//         <h3 className="text-xl font-medium text-slate-900 mb-2">
//           No leads found
//         </h3>
//         <p className="text-slate-600 max-w-md mx-auto">
//           Try adjusting your filters or search criteria to find the leads you're
//           looking for.
//         </p>
//       </div>
//     );
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "NEW":
//         return "bg-blue-500 text-white";
//       case "Attempted to Contact":
//         return "bg-amber-500 text-white";
//       case "In-conversation":
//         return "bg-purple-500 text-white";
//       case "Prospect":
//         return "bg-emerald-500 text-white";
//       case "Closed-Won":
//         return "bg-green-600 text-white";
//       case "Closed-Lost":
//         return "bg-red-600 text-white";
//       case "Not-Interested":
//         return "bg-pink-500 text-white";
//       case "Contact-in-Future":
//         return "bg-indigo-500 text-white";
//       default:
//         return "bg-slate-500 text-white";
//     }
//   };

//   return (
//     <div className="rounded-xl border border-slate-200 shadow-lg overflow-hidden bg-white w-full mx-auto mt-6">
//       <div className="overflow-x-auto">
//         <Table className="w-full">
//           <TableHeader>
//             <TableRow className="bg-gradient-to-r from-slate-800 to-slate-700">
//               <TableHead className="p-5 text-white font-medium">Lead</TableHead>
//               <TableHead className="p-5 text-white font-medium">
//                 <div className="flex items-center gap-2">
//                   <Phone className="h-4 w-4" /> Contact Info
//                 </div>
//               </TableHead>
//               <TableHead className="p-5 text-white font-medium">
//                 <div className="flex items-center gap-2">
//                   <MessageSquare className="h-4 w-4" /> Query
//                 </div>
//               </TableHead>
//               <TableHead className="p-5 text-white font-medium">
//                 Status
//               </TableHead>
//               <TableHead className="p-5 text-white font-medium">
//                 Comment
//               </TableHead>
//               <TableHead className="p-5 text-white font-medium text-right">
//                 Actions
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {leads.map((lead) => {
//               const isChanged = changedLeads[lead._id] || false;
//               const currentStatus = tempStatus[lead._id] || lead.status;
//               const statusColorClass = getStatusColor(currentStatus);

//               return (
//                 <TableRow
//                   key={lead._id}
//                   className={`hover:bg-slate-50 ${
//                     isChanged ? "bg-blue-50" : ""
//                   }`}
//                 >
//                   <TableCell className="p-5">
//                     <div className="flex flex-col gap-1">
//                       <div className="flex items-center gap-3">
//                         <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-lg font-semibold text-slate-700">
//                           {lead.name.charAt(0).toUpperCase()}
//                         </div>
//                         <div>
//                           <p className="font-semibold text-slate-800 text-lg">
//                             {lead.name}
//                           </p>
//                           <div className="flex gap-2 mt-1">
//                             {lead.subCategory && (
//                               <Badge
//                                 variant="outline"
//                                 className="bg-indigo-100 text-indigo-800 border-indigo-200"
//                               >
//                                 {lead.subCategory}
//                               </Badge>
//                             )}
//                             {renderTypeBadge(lead.type)}
//                           </div>
//                         </div>
//                       </div>
//                       <p className="text-xs text-slate-500 mt-2">
//                         Created: {new Date(lead.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </TableCell>

//                   <TableCell className="p-5">
//                     <div className="space-y-2">
//                       <p className="flex items-center gap-2 text-slate-700">
//                         <Phone className="h-4 w-4 text-slate-500" />
//                         {lead.countryCode} {lead.phoneNumber}
//                       </p>
//                       <p className="flex items-center gap-2 text-slate-700">
//                         <Mail className="h-4 w-4 text-slate-500" />
//                         <span className="truncate max-w-[180px]">
//                           {lead.email}
//                         </span>
//                       </p>
//                       {lead.websiteUrl && (
//                         <p className="flex items-center gap-2 text-slate-700">
//                           <Globe className="h-4 w-4 text-slate-500" />
//                           <a
//                             href={lead.websiteUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 hover:underline truncate max-w-[180px]"
//                           >
//                             {lead.websiteUrl}
//                           </a>
//                         </p>
//                       )}
//                     </div>
//                   </TableCell>

//                   <TableCell className="p-5">
//                     <div className="flex items-center">
//                       <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 w-full">
//                         <p className="text-slate-700 text-sm line-clamp-2 mb-1">
//                           {lead.query}
//                         </p>
//                         <Dialog>
//                           <DialogTrigger asChild>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 mt-1 p-0 h-auto text-xs font-medium flex items-center"
//                             >
//                               <EyeIcon size={12} className="mr-1" /> View Full
//                               Query
//                             </Button>
//                           </DialogTrigger>
//                           <DialogContent className="max-w-md">
//                             <DialogHeader>
//                               <DialogTitle>Query Details</DialogTitle>
//                               <DialogDescription>
//                                 From {lead.name}
//                               </DialogDescription>
//                             </DialogHeader>
//                             <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 max-h-[300px] overflow-y-auto">
//                               <p className="text-slate-800 whitespace-pre-wrap">
//                                 {lead.query}
//                               </p>
//                             </div>
//                             <div className="mt-4 text-sm text-slate-500">
//                               Submitted on{" "}
//                               {new Date(lead.createdAt).toLocaleString()}
//                             </div>
//                           </DialogContent>
//                         </Dialog>
//                       </div>
//                     </div>
//                   </TableCell>
//                   {/* Status cell with note integration */}
//                   <TableCell className="p-5 min-w-[200px]">
//                     {/* We'll now use a button to trigger status change rather than direct dropdown */}
//                     <div className="flex flex-col gap-2">
//                       <div
//                         className={`px-3 py-2 rounded-md flex items-center justify-between ${getStatusColor(
//                           lead.status
//                         )}`}
//                       >
//                         <span className="font-medium">{lead.status}</span>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="hover:bg-white/20 text-white"
//                           onClick={() => {
//                             setActiveLead(lead);
//                             setIsStatusDialogOpen(true);
//                           }}
//                         >
//                           <PencilIcon size={14} />
//                         </Button>
//                       </div>
//                       <p className="text-xs text-slate-500">
//                         Last updated:{" "}
//                         {new Date(lead.updatedAt).toLocaleDateString()}
//                       </p>
//                     </div>

//                     {/* Conditionally render dialog when needed */}
//                     {activeLead && activeLead._id === lead._id && (
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="border-slate-200 flex-1 flex mt-2"
//                           >
//                             <span className="flex-1">Change Status</span>
//                             <ChevronDown size={16} />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end" className="w-56">
//                           <DropdownMenuLabel>
//                             Select New Status
//                           </DropdownMenuLabel>
//                           <DropdownMenuSeparator />
//                           {[
//                             "NEW",
//                             "Attempted to Contact",
//                             "Not Contact",
//                             "In-conversation",
//                             "Prospect",
//                             "Not-Eligible",
//                             "Not-Interested",
//                             "Spam",
//                             "Opportunity",
//                             "Contact-in-Future",
//                             "Closed-Won",
//                             "Closed-Lost",
//                           ].map((status) => (
//                             <DropdownMenuItem
//                               key={status}
//                               className={`${
//                                 status === lead.status ? "bg-slate-100" : ""
//                               }`}
//                               disabled={status === lead.status}
//                               onClick={() => {
//                                 setNewStatus(status);
//                                 setIsStatusDialogOpen(true);
//                               }}
//                             >
//                               <div
//                                 className={`w-3 h-3 rounded-full mr-2 ${getStatusDotColor(
//                                   status
//                                 )}`}
//                               />
//                               {status}
//                               {status === lead.status && (
//                                 <Check className="ml-auto h-4 w-4" />
//                               )}
//                             </DropdownMenuItem>
//                           ))}
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     )}
//                   </TableCell>

//                   {/* Add the status change dialog that will show when status changes */}
//                   {isStatusDialogOpen && activeLead && (
//                     <StatusChangeDialog
//                       notes={activeLead?.notes}
//                       isOpen={isStatusDialogOpen}
//                       onClose={() => {
//                         setIsStatusDialogOpen(false);
//                         setNewStatus("");
//                       }}
//                       leadId={activeLead?._id}
//                       currentStatus={activeLead?.status}
//                       newStatus={newStatus}
//                       onStatusChange={handleStatusChange}
//                     />
//                   )}
//                   {/* <TableCell className="p-5 min-w-[200px]">
//                     <Select
//                       value={currentStatus}
//                       onValueChange={(value) =>
//                         handleStatusChange(lead._id, value)
//                       }
//                     >
//                       <SelectTrigger className={`w-full ${statusColorClass}`}>
//                         <SelectValue>{currentStatus}</SelectValue>
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="NEW">NEW</SelectItem>
//                         <SelectItem value="Attempted to Contact">
//                           Attempted to Contact
//                         </SelectItem>
//                         <SelectItem value="Not Contact">Not Contact</SelectItem>
//                         <SelectItem value="In-conversation">
//                           In-conversation
//                         </SelectItem>
//                         <SelectItem value="Prospect">Prospect</SelectItem>
//                         <SelectItem value="Not-Eligible">
//                           Not Eligible
//                         </SelectItem>
//                         <SelectItem value="Not-Interested">
//                           Not Interested
//                         </SelectItem>
//                         <SelectItem value="Spam">Spam</SelectItem>
//                         <SelectItem value="Opportunity">Opportunity</SelectItem>
//                         <SelectItem value="Contact-in-Future">
//                           Contact in Future
//                         </SelectItem>
//                         <SelectItem value="Closed-Won">Closed-Won</SelectItem>
//                         <SelectItem value="Closed-Lost">Closed-Lost</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </TableCell> */}

//                   <TableCell className="p-5 max-w-[200px]">
//                     {tempComment[lead._id] !== undefined ? (
//                       <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-slate-700">
//                         {tempComment[lead._id]}
//                       </div>
//                     ) : lead.comment ? (
//                       <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-700 max-h-20 overflow-y-auto">
//                         {lead.comment}
//                       </div>
//                     ) : (
//                       <p className="text-slate-400 italic text-sm">
//                         No comment added
//                       </p>
//                     )}
//                   </TableCell>

//                   <TableCell className="p-5">
//                     <div className="flex flex-col gap-2 items-end">
//                       {isChanged ? (
//                         <div className="flex gap-2 mb-2">
//                           <Button
//                             variant="default"
//                             size="sm"
//                             className="bg-emerald-600 hover:bg-emerald-700"
//                             onClick={() => handleUpdate(lead._id)}
//                           >
//                             <Check className="h-4 w-4 mr-1" /> Update
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="border-slate-300"
//                             onClick={() => handleRevert(lead._id)}
//                           >
//                             <X className="h-4 w-4 mr-1" /> Revert
//                           </Button>
//                         </div>
//                       ) : null}

//                       <div className="flex gap-2">
//                         <Dialog>
//                           <DialogTrigger asChild>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className="flex items-center gap-1 border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
//                               onClick={() => {
//                                 setActiveLead(lead);
//                               }}
//                             >
//                               <EyeIcon size={14} /> Details
//                             </Button>
//                           </DialogTrigger>

//                           {activeLead && activeLead._id === lead._id && (
//                             <LeadDetailDialog
//                               key={lead._id}
//                               lead={lead}
//                               onStatusChange={onStatusChange}
//                               onAddComment={onAddComment}
//                             />
//                           )}
//                         </Dialog>

//                         <Dialog>
//                           <DialogTrigger asChild>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className="flex items-center gap-1 border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100"
//                               onClick={() => {
//                                 if (!lead)
//                                   return toast.error("No lead selected");

//                                 setActiveLead(lead);
//                                 setCommentText(lead.comment || "");
//                               }}
//                             >
//                               <MessageSquare size={14} />{" "}
//                               {lead.comment ? "Edit" : "Comment"}
//                             </Button>
//                           </DialogTrigger>
//                           <DialogContent className="max-w-3xl">
//                             <DialogHeader>
//                               <DialogTitle className="text-xl">
//                                 {lead.comment ? "Edit Comment" : "Add Comment"}
//                               </DialogTitle>
//                               <DialogDescription>
//                                 {lead.comment
//                                   ? "Update your notes about this lead"
//                                   : "Add notes about this lead for future reference"}
//                               </DialogDescription>
//                             </DialogHeader>
//                             <div className="mt-2 mb-4">
//                               <Textarea
//                                 className="min-h-[120px] p-3 text-base"
//                                 placeholder="Write a comment..."
//                                 value={commentText}
//                                 onChange={(e) => setCommentText(e.target.value)}
//                               />
//                             </div>
//                             <div className="flex justify-end gap-2">
//                               <DialogClose asChild>
//                                 <Button variant="outline">Cancel</Button>
//                               </DialogClose>
//                               <Button
//                                 onClick={() => {
//                                   if (commentText.trim()) {
//                                     if (!activeLead?._id) {
//                                       toast.error("No lead selected");
//                                       return;
//                                     }
//                                     // Save to temp state instead of immediately submitting
//                                     saveCommentToTemp(
//                                       activeLead._id,
//                                       commentText.trim()
//                                     );
//                                     toast.success(
//                                       "Comment saved. Click Update to apply changes."
//                                     );
//                                   }
//                                 }}
//                                 className="bg-purple-600 hover:bg-purple-700"
//                               >
//                                 Save Comment
//                               </Button>
//                             </div>
//                           </DialogContent>
//                         </Dialog>
//                       </div>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default LeadsTableView;
