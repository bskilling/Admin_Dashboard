/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImYoutube } from "react-icons/im";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/global/FileUploader";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import axios from "axios";
import env from "@/lib/env";
import { Suspense, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { draftCourseSchema } from "../../-components/validators";
import { IoCheckmarkCircle, IoKeyOutline } from "react-icons/io5";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import CourseLandingPage from "./-components/Course-Preview";
import { Link } from "react-scroll";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/global/combox";
// import { ICourse } from "./-components/types";
import { useSkills } from "@/lib/hooks/useSkills";
import { TTool, useTools } from "@/lib/hooks/useTools";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { draftCourseSchema } from "../../../_components/validators";
import { ICourse } from "../_components/types";
import CourseLandingPage from "../_components/Course-Preview";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowLeftCircle,
  Calendar,
  Clock,
  PlayIcon,
} from "lucide-react";
import { BsFolderCheck } from "react-icons/bs";
import { LuRadioTower } from "react-icons/lu";
import { BiSolidCertification } from "react-icons/bi";
// @ts-ignore
import HeroSection, { heroVariants } from "./_components/HeroSection";
import Navbar from "./_components/Navbar";
import MetadataForm from "./_components/MetaData";
import PriceForm from "../_components/PriceForm";
import CertificationSection from "./_components/CertificationSection";
import FaqSection from "./_components/FaqSection";
import MediaUploadSection from "./_components/MediaUplodationSection";
import HighlightsSection from "./_components/highlights";
import OutcomesSection from "./_components/Outcomes";
import CourseModuleSection from "./_components/CourseModuleSection";
import ProjectsCoveredSection from "./_components/ProjectsSection";
import EligibilitySection from "./_components/Eligibility";
import PrerequisitesSection from "./_components/Prerequisites";
import SkillsSection from "./_components/SkillsSection";
import ToolsSection from "./_components/ToolsSection";
import KeyFeaturesSection from "./_components/KeyFeaturesSection";
import { FiBookOpen } from "react-icons/fi";
import CoursePricing from "./_components/Pricing";
import WhyChooseProgram from "./_components/ChooseUs";

export type TDraftCourseForm = z.infer<typeof draftCourseSchema>;

export interface IChapterLesson {
  title: string;
  content: string;
}

// const heroVariants = [
//   "bg-gradient-to-r from-[#FF5F6D] via-[#FFC371] to-[#FF7E5F]", // Sunset Glow
//   "bg-gradient-to-r from-[#2E3192] via-[#1BFFFF] to-[#00A3E1]", // Ocean Breeze
//   "bg-gradient-to-r from-[#11998E] via-[#38EF7D] to-[#0575E6]", // cosmic teal
//   "bg-gradient-to-r from-[#11998E] via-[#38EF7D] to-[#1E9600]", // Forest Vibes
//   "bg-gradient-to-r from-[#41295A] via-[#2F0743] to-[#753A88]", // Midnight Purple
// ];
export default function RouteComponent() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { data, isLoading } = useSkills();
  const { data: toolss, isLoading: isLoading1 } = useTools();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";
  const [preview, setPreview] = useState<boolean>(isPreview ?? false);
  const navigate = useRouter();
  const [currentHeader, setCurrentHeader] = useState(-1);

  const { register, handleSubmit, formState, setValue, watch, reset } =
    useForm<TDraftCourseForm>({
      resolver: zodResolver(draftCourseSchema),
      defaultValues: {
        isPaid: false,
        isPublished: false,
        appliedCount: 0,
        trainedCount: 0,
        highlights: [],
        images: [],
      },
    });

  const [currentHighlight, setCurrentHighlight] = useState("");
  // const [skills, setSkills] = useState<string[]>([]);
  const [skills, setSkill] = useState<TTool[]>([]);
  const [tools, setTool] = useState<TTool[]>([]);

  const [partnerShip, setPartnerShip] = useState<string>("");
  const router = useRouter();
  const [bannerUrl, setBannerUrl] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [whyJoin, setWhyJoin] = useState("");
  const [keyFeature, setKeyFeature] = useState("");
  const [chapter, setChapter] = useState("");
  const [lesson, setLesson] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessons, setLessons] = useState<IChapterLesson[]>([]);
  const [faq, setfaq] = useState({
    question: "",
    answer: "",
  });
  const [activeTab, setActiveTab] = useState("home");

  const draftQuery = useQuery<ICourse>({
    queryKey: ["course-draft", id],
    queryFn: async () => {
      const res = await axios.get(env.BACKEND_URL + `/api/courses/draft/${id}`);
      reset({
        ...res.data.data,
        category: res.data.data?.category?._id,
        banner: res.data.data?.banner?._id,
        previewImage: res.data.data?.previewImage?._id,
        logoUrl: res.data.data?.logoUrl?._id,
        skills: res.data.data?.skills?.map(
          (skill: ICourse["skills"][number]) => skill._id
        ),
        tools: res.data.data?.tools?.map(
          (tool: ICourse["tools"][number]) => tool._id
        ),
      });

      const data = res.data.data as ICourse;
      // setSkills(data?.skills);
      setSkill(data?.skills);
      setTool(data?.tools);
      setBannerUrl(data?.banner?.viewUrl);
      setPreviewImage(data?.previewImage?.viewUrl);
      setLogoUrl(data?.logoUrl?.viewUrl);

      return res.data.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });

  const createDraftMutation = useMutation({
    mutationFn: async (data: TDraftCourseForm) => {
      const res = await axios.put(
        env.BACKEND_URL + "/api/courses/draft" + `/${id}`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Draft course created successfully");
      // Handle additional success logic
      queryClient.invalidateQueries({
        queryKey: ["course-draft", id],
      });
    },
    onError: (error) => {
      toast.error("Failed to create draft: " + error.message);
    },
  });

  const publishCourse = useMutation({
    mutationFn: async (data: TDraftCourseForm) => {
      const res = await axios.put(
        env.BACKEND_URL + "/api/courses" + `/${id}` + "/publish",
        data
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Published course created successfully");
      // Handle additional success logic
    },
    onError: (error) => {
      toast.error("Failed to create draft: " + error.message);
    },
  });

  useEffect(() => {
    console.log("redndering in useffecti");
    if (draftQuery.data && !preview) {
      const res = draftQuery.data as ICourse;
      // @ts-expect-error
      reset({
        ...res,
        category: res?.category?._id,
        banner: res?.banner?._id,
        certification: {
          title: res?.certification?.title,
        },
        partnerShip: {
          title: res?.partnerShip?.title,
        },
        previewImage: res?.previewImage?._id,
        logoUrl: res?.logoUrl?._id,
        skills: res?.skills?.map(
          (skill: ICourse["skills"][number]) => skill._id
        ),
        tools: res?.tools?.map((tool: ICourse["tools"][number]) => tool._id),
      });

      const data = res as ICourse;
      // setSkills(data?.skills);
      setSkill(data?.skills);
      setTool(data?.tools);
      setBannerUrl(data?.banner?.viewUrl);
      setPreviewImage(data?.previewImage?.viewUrl);
      setLogoUrl(data?.logoUrl?.viewUrl);
    }
  }, [preview]);
  console.log("redndering in Normakly");
  const onSubmit = (data: TDraftCourseForm) => {
    createDraftMutation.mutate(data);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  if (draftQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <>
        <Button
          onClick={() => router.back()}
          aria-label="Go back"
          className="fixed top-6 left-6 z-[100] flex items-center gap-3 text-lg font-bold
                 bg-gradient-to-r from-[#FF512F] to-[#DD2476] text-white 
                 px-6 py-3 rounded-full shadow-xl 
                 hover:scale-105 hover:shadow-2xl hover:brightness-110
                 transition-all duration-300"
        >
          <ArrowLeftCircle className="w-7 h-7 text-white drop-shadow-md animate-pulse" />
          Back
        </Button>
        {preview ? (
          <>
            <Button
              onClick={() => {
                setPreview(false);
                navigate.push(
                  `/categories/add-course/draft/${id}?preview=false`
                );
              }}
              className="mb-4 fixed top-4 right-4 z-[9999]"
            >
              Switch To Editing
            </Button>

            {draftQuery.data && (
              <CourseLandingPage courseData={draftQuery.data} />
            )}
          </>
        ) : (
          <div className="p-5">
            <div className="flex justify-end fixed top-5 right-5 z-[999]">
              <Button
                onClick={() => {
                  setPreview(true);
                  navigate.push(
                    `/categories/add-course/draft/${id}?preview=true`
                  );
                }}
              >
                Switch To Preview
              </Button>
            </div>

            {draftQuery?.data?._id && (
              <MetadataForm id={draftQuery?.data?._id} />
            )}
            <Card className="mt-20">
              <CardContent id="hero" className="px-0 rounded-t-md">
                <form
                  onSubmit={handleSubmit(onSubmit, (err) => {
                    console.log(err);
                    console.log(watch());
                  })}
                  className="flex flex-col gap-y-6"
                >
                  <div className="flex justify-end fixed top-5 z-[100] right-60">
                    <Button
                      type="submit"
                      className="bg-blue-500"
                      disabled={createDraftMutation.isPending}
                    >
                      Save as Draft
                    </Button>
                  </div>
                  <HeroSection
                    watch={watch}
                    bannerUrl={bannerUrl}
                    setValue={setValue}
                    formState={formState}
                    register={register}
                    setBannerUrl={setBannerUrl}
                    variants={currentHeader}
                    key={""}
                  />
                  <CertificationSection
                    // watch={watch}
                    // setValue={setValue}
                    // formState={formState}
                    register={register}
                    // key={""}
                  />
                  <section className="p-10 bg-gray-50">
                    <div className="flex gap-x-10 w-[80vw] mx-auto">
                      {/* Left Section */}
                      <div className="w-8/12 border-r-4  pr-10">
                        {/* Overview */}
                        <div
                          id="overview"
                          className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 backdrop-blur-lg"
                        >
                          {/* Heading with Icon */}
                          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                            <FiBookOpen className="text-blue-500 text-3xl" />{" "}
                            Overview
                          </h2>

                          {/* Form Inputs */}
                          <div className="mt-6 space-y-6">
                            {/* Title Input */}
                            <div className="flex flex-col">
                              <label className="text-sm font-medium text-gray-700">
                                Overview Title
                              </label>
                              <Input
                                {...register("overview.title")}
                                error={
                                  formState.errors.overview?.title?.message
                                }
                                placeholder="Enter a captivating title..."
                                className="mt-2 p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
                              />
                            </div>

                            {/* Description Textarea */}
                            <div className="flex flex-col">
                              <label className="text-sm font-medium text-gray-700">
                                Overview Description
                              </label>
                              <Textarea
                                {...register("overview.description")}
                                error={
                                  formState.errors.overview?.description
                                    ?.message
                                }
                                placeholder="Write a brief and engaging overview..."
                                className="mt-2 p-3 min-h-40 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Course Sections */}
                        <div className="mt-10 space-y-8">
                          <CourseModuleSection
                            watch={watch}
                            setValue={setValue}
                          />
                          <HighlightsSection
                            watch={watch}
                            setValue={setValue}
                          />
                          <OutcomesSection watch={watch} setValue={setValue} />
                          <ProjectsCoveredSection
                            watch={watch}
                            setValue={setValue}
                            register={register}
                          />
                          <EligibilitySection
                            register={register}
                            setValue={setValue}
                            watch={watch}
                          />
                          <PrerequisitesSection
                            register={register}
                            setValue={setValue}
                            watch={watch}
                          />
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="w-4/12 space-y-8">
                        <SkillsSection
                          watch={watch}
                          setValue={setValue}
                          skills={skills}
                          setSkill={setSkill}
                          isLoading={isLoading}
                          data={data}
                        />

                        <ToolsSection
                          watch={watch}
                          setValue={setValue}
                          tools={tools}
                          setTool={setTool}
                          isLoading={isLoading1}
                          data={toolss}
                        />

                        <KeyFeaturesSection
                          watch={watch}
                          setValue={setValue}
                          keyFeature={keyFeature}
                          setKeyFeature={setKeyFeature}
                        />
                      </div>
                    </div>
                  </section>

                  <CoursePricing
                    watch={watch}
                    setValue={setValue}
                    register={register}
                    formState={formState}
                  />

                  <FaqSection
                    register={register}
                    watch={watch}
                    setValue={setValue}
                  />

                  <WhyChooseProgram watch={watch} setValue={setValue} />
                  <MediaUploadSection
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    setLogoUrl={setLogoUrl}
                    setPreviewImage={setPreviewImage}
                    logoUrl={logoUrl}
                    previewImage={previewImage}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={createDraftMutation.isPending}
                      className="bg-gradient-to-tr from-[#8E2DE2] to-[#4A00E0]"
                    >
                      Save as Draft
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            <Button
              type="submit"
              disabled={publishCourse.isPending}
              onClick={() => {
                publishCourse.mutate(watch());
              }}
              className="bg-gradient-to-tr from-[#8E2DE2] to-[#4A00E0]"
            >
              Publish Course
            </Button>
          </div>
        )}
      </>
    </Suspense>
  );
}
