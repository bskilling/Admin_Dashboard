"use client";
import FileUploader from "@/components/global/FileUploader";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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

const zodSchema = z.object({
  title: z.string().min(3, "Title is required"),
  logo: z.string().length(24, "Logo is required"),
});

type ToolType = z.infer<typeof zodSchema>;

export default function ToolForm() {
  const { data, isLoading } = useTools();
  const [show, setShow] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [deletingToolId, setDeletingToolId] = useState(null);
  const queryClient = useQueryClient();
  const [url, setUrl] = useState<null | string>(null);

  const form = useForm<ToolType>({
    defaultValues: {
      title: "",
      logo: "",
    },
    resolver: zodResolver(zodSchema),
  });

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
    onError: (error) => {
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
    onError: (error) => {
      toast.error(error.message);
    },
  });
  // @ts-ignore
  const handleEditClick = (tool) => {
    form.reset({
      title: tool.title,
      logo: tool.logo?._id,
    });
    setEditingTool(tool);
  };

  const handleEditClose = () => {
    setEditingTool(null);
    form.reset({ title: "", logo: "" });
  };

  // @ts-ignore
  const handleDeleteClick = (toolId) => {
    setDeletingToolId(toolId);
  };

  return (
    <div className="p-10">
      <AlertLoader isloading={isLoading} />
      <div className="mb-6">
        <Input placeholder="Search Tool" label="Search Tool" />
      </div>
      <div className="flex justify-end mb-6">
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

      {data?.length === 0 && (
        <div className="flex flex-col items-center mt-10 gap-y-5">
          <p className="text-2xl font-bold">No tools found</p>
          <Button onClick={() => setShow(true)}>Add New Tool</Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {data?.map((tool) => (
          <div
            key={tool._id}
            className="flex flex-col items-center border rounded-lg p-5 shadow-md bg-white"
          >
            <img
              src={tool.logo?.viewUrl}
              alt={tool.title}
              className="w-20  object-cover "
            />
            {/* <p className="mt-2 font-bold capitalize text-center">
              {tool.title}
            </p> */}
            <div className="flex justify-center gap-3 mt-5">
              <Dialog
                open={
                  // @ts-ignore
                  editingTool?._id === tool._id
                }
                onOpenChange={(open) => !open && handleEditClose()}
              >
                <DialogTrigger>
                  <button onClick={() => handleEditClick(tool)} className="p-2">
                    <MdEdit size={20} />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Edit Tool</DialogTitle>
                    <DialogDescription>
                      Changes will update the tool everywhere it is used.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit((data) =>
                      updateTool.mutate({
                        // @ts-ignore

                        _id: editingTool?._id,
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
                      setFileId={(id) => id && form.setValue("logo", id)}
                      id={form.watch("logo")}
                      key={`tool-edit-${tool._id}`}
                      label="Tool Logo"
                      setUrl={(url) => url && setUrl(url)}
                      url={
                        // @ts-ignore
                        editingTool?.logo?.viewUrl
                      }
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
                onOpenChange={(open) => !open && setDeletingToolId(null)}
              >
                <DialogTrigger>
                  <button
                    className="p-2"
                    onClick={() => handleDeleteClick(tool._id)}
                  >
                    <MdDelete size={20} className="" />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                      This action is irreversible and will delete the tool
                      permanently.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setDeletingToolId(null)}
                    >
                      Cancel
                    </Button>
                    {/* <Button
                      variant="destructive"
                      onClick={() => deleteTool?.mutate(tool._id)}
                    >
                      Confirm Delete
                    </Button> */}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
