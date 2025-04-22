"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Trash,
  Edit,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import { EmiLead } from "./emi-leads-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zod schema for adding a note
const addNoteSchema = z.object({
  text: z.string().min(1, "Note text is required"),
  status: z.enum([
    "NEW",
    "Attempted to Contact",
    "In-conversation",
    "Spam",
    "Converted",
    "Not-Converted",
  ]),
  addedBy: z.string().optional(),
});

type AddNoteInput = z.infer<typeof addNoteSchema>;

// Zod schema for EMI details
const emiDetailsSchema = z.object({
  partner: z.enum(["liquiloans", "shopse"]),
  loanAmount: z.coerce.number().positive("Loan amount must be positive"),
  loanTenure: z.coerce
    .number()
    .int()
    .positive("Loan tenure must be a positive integer"),
  loanInterestRate: z.coerce
    .number()
    .positive("Interest rate must be positive"),
  loanProcessingFee: z.coerce
    .number()
    .nonnegative("Processing fee must be non-negative"),
});

type EmiDetailsInput = z.infer<typeof emiDetailsSchema>;

interface EmiLeadActionsProps {
  leadId: string;
  lead: EmiLead;
}

export function EmiLeadActions({ leadId, lead }: EmiLeadActionsProps) {
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isUpdateEmiDetailsOpen, setIsUpdateEmiDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  // Add note form
  const {
    register: registerNote,
    handleSubmit: handleNoteSubmit,
    reset: resetNoteForm,
    formState: { errors: noteErrors, isSubmitting: isNoteSubmitting },
  } = useForm<AddNoteInput>({
    resolver: zodResolver(addNoteSchema),
    defaultValues: {
      text: "",
      status: lead.status as any,
      addedBy: "Admin", // Default value, could be dynamic based on logged-in user
    },
  });

  // EMI details form
  const {
    register: registerEmiDetails,
    handleSubmit: handleEmiDetailsSubmit,
    reset: resetEmiDetailsForm,
    formState: {
      errors: emiDetailsErrors,
      isSubmitting: isEmiDetailsSubmitting,
    },
    setValue,
  } = useForm<EmiDetailsInput>({
    resolver: zodResolver(emiDetailsSchema),
    defaultValues: {
      partner:
        (lead.emiDetails?.partner as "liquiloans" | "shopse") || "liquiloans",
      loanAmount: lead.emiDetails?.loanAmount || lead.amount || 0,
      loanTenure: lead.emiDetails?.loanTenure || 3,
      loanInterestRate: lead.emiDetails?.loanInterestRate || 0,
      loanProcessingFee: lead.emiDetails?.loanProcessingFee || 0,
    },
  });

  // Initialize EMI details form with lead data when dialog opens
  useEffect(() => {
    if (lead.emiDetails && isUpdateEmiDetailsOpen) {
      setValue("partner", lead.emiDetails.partner as "liquiloans" | "shopse");
      setValue("loanAmount", lead.emiDetails.loanAmount);
      setValue("loanTenure", lead.emiDetails.loanTenure);
      setValue("loanInterestRate", lead.emiDetails.loanInterestRate);
      setValue("loanProcessingFee", lead.emiDetails.loanProcessingFee);
    }
  }, [lead.emiDetails, isUpdateEmiDetailsOpen, setValue]);

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: (data: AddNoteInput) =>
      axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emi-leads/${leadId}/notes`,
        data
      ),
    onSuccess: () => {
      toast.success("Note added successfully");
      resetNoteForm();
      setIsAddNoteOpen(false);
      queryClient.invalidateQueries({ queryKey: ["emiLeads"] });
    },
    onError: (error) => {
      toast.error("Failed to add note");
      console.error("Error adding note:", error);
    },
  });

  // Update EMI details mutation
  const updateEmiDetailsMutation = useMutation({
    mutationFn: (data: { emiDetails: EmiDetailsInput }) =>
      axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emi-leads/${leadId}/emi-details`,
        data
      ),
    onSuccess: () => {
      toast.success("EMI details updated successfully");
      resetEmiDetailsForm();
      setIsUpdateEmiDetailsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["emiLeads"] });
    },
    onError: (error) => {
      toast.error("Failed to update EMI details");
      console.error("Error updating EMI details:", error);
    },
  });

  // Delete lead mutation
  const deleteLeadMutation = useMutation({
    mutationFn: () =>
      axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emi-leads/${leadId}`
      ),
    onSuccess: () => {
      toast.success("EMI lead deleted successfully");
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["emiLeads"] });
    },
    onError: (error) => {
      toast.error("Failed to delete EMI lead");
      console.error("Error deleting EMI lead:", error);
    },
  });

  // Handle form submissions
  const onAddNote = (data: AddNoteInput) => {
    addNoteMutation.mutate(data);
  };

  const onUpdateEmiDetails = (data: EmiDetailsInput) => {
    updateEmiDetailsMutation.mutate({ emiDetails: data });
  };

  const onDeleteLead = () => {
    deleteLeadMutation.mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        {/* Add Note Dialog */}
        <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Add Note
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Note</DialogTitle>
              <DialogDescription>
                Add a note and update the status for this lead.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNoteSubmit(onAddNote)}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="text">Note</Label>
                  <Textarea
                    id="text"
                    placeholder="Enter your note here..."
                    {...registerNote("text")}
                    className="min-h-[100px]"
                  />
                  {noteErrors.text && (
                    <p className="text-xs text-red-500">
                      {noteErrors.text.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    defaultValue={lead.status}
                    {...registerNote("status")}
                    onValueChange={(value) => {
                      // Using the setValue method from useForm
                      const formMethods = registerNote("status").ref as any;
                      formMethods.onChange({ target: { value } });
                    }}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">New</SelectItem>
                      <SelectItem value="Attempted to Contact">
                        Attempted to Contact
                      </SelectItem>
                      <SelectItem value="In-conversation">
                        In Conversation
                      </SelectItem>
                      <SelectItem value="Spam">Spam</SelectItem>
                      <SelectItem value="Converted">Converted</SelectItem>
                      <SelectItem value="Not-Converted">
                        Not Converted
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {noteErrors.status && (
                    <p className="text-xs text-red-500">
                      {noteErrors.status.message}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddNoteOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={addNoteMutation.isPending}>
                  {addNoteMutation.isPending ? "Saving..." : "Save Note"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Update EMI Details Dialog */}
        <Dialog
          open={isUpdateEmiDetailsOpen}
          onOpenChange={setIsUpdateEmiDetailsOpen}
        >
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <CreditCard className="mr-2 h-4 w-4" />
              Update EMI Details
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>EMI Details</DialogTitle>
              <DialogDescription>
                Update the EMI and loan details for this lead.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEmiDetailsSubmit(onUpdateEmiDetails)}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="partner">Partner</Label>
                  <Select
                    defaultValue={lead.emiDetails?.partner || "liquiloans"}
                    onValueChange={(value) => {
                      setValue("partner", value as "liquiloans" | "shopse");
                    }}
                  >
                    <SelectTrigger id="partner">
                      <SelectValue placeholder="Select partner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="liquiloans">Liquiloans</SelectItem>
                      <SelectItem value="shopse">ShopSe</SelectItem>
                    </SelectContent>
                  </Select>
                  {emiDetailsErrors.partner && (
                    <p className="text-xs text-red-500">
                      {emiDetailsErrors.partner.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="loanAmount">Loan Amount</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    placeholder="Enter loan amount"
                    {...registerEmiDetails("loanAmount")}
                  />
                  {emiDetailsErrors.loanAmount && (
                    <p className="text-xs text-red-500">
                      {emiDetailsErrors.loanAmount.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="loanTenure">Loan Tenure (months)</Label>
                  <Input
                    id="loanTenure"
                    type="number"
                    placeholder="Enter loan tenure in months"
                    {...registerEmiDetails("loanTenure")}
                  />
                  {emiDetailsErrors.loanTenure && (
                    <p className="text-xs text-red-500">
                      {emiDetailsErrors.loanTenure.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="loanInterestRate">Interest Rate (%)</Label>
                  <Input
                    id="loanInterestRate"
                    type="number"
                    step="0.01"
                    placeholder="Enter interest rate"
                    {...registerEmiDetails("loanInterestRate")}
                  />
                  {emiDetailsErrors.loanInterestRate && (
                    <p className="text-xs text-red-500">
                      {emiDetailsErrors.loanInterestRate.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="loanProcessingFee">Processing Fee</Label>
                  <Input
                    id="loanProcessingFee"
                    type="number"
                    step="0.01"
                    placeholder="Enter processing fee"
                    {...registerEmiDetails("loanProcessingFee")}
                  />
                  {emiDetailsErrors.loanProcessingFee && (
                    <p className="text-xs text-red-500">
                      {emiDetailsErrors.loanProcessingFee.message}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUpdateEmiDetailsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateEmiDetailsMutation.isPending}
                >
                  {updateEmiDetailsMutation.isPending
                    ? "Saving..."
                    : "Save Details"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <DropdownMenuSeparator />

        {/* Delete Alert Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-red-600"
              onSelect={(e) => e.preventDefault()}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                EMI lead and all its associated notes and details.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDeleteLead}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteLeadMutation.isPending}
              >
                {deleteLeadMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
