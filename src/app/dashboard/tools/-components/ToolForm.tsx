"use client";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTools } from "./useTools";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import env from "@/lib/env";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaSquarePlus } from "react-icons/fa6";
import AlertLoader from "@/components/global/AlertLoader";
import FileUploader from "@/components/global/FileUploader";

// Table components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Pagination components
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const zodSchema = z.object({
  title: z.string().min(3, "Title is required"),
  logo: z.string().length(24, "Logo is required"),
});

type ToolType = z.infer<typeof zodSchema>;

interface ToolLogo {
  _id: string;
  viewUrl: string;
}

interface Tool {
  _id: string;
  title: string;
  logo?: ToolLogo;
}

export default function ToolForm() {
  const { data, isLoading } = useTools();
  const [show, setShow] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [deletingToolId, setDeletingToolId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [url, setUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Filtered and paginated data
  const [filteredData, setFilteredData] = useState<Tool[]>([]);
  const [paginatedData, setPaginatedData] = useState<Tool[]>([]);

  const form = useForm<ToolType>({
    defaultValues: {
      title: "",
      logo: "",
    },
    resolver: zodResolver(zodSchema),
  });

  // Filter and paginate data when search query or data changes
  useEffect(() => {
    if (!data) return;

    const filtered = searchQuery
      ? data.filter((tool: Tool) =>
          tool.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : data;

    setFilteredData(filtered);

    // Calculate pagination
    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    setPaginatedData(filtered.slice(firstItemIndex, lastItemIndex));
  }, [data, searchQuery, currentPage, itemsPerPage]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const createNewTool = useMutation({
    mutationKey: ["new-tool"],
    mutationFn: async (data: ToolType) => {
      const res = await axios.post(`${env?.BACKEND_URL}/api/tools`, data);
      return res.data.data;
    },
    onSuccess: () => {
      form.reset({ title: "", logo: "" });
      toast.success("Tool created successfully");
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      setShow(false);
    },
  });

  const deleteTool = useMutation({
    mutationKey: ["delete-tool"],
    mutationFn: async (id: string) => {
      const res = await axios.delete(`${env?.BACKEND_URL}/api/tools/${id}`);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Tool deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      setDeletingToolId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateTool = useMutation({
    mutationKey: ["update-tool"],
    mutationFn: async (data: { _id: string; title: string; logo: string }) => {
      const res = await axios.put(
        `${env?.BACKEND_URL}/api/tools/${data._id}`,
        data
      );
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Tool updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      setEditingTool(null);
      form.reset({ title: "", logo: "" });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleEditClick = (tool: Tool) => {
    form.reset({
      title: tool.title,
      logo: tool.logo?._id || "",
    });
    setEditingTool(tool);
  };

  const handleEditClose = () => {
    setEditingTool(null);
    form.reset({ title: "", logo: "" });
  };

  const handleDeleteClick = (toolId: string) => {
    setDeletingToolId(toolId);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderPaginationItems = (): React.ReactNode[] => {
    const items: React.ReactNode[] = [];
    const maxVisiblePages = 5;

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Calculate range around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust range if at edges
    if (currentPage <= 3) {
      endPage = Math.min(totalPages - 1, maxVisiblePages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 2);
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2 && totalPages > maxVisiblePages) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="p-10">
      <AlertLoader isloading={isLoading} />

      <div className="flex justify-between items-center mb-6">
        <div className="w-1/3">
          <Input
            placeholder="Search Tool"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Dialog open={show} onOpenChange={setShow}>
          <DialogTrigger>
            <Button className="flex items-center gap-x-2">
              <FaSquarePlus /> Create New Tool
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tool</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new tool.
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit((data) => createNewTool.mutate(data))}
            >
              <Input
                {...form.register("title")}
                placeholder="Enter tool"
                label="Tool"
                error={form.formState.errors.title?.message}
              />
              <FileUploader
                title="Tool Image"
                purpose="tool"
                setFileId={(id) => id && form.setValue("logo", id)}
                id={form.watch("logo")}
                key="tool"
                label="Tool Logo"
                setUrl={(url) => url && setUrl(url)}
              />
              {form.formState.errors.logo?.message && (
                <p className="text-red-500">
                  {form.formState.errors.logo?.message}
                </p>
              )}
              <div className="flex justify-end">
                <Button>Add Tool</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {data?.length === 0 ? (
        <div className="flex flex-col items-center mt-10 gap-y-5">
          <p className="text-2xl font-bold">No tools found</p>
          <Button onClick={() => setShow(true)}>Add New Tool</Button>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="flex flex-col items-center mt-10 gap-y-5">
          <p className="text-xl">No results found for "{searchQuery}"</p>
          <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Tool Name</TableHead>
                  <TableHead className="w-80 text-center">Icon</TableHead>

                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((tool) => (
                  <TableRow key={tool._id}>
                    <TableCell className="font-medium capitalize">
                      {tool.title}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <img
                          src={tool.logo?.viewUrl}
                          alt={tool.title}
                          className="w-40 h-40 object-contain"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-3">
                        <Dialog
                          open={editingTool?._id === tool._id}
                          onOpenChange={(open) => !open && handleEditClose()}
                        >
                          <DialogTrigger>
                            <button
                              onClick={() => handleEditClick(tool)}
                              className="p-1 hover:bg-gray-100 rounded-full"
                              title="Edit"
                            >
                              <MdEdit size={20} />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-h-[80vh]">
                            <DialogHeader>
                              <DialogTitle>Edit Tool</DialogTitle>
                              <DialogDescription>
                                Changes will update the tool everywhere it is
                                used.
                              </DialogDescription>
                            </DialogHeader>
                            <form
                              className="space-y-6"
                              onSubmit={form.handleSubmit((data) =>
                                updateTool.mutate({
                                  _id: editingTool?._id ?? "",
                                  title: data.title,
                                  logo: data.logo,
                                })
                              )}
                            >
                              <Input
                                {...form.register("title")}
                                placeholder="Enter tool"
                                label="Tool"
                                error={form.formState.errors.title?.message}
                              />
                              <FileUploader
                                title="Tool Image"
                                purpose="tool"
                                setFileId={(id) =>
                                  id && form.setValue("logo", id)
                                }
                                id={form.watch("logo")}
                                key={`tool-edit-${tool._id}`}
                                label="Tool Logo"
                                setUrl={(url) => url && setUrl(url)}
                                url={editingTool?.logo?.viewUrl}
                              />
                              {form.formState.errors.logo?.message && (
                                <p className="text-red-500">
                                  {form.formState.errors.logo?.message}
                                </p>
                              )}
                              <div className="flex justify-end gap-3">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={handleEditClose}
                                >
                                  Cancel
                                </Button>
                                <Button type="submit">Confirm Edit</Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={deletingToolId === tool._id}
                          onOpenChange={(open) =>
                            !open && setDeletingToolId(null)
                          }
                        >
                          <DialogTrigger>
                            <button
                              className="p-1 hover:bg-gray-100 rounded-full"
                              onClick={() => handleDeleteClick(tool._id)}
                              title="Delete"
                            >
                              <MdDelete size={20} className="text-red-500" />
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Are you sure?</DialogTitle>
                              <DialogDescription>
                                This action is irreversible and will delete the
                                tool permanently.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-3">
                              <Button
                                variant="outline"
                                onClick={() => setDeletingToolId(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => deleteTool.mutate(tool._id)}
                              >
                                Confirm Delete
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {renderPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-500 text-center">
            Showing {paginatedData.length} of {filteredData.length} tools
          </div>
        </>
      )}
    </div>
  );
}
