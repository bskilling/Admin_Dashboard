"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface EmiLeadStatusProps {
  leadId: string;
  currentStatus: string;
}

export function EmiLeadStatus({ leadId, currentStatus }: EmiLeadStatusProps) {
  const [status, setStatus] = useState(currentStatus);
  const queryClient = useQueryClient();

  // Get badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Attempted to Contact":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "In-conversation":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "Spam":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Converted":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Not-Converted":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) =>
      axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emi-leads/${leadId}`,
        { status: newStatus }
      ),
    onSuccess: () => {
      toast.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["emiLeads"] });
    },
    onError: (error) => {
      toast.error("Failed to update status");
      // Reset to previous status on error
      setStatus(currentStatus);
      console.error("Error updating status:", error);
    },
  });

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === status) return;

    setStatus(newStatus);
    updateStatusMutation.mutate(newStatus);
  };

  return (
    <Select value={status} onValueChange={handleStatusChange}>
      <SelectTrigger className={`w-fit border-none ${getStatusColor(status)}`}>
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="NEW">New</SelectItem>
        <SelectItem value="Attempted to Contact">
          Attempted to Contact
        </SelectItem>
        <SelectItem value="In-conversation">In Conversation</SelectItem>
        <SelectItem value="Spam">Spam</SelectItem>
        <SelectItem value="Converted">Converted</SelectItem>
        <SelectItem value="Not-Converted">Not Converted</SelectItem>
      </SelectContent>
    </Select>
  );
}
