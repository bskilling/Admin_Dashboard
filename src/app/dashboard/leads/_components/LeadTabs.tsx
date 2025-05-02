// "use client";

// import React from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import {
//   Users,
//   Briefcase,
//   GraduationCap,
//   UserSquare,
//   LandmarkIcon,
// } from "lucide-react";
// import { Lead } from "./type";
// import LeadsTableView from "./LeadTableView";

// interface LeadsTabsProps {
//   activeTab: string;
//   setActiveTab: React.Dispatch<React.SetStateAction<string>>;
//   counts: {
//     all: number;
//     b2i: number;
//     b2b: number;
//     b2c: number;
//     b2g: number;
//   };
//   filteredLeads: Lead[];
//   onStatusChange: (id: string, status: string) => void;
//   onAddComment: (id: string, comment: string) => void;
//   renderStatusBadge: (status?: string) => React.ReactNode;
//   renderTypeBadge: (type: string) => React.ReactNode;
//   renderCategoryIcon: (category: string) => React.ReactNode;
// }

// const LeadsTabs: React.FC<LeadsTabsProps> = ({
//   activeTab,
//   setActiveTab,
//   counts,
//   filteredLeads,
//   onStatusChange,
//   onAddComment,
//   renderStatusBadge,
//   renderTypeBadge,
//   renderCategoryIcon,
// }) => {
//   return (
//     <Tabs
//       defaultValue="all"
//       className="mb-6"
//       value={activeTab}
//       onValueChange={setActiveTab}
//     >
//       <TabsList className="grid grid-cols-5 mb-4">
//         <TabsTrigger value="all" className="flex items-center gap-2">
//           <Users className="h-4 w-4" />
//           All{" "}
//           <Badge variant="outline" className="ml-1">
//             {counts.all}
//           </Badge>
//         </TabsTrigger>
//         <TabsTrigger value="b2i" className="flex items-center gap-2">
//           <GraduationCap className="h-4 w-4" />
//           B2I{" "}
//           <Badge variant="outline" className="ml-1">
//             {counts.b2i}
//           </Badge>
//         </TabsTrigger>
//         <TabsTrigger value="b2b" className="flex items-center gap-2">
//           <Briefcase className="h-4 w-4" />
//           B2B{" "}
//           <Badge variant="outline" className="ml-1">
//             {counts.b2b}
//           </Badge>
//         </TabsTrigger>
//         <TabsTrigger value="b2c" className="flex items-center gap-2">
//           <UserSquare className="h-4 w-4" />
//           B2C{" "}
//           <Badge variant="outline" className="ml-1">
//             {counts.b2c}
//           </Badge>
//         </TabsTrigger>
//         <TabsTrigger value="b2g" className="flex items-center gap-2">
//           <LandmarkIcon className="h-4 w-4" />
//           B2G{" "}
//           <Badge variant="outline" className="ml-1">
//             {counts.b2g}
//           </Badge>
//         </TabsTrigger>
//       </TabsList>

//       <TabsContent value="all" className="m-0">
//         <LeadsTableView
//           leads={filteredLeads}
//           onStatusChange={onStatusChange}
//           onAddComment={onAddComment}
//           renderStatusBadge={renderStatusBadge}
//           renderTypeBadge={renderTypeBadge}
//           renderCategoryIcon={renderCategoryIcon}
//         />
//       </TabsContent>
//       <TabsContent value="b2i" className="m-0">
//         <LeadsTableView
//           leads={filteredLeads}
//           onStatusChange={onStatusChange}
//           onAddComment={onAddComment}
//           renderStatusBadge={renderStatusBadge}
//           renderTypeBadge={renderTypeBadge}
//           renderCategoryIcon={renderCategoryIcon}
//         />
//       </TabsContent>
//       <TabsContent value="b2b" className="m-0">
//         <LeadsTableView
//           leads={filteredLeads}
//           onStatusChange={onStatusChange}
//           onAddComment={onAddComment}
//           renderStatusBadge={renderStatusBadge}
//           renderTypeBadge={renderTypeBadge}
//           renderCategoryIcon={renderCategoryIcon}
//         />
//       </TabsContent>
//       <TabsContent value="b2c" className="m-0">
//         <LeadsTableView
//           leads={filteredLeads}
//           onStatusChange={onStatusChange}
//           onAddComment={onAddComment}
//           renderStatusBadge={renderStatusBadge}
//           renderTypeBadge={renderTypeBadge}
//           renderCategoryIcon={renderCategoryIcon}
//         />
//       </TabsContent>
//       <TabsContent value="b2g" className="m-0">
//         <LeadsTableView
//           leads={filteredLeads}
//           onStatusChange={onStatusChange}
//           onAddComment={onAddComment}
//           renderStatusBadge={renderStatusBadge}
//           renderTypeBadge={renderTypeBadge}
//           renderCategoryIcon={renderCategoryIcon}
//         />
//       </TabsContent>
//     </Tabs>
//   );
// };

// export default LeadsTabs;
