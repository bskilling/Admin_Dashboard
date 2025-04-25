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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogType: z.enum(["website", "article", "course"]).optional(),
  ogImage: z.string().length(24).optional(),
  schemaMarkup: z.string().optional(),
  sitemapPriority: z.coerce.number().min(0.1).max(1.0).optional(),
  robotsIndex: z.boolean().optional(),
  robotsFollow: z.boolean().optional(),
});

type MetadataFormValues = z.infer<typeof draftMetaSchema>;

export default function MetadataForm({ id }: { id: string }) {
  const [ogImage, setOgImage] = useState("");

  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, reset, watch, formState } =
    useForm<MetadataFormValues>({
      resolver: zodResolver(draftMetaSchema),
      defaultValues: {
        robotsIndex: true,
        robotsFollow: true,
        courseId: id,
        sitemapPriority: 0.5,
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

      if (data?.ogImage) {
        setOgImage(data.ogImage);
      }

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
    updateMetadataMutation.mutate(data);
  };

  useEffect(() => {
    setValue("courseId", id);
  }, []);

  if (draftQuery.isLoading)
    return <div className="text-center p-4">Loading metadata...</div>;

  return (
    <Dialog>
      <DialogTrigger className="m-0 p-0">
        <Button className="bg-green-600 fixed top-6 left-60 z-[999]">
          Meta Data
        </Button>
      </DialogTrigger>
      <DialogContent className="!w-[80vw] h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            SEO Metadata Settings
          </DialogTitle>
          <DialogDescription>
            Configure search engine optimization settings for your course
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 grid grid-cols-2 gap-5"
        >
          {/* Basic Meta Section */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-2">Basic Meta Tags</h3>
          </div>

          <div>
            <label className="block text-sm font-medium">Meta Title</label>
            <Input
              {...register("metaTitle")}
              placeholder="Enter meta title"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optimal length: 50-60 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Meta Description
            </label>
            <Textarea
              {...register("metaDescription")}
              placeholder="Enter meta description"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optimal length: 150-160 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Meta Keywords (comma separated)
            </label>
            <Input
              {...register("metaKeywords")}
              placeholder="e.g. SEO, Metadata, Optimization"
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Meta URL Slug</label>
            <Input
              {...register("metaUrl")}
              placeholder="Enter URL slug (e.g., learn-javascript)"
              className="mt-1"
            />
          </div>

          {/* Open Graph Section */}
          <div className="col-span-2 mt-4">
            <h3 className="text-lg font-semibold mb-2">
              Social Media Sharing (Open Graph)
            </h3>
          </div>

          <div>
            <label className="block text-sm font-medium">OG Title</label>
            <Input
              {...register("ogTitle")}
              placeholder="Enter title for social sharing"
              className="mt-1"
            />
            {errors.ogTitle?.message && (
              <p className="text-red-500 text-sm">{errors.ogTitle?.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">OG Description</label>
            <Textarea
              {...register("ogDescription")}
              placeholder="Enter description for social sharing"
              className="mt-1"
            />
            {errors.ogDescription?.message && (
              <p className="text-red-500 text-sm">
                {errors.ogDescription?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">OG Type</label>
            <Select
              onValueChange={(value) =>
                setValue("ogType", value as MetadataFormValues["ogType"])
              }
              defaultValue={watch("ogType")}
            >
              <SelectTrigger className="mt-1">
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
            <label className="block text-sm font-medium">OG Image</label>
            <FileUploader
              setFileId={(id) => {
                if (id) setValue("ogImage", id);
              }}
              title="Social Media Image"
              id={watch("ogImage")}
              label="Upload image (1200x630px recommended)"
              purpose="meta"
              setUrl={(url) => {
                if (url) setOgImage(url);
              }}
              url={ogImage}
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended size: 1200x630 pixels
            </p>
          </div>

          {/* Advanced SEO Section */}
          <div className="col-span-2 mt-4">
            <h3 className="text-lg font-semibold mb-2">
              Advanced SEO Settings
            </h3>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium">
              Schema Markup (JSON-LD)
            </label>
            <Textarea
              {...register("schemaMarkup")}
              placeholder='{"@context": "https://schema.org", "@type": "Course", ...}'
              className="mt-1 font-mono text-xs h-40"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter structured data in JSON-LD format for rich search results
            </p>
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
              placeholder="0.5"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Higher values indicate more important pages
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={watch("robotsIndex")}
                onCheckedChange={(checked) => setValue("robotsIndex", checked)}
              />
              <label className="text-sm font-medium">
                Allow Search Engine Indexing
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={watch("robotsFollow")}
                onCheckedChange={(checked) => setValue("robotsFollow", checked)}
              />
              <label className="text-sm font-medium">
                Allow Following Links
              </label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || updateMetadataMutation.isPending}
            className="col-span-2 mt-4"
          >
            {updateMetadataMutation.isPending ? "Saving..." : "Update Metadata"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
