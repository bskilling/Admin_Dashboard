"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import env from "@/lib/env";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FileUploader from "@/components/global/FileUploader";

// Metadata Schema
const draftMetaSchema = z.object({
  courseId: z.string().length(24),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z
    .string()
    .transform((val) => (val ? val.split(",").map((v) => v.trim()) : []))
    .optional(),
  metaUrl: z.string().optional(),
  metaImage: z.string().length(24).optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogType: z.enum(["website", "article", "course"]).optional(),
  ogImage: z.string().optional(),
  twitterCard: z.enum(["summary", "summary_large_image"]).optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().optional(),
  schemaMarkup: z.string().optional(),
  sitemapPriority: z.coerce.number().min(0.1).max(1.0).optional(),
  robotsIndex: z.boolean().optional(),
  robotsFollow: z.boolean().optional(),
});

type MetadataFormValues = z.infer<typeof draftMetaSchema>;

export default function MetadataForm({ id }: { id: string }) {
  const [metaImage, setMetaImage] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [twitterImage, setTwitterImage] = useState("");

  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, reset, watch, formState } =
    useForm<MetadataFormValues>({
      resolver: zodResolver(draftMetaSchema),
      defaultValues: {
        robotsIndex: false,
        robotsFollow: false,
        courseId: id,
      },
    });
  const errors = formState.errors;
  const isSubmitting = formState.isSubmitting;

  // Fetch metadata from API
  const draftQuery = useQuery({
    queryKey: ["metadata-draft", id],
    queryFn: async () => {
      const res = await axios.get(
        env.BACKEND_URL + `/api/meta-data/draft/${id}`
      );
      const data = res.data.data;

      reset({
        ...data,
        sitemapPriority: data?.sitemapPriority || 0.5,
      });

      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60, // 1 hour cache
    retry: false,
  });

  // Update metadata API call
  const updateMetadataMutation = useMutation({
    mutationFn: async (data: MetadataFormValues) => {
      const res = await axios.post(
        env.BACKEND_URL + `/api/meta-data/draft`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Metadata updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["metadata-draft", id] });
    },
    onError: (error) => {
      toast.error("Failed to update metadata: " + error.message);
    },
  });

  const onSubmit = async (data: MetadataFormValues) => {
    // setValue("courseId", id);
    updateMetadataMutation.mutate(data);
  };
  useEffect(() => {
    // setMetaImage(draftQuery.data?.metaImage || "");
    setValue("courseId", id);
  }, []);

  if (draftQuery.isLoading)
    return <div className="text-center p-4">Loading metadata...</div>;
  //   if (draftQuery.isError)
  //     return (
  //       <div className="text-center p-4 text-red-500">
  //         Failed to load metadata
  //       </div>
  //     );

  return (
    <Dialog>
      <DialogTrigger className="m-0 p-0">
        <Button className="bg-green-600 fixed top-6 left-60 z-[999]">
          Meta Data{" "}
        </Button>
      </DialogTrigger>
      <DialogContent className="!w-[80vw]  h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Upload Meta Data
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 grid grid-cols-2 gap-5"
        >
          <div>
            <label className="block text-sm font-medium">Meta Title</label>
            <Input {...register("metaTitle")} placeholder="Enter meta title" />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Meta Description
            </label>
            <Textarea
              {...register("metaDescription")}
              placeholder="Enter meta description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Meta Keywords (comma separated)
            </label>
            <Input
              {...register("metaKeywords")}
              placeholder="e.g. SEO, Metadata, Optimization"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Meta URL</label>
            <Input {...register("metaUrl")} placeholder="Enter meta URL" />
          </div>

          <div>
            <label className="block text-sm font-medium">Meta Image</label>
            {/* <Input
              {...register("metaImage")}
              placeholder="Enter meta image URL"
            /> */}
            <FileUploader
              setFileId={(id) => {
                if (id) setValue("metaImage", id);
              }}
              title="cc"
              id={watch("metaImage")}
              label="Meta Image"
              purpose="meta"
              setUrl={(url) => {
                if (url) setMetaImage(url);
              }}
              url={metaImage}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">OG Title</label>
            <Input
              {...register("ogTitle")}
              placeholder="Enter OG title"
              error={errors.ogTitle?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">OG Description</label>
            <Textarea
              {...register("ogDescription")}
              placeholder="Enter OG description"
              error={errors.ogDescription?.message}
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium">OG Image</label>
            <Input {...register("ogImage")} placeholder="Enter OG image URL" />
          </div> */}
          <FileUploader
            setFileId={(id) => {
              if (id) setValue("ogImage", id);
            }}
            title="Og Image"
            id={watch("ogImage")}
            label="Og Image"
            purpose="meta"
            setUrl={(url) => {
              if (url) setOgImage(url);
            }}
            url={ogImage}
          />

          <div>
            <label className="block text-sm font-medium">OG Type</label>
            <Select
              onValueChange={(value) =>
                setValue("ogType", value as MetadataFormValues["ogType"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select OG Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="course">Course</SelectItem>
              </SelectContent>
            </Select>
            {errors.ogType?.message && (
              <p className="text-red-500 text-sm">{errors.ogType?.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Twitter Card</label>
            <Select
              onValueChange={(value) =>
                setValue(
                  "twitterCard",
                  value as MetadataFormValues["twitterCard"]
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Twitter Card Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="summary_large_image">
                  Summary Large Image
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.twitterCard?.message && (
              <p className="text-red-500 text-sm">
                {errors.twitterCard?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Twitter Title</label>
            <Input
              {...register("twitterTitle")}
              placeholder="Enter Twitter title"
              error={errors.twitterTitle?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Twitter Description
            </label>
            <Textarea
              {...register("twitterDescription")}
              placeholder="Enter Twitter description"
              error={errors.twitterDescription?.message}
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium">Twitter Image</label>
            <Input
              {...register("twitterImage")}
              placeholder="Enter Twitter image URL"
            />
          </div> */}

          <FileUploader
            setFileId={(id) => {
              if (id) setValue("twitterImage", id);
            }}
            title="twitterImage"
            id={watch("twitterImage")}
            label="Twitter Image"
            purpose="meta"
            setUrl={(url) => {
              if (url) setOgImage(url);
            }}
            url={ogImage}
          />

          <div>
            <label className="block text-sm font-medium">
              Schema Markup (JSON-LD)
            </label>
            <Textarea
              {...register("schemaMarkup")}
              placeholder="Enter schema markup (JSON-LD format)"
              error={errors.schemaMarkup?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Sitemap Priority (0.1 - 1.0)
            </label>
            <Input
              type="number"
              step="0.1"
              min="0.1"
              max="1.0"
              {...register("sitemapPriority")}
              placeholder="Enter sitemap priority"
              error={errors.sitemapPriority?.message}
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch {...register("robotsIndex")} />
            <label className="text-sm font-medium">
              Allow Search Engine Indexing?
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Switch {...register("robotsFollow")} />
            <label className="text-sm font-medium">
              Allow Search Engine Following?
            </label>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || updateMetadataMutation.isPending}
            className="w-full"
          >
            {updateMetadataMutation.isPending ? "Saving..." : "Update Metadata"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
