import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { Coursedetailstype } from "../page";
import { draftCourseSchema } from "@/app/dashboard/categories/_components/validators";

interface RootObject {
  _id: string;
  title: string;
  level: string;
  category: string;
  assessment_required: string;
  duration: number;
  language: string;
  description: string;
  owned_by: string;
  endorsed_by: string;
  assessment: string;
  price: number;
  currency: string;
  coupon_code: string;
  discount: number;
  preview_image_uri: string;
  isPaid: boolean;
  training_mode: string;
  training_metadata: Trainingmetadata;
  training_batches: Trainingbatches;
  batch_sessions: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  url: string;
}
interface Trainingbatches {
  description: string;
  batch_name: string;
  isPaid: boolean;
  trainer: string;
  start_time: string;
  enrollment_end_date: string;
  end_date: string;
  _id: string;
}
interface Trainingmetadata {
  headline: string;
  body: string;
  overview: string;
  preview_video: string;
  preview_image: string;
  objectives: Objective[];
  prerequisites: Objective[];
  audience: Objective[];
  skills_covered: Objective[];
  key_features: Objective[];
  benefits: Objective[];
  resources: Objective[];
  outcomes: Objective[];
  certification_text: string;
  certification_image: string;
  FAQs: FAQ[];
  curriculum: Curriculum[];
  who_should_attend: Objective[];
  _id: string;
}
interface Curriculum {
  title: string;
  section_parts: Objective[];
  _id: string;
}
interface FAQ {
  question: string;
  answer: string;
  _id: string;
}
interface Objective {
  title: string;
  _id: string;
}

interface Props {
  courseDetails: RootObject | null;
  selectedCategory: string | null;
  createDraftMutation: any; // Adjust with actual mutation type
}

const DraftCourseButton: React.FC<Props> = ({
  courseDetails,
  selectedCategory,
  createDraftMutation,
}) => {
  const [open, setOpen] = useState(false);
  const [draftData, setDraftData] = useState<z.infer<
    typeof draftCourseSchema
  > | null>(null);

  const handlePreview = () => {
    if (!selectedCategory || !courseDetails) {
      toast.error(
        "Please select a category and ensure course details are loaded"
      );
      return;
    }

    const newDraftData: z.infer<typeof draftCourseSchema> = {
      type: "b2c",
      title: courseDetails?.title || "New Draft Course",
      description: courseDetails?.description || "This is a draft description",
      category: [selectedCategory],
      price: { amount: Number(courseDetails?.price) || 0, currency: "INR" },
      durationHours: courseDetails?.duration || 0,
      skills: [],
      tools: [],
      highlights:
        courseDetails?.training_metadata?.objectives?.map((b) => b.title) || [],
      outcomes:
        courseDetails?.training_metadata?.benefits?.map((b) => b.title) || [],
      whyJoin:
        courseDetails?.training_metadata?.outcomes?.map((b) => b.title) || [],
      slug: courseDetails?.url,
      videoUrl: courseDetails?.training_metadata?.preview_video,
      //@ts-ignore
      overview: {
        keyFeatures:
          courseDetails?.training_metadata?.key_features?.map((o) => o.title) ||
          [],
        title: courseDetails?.training_metadata?.headline || "",
        description: courseDetails?.training_metadata?.body || "",
      },
      //@ts-ignore
      curriculum: {
        prerequisites:
          courseDetails?.training_metadata?.prerequisites?.map(
            (p) => p.title
          ) || [],
        eligibility: courseDetails?.training_metadata?.audience?.map(
          (p) => p.title
        ),
        chapters:
          courseDetails?.training_metadata?.curriculum?.map((c) => ({
            title: c.title,
            lessons: c.section_parts.map((sp) => ({
              title: sp.title,
              content: "",
            })),
          })) || [],
        projects: [],
      },
      faqs:
        courseDetails?.training_metadata?.FAQs?.map((f) => ({
          question: f.question,
          answer: f.answer,
        })) || [],
      startTime: courseDetails?.training_batches?.start_time
        ? new Date(courseDetails.training_batches.start_time)
        : undefined,
      endTime: courseDetails?.training_batches?.end_date
        ? new Date(courseDetails.training_batches.end_date)
        : undefined,
      isPaid: courseDetails?.training_batches?.isPaid ?? false,
      isPublished: false,
    };

    setDraftData(newDraftData);
    setOpen(true);
  };

  const handleCreateDraft = () => {
    if (!draftData) return;

    createDraftMutation.mutate({
      data: draftData,
      //   _id: courseDetails?._id || "",
    });

    setOpen(false);
  };

  return (
    <>
      <button
        onClick={handlePreview}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Preview Draft
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger />
        <DialogContent className="max-h-[60vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview Draft Course</DialogTitle>
            <DialogDescription>
              This is how the draft course will be created.
            </DialogDescription>
          </DialogHeader>
          <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
            {JSON.stringify(draftData, null, 2)}
          </pre>
          <button
            onClick={handleCreateDraft}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Confirm & Create Draft
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DraftCourseButton;
