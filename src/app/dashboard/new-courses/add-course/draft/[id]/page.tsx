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
import { Calendar, Clock, PlayIcon } from "lucide-react";
import { BsFolderCheck } from "react-icons/bs";
import { LuRadioTower } from "react-icons/lu";
import { BiSolidCertification } from "react-icons/bi";
import HeroSection, { heroVariants } from "./_components/HeroSection";
import Navbar from "./_components/Navbar";
import MetadataForm from "./_components/MetaData";
import PriceForm from "../_components/PriceForm";
import CertificationSection from "./_components/CertificationSection";

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
      // @ts-expect-error error
      reset({
        ...res,
        banner: res?.banner?._id,
        certification: {
          ...res?.certification,
          image: res?.certification?.image?._id,
        },
        partnerShip: {
          ...res?.partnerShip,
          image: res?.partnerShip?.image?._id,
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
          onClick={() => {
            router.push("/dashboard");
          }}
          className="mb-4 absolute bg-gray-500 top-4 left-4 z-[100]"
        >
          Dashboard
        </Button>
        {preview ? (
          <>
            <Button
              onClick={() => {
                setPreview(false);
                navigate.push(
                  `/dashboard/categories/add-course/draft/${id}?preview=false`
                );
              }}
              className="mb-4 absolute top-4 right-4 z-[100]"
            >
              Switch To Editing
            </Button>

            {draftQuery.data && (
              <CourseLandingPage courseData={draftQuery.data} />
            )}
          </>
        ) : (
          <div className="p-5">
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setPreview(true);
                  navigate.push(
                    `/dashboard/categories/add-course/draft/${id}?preview=true`
                  );
                }}
              >
                Switch To Preview
              </Button>
            </div>
            {/* <Navbar activeTab={activeTab} setActiveTab={setActiveTab} /> */}
            <div className="flex justify-end items-center mt-24">
              {/* <h2>variants</h2> */}
              <div className="flex gap-x-5 ">
                <Button onClick={() => setCurrentHeader(-1)}>Default</Button>
                {heroVariants.map((variant, index) => (
                  <Button
                    key={index}
                    className={cn(
                      variant,
                      index === currentHeader && "border-2 border-white"
                    )}
                    onClick={() => {
                      setCurrentHeader(index);
                      setValue("variant", index);
                    }}
                  >
                    {index}
                  </Button>
                ))}
              </div>
            </div>
            {draftQuery?.data?._id && (
              <MetadataForm id={draftQuery?.data?._id} />
            )}
            <Card className="mt-5">
              <CardContent id="hero" className="px-0 rounded-t-md">
                <form
                  onSubmit={handleSubmit(onSubmit, (err) => {
                    console.log(err);
                    console.log(watch());
                  })}
                  className="flex flex-col gap-y-6"
                >
                  <div className="flex justify-end fixed top-20 z-[100] right-10">
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
                    watch={watch}
                    setValue={setValue}
                    formState={formState}
                    register={register}
                    key={""}
                  />

                  <section className="p-6">
                    <div className="flex gap-x-8 w-[80vw] m-auto">
                      {/* Main two sections and creations of the data  */}
                      <div className="w-8/12 border-r-4 border-blue-500 pr-5">
                        {/* overview Section */}

                        <div className="" id="overview">
                          <h2 className="text-xl font-bold">
                            {" "}
                            Overview Sections
                          </h2>
                          <div className="mt-5 flex flex-col  gap-y-5">
                            <div className="flex flex-col gap-8">
                              <Input
                                {...register("overview.title")}
                                label="Overview Title"
                                error={
                                  formState.errors.overview?.title?.message
                                }
                                placeholder="Overview Title"
                              />
                              <Textarea
                                {...register("overview.description")}
                                label="Overview Description"
                                error={
                                  formState.errors.overview?.description
                                    ?.message
                                }
                                placeholder="Overview Description"
                                className="min-h-60"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Circullum Starts */}
                        <div>
                          {/* Course Content */}
                          <div className="rounded-xl  mt-10">
                            <h3 className="text-xl font-bold mb-4">
                              Course Content
                            </h3>
                            <div className="space-y-4">
                              {watch("curriculum.chapters") &&
                                watch("curriculum.chapters")?.map((chapter) => (
                                  <div
                                    key={chapter.title}
                                    className="border-l-4 border-green-500 pl-4"
                                  >
                                    <Accordion type="single" collapsible>
                                      <AccordionItem value="item-1">
                                        <AccordionTrigger>
                                          {" "}
                                          <h4 className="font-semibold inline-flex gap-x-4">
                                            <span>
                                              <MdDelete
                                                size={20}
                                                className=""
                                                onClick={() => {
                                                  const chapters =
                                                    watch(
                                                      "curriculum.chapters"
                                                    ) || [];
                                                  setValue(
                                                    "curriculum.chapters",
                                                    chapters.filter(
                                                      (item) =>
                                                        item.title !==
                                                        chapter?.title
                                                    )
                                                  );
                                                }}
                                              />
                                            </span>
                                            {chapter.title}
                                          </h4>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                          <div className="mt-2 space-y-2">
                                            {chapter.lessons?.map((lesson) => (
                                              <div
                                                key={lesson.title}
                                                className="flex items-center space-x-2"
                                              >
                                                <PlayIcon className="h-4 w-4 text-gray-500" />
                                                <span>
                                                  {lesson.title}:{" "}
                                                  {lesson.content}
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        </AccordionContent>
                                      </AccordionItem>
                                    </Accordion>
                                  </div>
                                ))}
                            </div>
                            <hr className="my-5 mt-10 bg-blue-500" />
                            <div className="mt-5">
                              <div
                                key={"chapter"}
                                className="border-l-4 border-blue-500 pl-4"
                              >
                                <Input
                                  label="Add New Chapter"
                                  placeholder="Chapter"
                                  value={chapter}
                                  onChange={(e) => setChapter(e.target.value)}
                                />
                                <div className="pl-5 mt-5">
                                  {lessons?.map((lesson, lessonIndex) => (
                                    <div
                                      key={lesson?.title}
                                      className="flex gap-x-2"
                                    >
                                      l.{lessonIndex + 1}
                                      <div>
                                        <p>{lesson?.title}</p>
                                        <p className="text-muted-foreground">
                                          {lesson?.content}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="mt-5 flex gap-x-3">
                                    <Input
                                      label="Add New Lesson"
                                      placeholder="Lesson"
                                      value={lesson}
                                      onChange={(e) =>
                                        setLesson(e.target.value)
                                      }
                                      // className="mt-5"
                                    />
                                    <Input
                                      label="Add Content"
                                      placeholder="Content"
                                      value={lessonContent}
                                      onChange={(e) =>
                                        setLessonContent(e.target.value)
                                      }
                                      // className="mt-5"
                                    />
                                  </div>
                                  <div className="flex justify-end">
                                    <Button
                                      type="button"
                                      className="mt-4"
                                      onClick={() => {
                                        setLessons([
                                          ...lessons,
                                          {
                                            title: lesson,
                                            content: lessonContent,
                                          },
                                        ]);
                                        setLesson("");
                                        setLessonContent("");
                                      }}
                                    >
                                      Add Lesson
                                    </Button>
                                  </div>
                                  <hr className="my-5" />
                                </div>
                              </div>

                              <div className="mt-5 flex justify-end">
                                <Button
                                  type="button"
                                  className="bg-blue-500 text-white"
                                  onClick={() => {
                                    const chapters =
                                      watch("curriculum.chapters") || [];
                                    setValue("curriculum.chapters", [
                                      ...chapters,
                                      { title: chapter, lessons: [...lessons] },
                                    ]);
                                    setLessons([]);
                                    setChapter("");
                                  }}
                                >
                                  Confirm Chapter
                                </Button>
                              </div>
                            </div>
                          </div>
                          {/* Projects Content */}

                          <div className="w-full">
                            <div className=" rounded-xl  mt-5 w-full">
                              <h3 className="text-xl font-bold mb-4">
                                Projects Covered
                              </h3>
                              <>
                                <div className="gap-6 mt-6 w-full ">
                                  {watch("curriculum.projects")?.map(
                                    (field, index) => (
                                      <div
                                        key={index}
                                        className=" justify-center gap-x-1 w-full border-l-4 border-purple-500 pl-5"
                                      >
                                        <div className=" gap-x-1 w-full">
                                          <Input
                                            {...register(
                                              `curriculum.projects.${index}.title`
                                            )}
                                            label={`Projects ${index + 1}`}
                                            placeholder="Projects"
                                          />
                                          <div className=" pl-5 pt-5">
                                            {field?.content.map((f, i) => (
                                              <div
                                                key={i}
                                                className="flex items-center justify-center gap-x-1"
                                              >
                                                <Input
                                                  {...register(
                                                    `curriculum.projects.${index}.content.${i}`
                                                  )}
                                                  // label={`Project ${index + 1} ${i + 1}`}
                                                  placeholder="Enter Project Content"
                                                />
                                                <MdDelete
                                                  size={20}
                                                  onClick={() => {
                                                    const currentEligibility =
                                                      watch(
                                                        `curriculum.projects.${index}.content`
                                                      ) || [];
                                                    const updatedEligibility =
                                                      currentEligibility.filter(
                                                        (_, i1) => i1 !== i
                                                      );
                                                    setValue(
                                                      `curriculum.projects.${index}.content`,
                                                      updatedEligibility
                                                    );
                                                  }}
                                                />
                                              </div>
                                            ))}
                                            <div className="flex justify-end mt-6">
                                              <Button
                                                type="button"
                                                onClick={() => {
                                                  const currentPorjects =
                                                    watch(
                                                      `curriculum.projects.${index}.content`
                                                    ) || [];
                                                  setValue(
                                                    `curriculum.projects.${index}.content`,
                                                    [...currentPorjects, ""]
                                                  );
                                                }}
                                              >
                                                Add Content
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}

                                  <div className="flex justify-end mt-8">
                                    <Button
                                      type="button"
                                      className="bg-blue-500 text-white"
                                      onClick={() => {
                                        const projects =
                                          watch("curriculum.projects") || [];
                                        setValue("curriculum.projects", [
                                          ...projects,
                                          { title: "", content: [] },
                                        ]);
                                      }}
                                    >
                                      Add New Project
                                    </Button>
                                  </div>
                                </div>
                              </>
                            </div>
                          </div>
                          <div>
                            {/* Eligibility */}
                            <div className="flex flex-col gap-y-6 mt-10">
                              <h2 className="text-xl font-bold">Eligibility</h2>
                              <div className="flex flex-col items-center gap-y-6 mt-6 bg-purple-100 p-5">
                                {watch("curriculum.eligibility")?.map(
                                  (field, index) => (
                                    <>
                                      <div className="flex items-center justify-center gap-x-1 w-full">
                                        <Input
                                          {...register(
                                            `curriculum.eligibility.${index}`
                                          )}
                                          // label={`Eligibility ${index + 1}`}
                                          placeholder="Eligibility"
                                          value={field}
                                          className="bg-gray-100"
                                        />

                                        <button
                                          type="button"
                                          onClick={() => {
                                            const currentEligibility =
                                              watch("curriculum.eligibility") ||
                                              [];
                                            const updatedEligibility =
                                              currentEligibility.filter(
                                                (_, i) => i !== index
                                              );
                                            setValue(
                                              "curriculum.eligibility",
                                              updatedEligibility
                                            );
                                          }}
                                          className="flex flex-col items-center h-full "
                                        >
                                          <MdDelete
                                            size={20}
                                            className="text-red-500"
                                          />
                                        </button>
                                      </div>
                                    </>
                                  )
                                )}
                                <div className="w-full flex justify-end">
                                  {" "}
                                  <Button
                                    onClick={() => {
                                      setValue("curriculum.eligibility", [
                                        ...watch("curriculum.eligibility"),
                                        "",
                                      ]);
                                    }}
                                    type="button"
                                  >
                                    Add Eligibility
                                  </Button>
                                </div>
                              </div>
                              <h2 className="text-xl font-bold">
                                Prerequisites
                              </h2>
                              <div className="flex flex-col items-center gap-y-6 mt-6 bg-blue-100 p-5">
                                {watch("curriculum.prerequisites")?.map(
                                  (field, index) => (
                                    <>
                                      <div className="flex items-center justify-center gap-x-1 w-full">
                                        <Input
                                          {...register(
                                            `curriculum.prerequisites.${index}`
                                          )}
                                          label={`Prerequisites ${index + 1}`}
                                          placeholder="Prerequisites"
                                          value={field}
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const currentEligibility =
                                              watch(
                                                "curriculum.prerequisites"
                                              ) || [];
                                            const updatedEligibility =
                                              currentEligibility.filter(
                                                (_, i) => i !== index
                                              );
                                            setValue(
                                              "curriculum.prerequisites",
                                              updatedEligibility
                                            );
                                          }}
                                          className="flex flex-col items-center h-full "
                                        >
                                          <MdDelete
                                            size={20}
                                            className="text-red-500"
                                          />
                                        </button>
                                      </div>
                                    </>
                                  )
                                )}
                                <div className="w-full flex justify-end">
                                  <Button
                                    onClick={() => {
                                      setValue("curriculum.prerequisites", [
                                        ...watch("curriculum.prerequisites"),
                                        "",
                                      ]);
                                    }}
                                    type="button"
                                  >
                                    Add Pre Requisites
                                  </Button>
                                </div>
                              </div>

                              <Textarea
                                {...register("curriculum.whyJoin")}
                                label="Why Join"
                                error={
                                  formState.errors.curriculum?.whyJoin?.message
                                }
                                placeholder="Why Join"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-4/12">
                        {/* Skills */}
                        <div className="bg-blue-100 p-5 rounded-md">
                          <h2 className="font-bold pb-5">Skills</h2>
                          {!isLoading && data && (
                            <Combobox
                              frameworks={data}
                              nofound="No Skills found"
                              placeholder="Add New Skill"
                              key={"skills"}
                              setAdd={(skill) => {
                                // const newSkills = watch("skills") || [];
                                // setValue("skills", [...newSkills, skill._id]);
                                // setSkill((prev) => [...prev, skill]);
                                const currentSkillIds = watch("skills") || [];
                                // Create a Set for uniqueness
                                const skillsSet = new Set(currentSkillIds);

                                if (skillsSet.has(skill._id)) {
                                  // Optionally, display a message if the skill is already added
                                  toast.error("Skill already added");
                                  return;
                                }

                                skillsSet.add(skill._id);
                                // Update the form value with unique skill IDs
                                setValue("skills", Array.from(skillsSet));

                                // Also update the local state for skill objects
                                setSkill((prev) => [...prev, skill]);
                              }}
                            />
                          )}
                          <div className="flex flex-col gap-y-5 mt-10">
                            {skills?.map((skill, index) => (
                              <div
                                key={index}
                                className="flex gap-x-5 items-center"
                              >
                                <Image
                                  width={100}
                                  height={100}
                                  src={skill.logo.viewUrl}
                                  alt=""
                                  className="w-10 h-10  object-cover"
                                />
                                <p className="capitalize text-center">
                                  {skill?.title}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentSkills = watch("skills") || [];
                                    const updatedSkills = currentSkills.filter(
                                      (_, i) => i !== index
                                    );
                                    setValue("skills", updatedSkills);
                                    setSkill((prev) =>
                                      prev.filter((s) => s._id !== skill._id)
                                    );
                                  }}
                                >
                                  <MdDelete
                                    size={20}
                                    className="text-red-500"
                                  />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Tools */}
                        <>
                          <div className="mt-10 bg-purple-100 p-5 rounded-md">
                            <h2 className=" font-bold pb-5">Tools</h2>
                            {!isLoading1 && toolss && (
                              <Combobox
                                frameworks={toolss}
                                nofound="No Tools found"
                                placeholder="Add New Tool"
                                key={"tools"}
                                setAdd={(tool) => {
                                  const currentToolIds = watch("tools") || [];
                                  // Create a Set for uniqueness
                                  const toolsSet = new Set(currentToolIds);

                                  if (toolsSet.has(tool._id)) {
                                    // Optionally, display a message if the tool is already added
                                    toast.error("Tool already added");
                                    return;
                                  }

                                  toolsSet.add(tool._id);
                                  // Update the form value with unique tool IDs
                                  setValue("tools", Array.from(toolsSet));

                                  // Also update the local state for tool objects
                                  setTool((prev) => [...prev, tool]);
                                }}
                              />
                            )}
                            <div className="flex flex-col  gap-y-5 mt-10">
                              {tools?.map((tool, index) => (
                                <div key={tool._id} className="flex gap-x-5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentTools = watch("tools") || [];
                                      const updatedTools = currentTools.filter(
                                        (_, i) => i !== index
                                      );
                                      setValue("tools", updatedTools);
                                      setTool((prev) =>
                                        prev.filter((t) => t._id !== tool._id)
                                      );
                                    }}
                                  >
                                    <MdDelete
                                      size={20}
                                      className="text-red-500"
                                    />
                                  </button>
                                  <div className="flex items-center gap-x-5">
                                    <Image
                                      width={100}
                                      height={100}
                                      src={tool.logo.viewUrl}
                                      alt={tool.title}
                                      className="w-10 h-10 object-cover"
                                    />
                                    <p className="capitalize text-center">
                                      {tool?.title}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                        {/* Key Features */}
                        <div className="mt-10 flex flex-col gap-y-5 bg-green-100 p-5 rounded-md">
                          <div className="bg-card text-foreground  rounded-lg">
                            <h2 className=" font-bold flex gap-x-2 item-center">
                              <IoKeyOutline size={20} /> Key Features
                            </h2>
                            <div className="grid-cols-1 grid gap-5">
                              {watch("overview.keyFeatures")?.map((field) => (
                                <div key={field} className="flex items-center">
                                  <Input
                                    key={field}
                                    value={field}
                                    className="mt-4"
                                  />
                                  <MdDelete
                                    size={30}
                                    className=" cursor-pointer text-red-500"
                                    onClick={() => {
                                      const keyFeatures =
                                        watch("overview.keyFeatures") || [];
                                      setValue(
                                        "overview.keyFeatures",
                                        keyFeatures.filter(
                                          (item) => item !== field
                                        )
                                      );
                                    }}
                                  />
                                </div>
                              ))}
                              <div className="flex items-center gap-x-4">
                                <Input
                                  value={keyFeature}
                                  onChange={(e) =>
                                    setKeyFeature(e.target.value)
                                  }
                                  placeholder="Enter a key feature"
                                  className="mt-5"
                                />
                                <Button
                                  className="mt-2"
                                  type="button"
                                  onClick={() => {
                                    const keyFeatures =
                                      watch("overview.keyFeatures") || [];
                                    if (watch("overview.keyFeatures"))
                                      setValue("overview.keyFeatures", [
                                        ...keyFeatures,
                                        keyFeature,
                                      ]);
                                    setKeyFeature("");
                                  }}
                                >
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Why Join */}
                      </div>
                    </div>
                  </section>
                  <div className="space-y-4 p-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="isPaid"
                        checked={watch("isPaid")}
                        onCheckedChange={(checked) =>
                          setValue("isPaid", checked)
                        }
                      />
                      <Label htmlFor="isPaid">Paid Course</Label>
                    </div>
                    {formState.errors.isPaid && (
                      <p className="text-sm text-red-500">
                        {formState.errors.isPaid.message}
                      </p>
                    )}
                  </div>
                  <PriceForm
                    durationHours={
                      // @ts-ignore
                      watch("durationHours") ? +watch("durationHours") : 0
                    }
                    formattedPrice={
                      <Input
                        {...register("price.amount")}
                        placeholder="Enter Pirce"
                        type="number"
                        label="Price"
                      />
                    }
                  />

                  <div
                    id="faqs"
                    className="p-6 border-2 bg-gray-100 rounded-md w-[80vw] m-auto"
                  >
                    {/* Faqs */}
                    <h2 className="text-4xl font-bold">FAQS</h2>
                    <div className="p-5 rounded-md shadow-lg">
                      {watch("faqs")?.map((field, index) => (
                        <div
                          key={field.question}
                          className="mt-5 border-l-4 border-black pl-5"
                        >
                          <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                              <AccordionTrigger className="bg-card text-foreground px-3 rounded-md">
                                <div className="flex justify-between items-center">
                                  <p className="inline-flex items-center gap-x-5">
                                    {index + 1}. {field.question}
                                  </p>
                                  <MdDelete
                                    size={20}
                                    className=""
                                    onClick={() => {
                                      const faqs = watch("faqs") || [];
                                      setValue(
                                        "faqs",
                                        faqs.filter(
                                          (item) =>
                                            item.question !== field?.question
                                        )
                                      );
                                    }}
                                  />
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pl-5">
                                <Input
                                  {...register(`faqs.${index}.answer`)}
                                  label="Answer"
                                  placeholder="Answer"
                                  error={
                                    formState.errors?.faqs?.[index]?.answer
                                      ?.message
                                  }
                                />
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-col gap-y-5 pl-5">
                      <Input
                        label="Add New Question"
                        placeholder="Question"
                        value={faq?.question}
                        onChange={(e) =>
                          setfaq({ ...faq, question: e.target.value })
                        }
                      />
                      <Input
                        label="Add Answer"
                        placeholder="Answer"
                        value={faq?.answer}
                        onChange={(e) =>
                          setfaq({ ...faq, answer: e.target.value })
                        }
                      />
                      <Button
                        onClick={() => {
                          const faqs = watch("faqs") || [];
                          if (!faq?.question?.length || !faq?.answer?.length) {
                            return toast.error("Please fill all the fields");
                          }
                          setValue("faqs", [...faqs, faq]);
                          setfaq({ question: "", answer: "" });
                        }}
                      >
                        Add New Faq
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 ">
                    <div className="bg-card text-foreground rounded-lg">
                      <h2 className="font-medium"> Highlights</h2>

                      <div className="grid grid-cols-2 gap-8">
                        {watch("highlights")?.map((field, index) => (
                          <>
                            <div className="flex items-center space-x-4 w-full mt-4 border border-input  p-2 rounded-md">
                              <div className="flex gap-x-3 w-full">
                                <IoCheckmarkCircle
                                  size={20}
                                  className="text-green-500"
                                />
                                <p>{field}</p>
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                  const currentHighlights =
                                    watch("highlights") || [];
                                  const updatedHighlights =
                                    currentHighlights.filter(
                                      (_, i) => i !== index
                                    );
                                  setValue("highlights", updatedHighlights);
                                }}
                              >
                                <MdDelete size={20} />
                              </Button>
                            </div>
                          </>
                        ))}
                        <div className="flex items-center  w-full gap-x-2 border-r-4 mt-6">
                          <Input
                            value={currentHighlight}
                            placeholder="Add New Highlight"
                            onChange={(e) => {
                              setCurrentHighlight(e.target.value);
                            }}
                            className="!w-full"
                          />
                          <Button
                            type="button"
                            variant="default"
                            onClick={() => {
                              if (
                                currentHighlight === "" ||
                                currentHighlight?.length < 5
                              )
                                return toast.error(
                                  "Please enter a valid highlight"
                                );
                              // setHighlights([...highlights, currentHighlight]);
                              const highlights = watch("highlights") || [];
                              setValue("highlights", [
                                ...highlights,
                                currentHighlight,
                              ]);
                              setCurrentHighlight("");
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card text-foreground p-4 border shadow-lg border-input rounded-lg">
                    <h2 className="text-xl font-bold">
                      Why Choose this Program
                    </h2>

                    <div className="2xl:grid-cols-4 xl:grid-cols-3 grid lg:grid-cols-2 grid-cols-1 gap-4 mt-4">
                      {watch("whyJoin")?.map((field, index) => (
                        <>
                          <div className="flex flex-col  w-full  bg-card border border-input text-foreground  p-4 min-h-32 rounded-md">
                            <div className="flex items-center space-x-4 justify-end">
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                  const currentWhyJoin = watch("whyJoin") || [];
                                  const updatedWhyJoin = currentWhyJoin.filter(
                                    (_, i) => i !== index
                                  );
                                  setValue("whyJoin", updatedWhyJoin);
                                }}
                                className="w-fit"
                              >
                                <MdDelete size={20} />
                              </Button>
                            </div>
                            <div className="flex gap-x-3 w-full mt-5">
                              <p className="text-sm">{field}</p>
                            </div>
                          </div>
                        </>
                      ))}
                    </div>
                    {/* Enter Why Join us  */}
                    <div className="mt-5">
                      <Textarea
                        value={whyJoin}
                        placeholder="Add New Why Join"
                        onChange={(e) => {
                          setWhyJoin(e.target.value);
                        }}
                      />
                      <Button
                        type="button"
                        variant="default"
                        className="mt-5"
                        onClick={() => {
                          if (whyJoin === "" || whyJoin?.length < 5)
                            return toast.error(
                              "Please enter a valid why join us"
                            );
                          const whyJoin1 = watch("whyJoin") || [];
                          setValue("whyJoin", [...whyJoin1, whyJoin]);
                          setWhyJoin("");
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="bg-card text-foreground p-6 rounded-lg">
                    <h2 className="text-xl font-bold">
                      Media, Preview image & logo image
                    </h2>

                    <div className="grid grid-cols-2 gap-4  w-full mt-5">
                      <div className=" p-6 rounded-lg">
                        <h2 className="text-xl font-bold inline-flex items-center gap-x-3">
                          <ImYoutube className="text-red-600" /> Youtube Video
                          Preview
                        </h2>
                        <div className="max-w-3xl mx-auto p-4">
                          {watch("videoUrl") && (
                            <iframe
                              className="w-full aspect-video mt-4"
                              src={
                                watch("videoUrl")
                                  ? // @ts-expect-error TODO
                                    getYouTubeEmbedUrl(watch("videoUrl"))
                                  : ""
                              }
                              allowFullScreen
                            />
                          )}
                        </div>
                        <Input
                          {...register("videoUrl")}
                          label="Video URL"
                          placeholder="Video URL"
                        />
                      </div>

                      <div className="w-full min-h-40">
                        <FileUploader
                          label="Course Logo"
                          title="Course Logo"
                          purpose="course-logo"
                          setFileId={(fileId) =>
                            setValue("logoUrl", fileId as string)
                          }
                          id={watch("logoUrl")}
                          setUrl={(url) => setLogoUrl(url as string)}
                          url={logoUrl}
                        />
                      </div>

                      <div className="w-full min-h-20">
                        <FileUploader
                          label="Preview Image"
                          purpose="course-preview"
                          title="Preview Image"
                          setFileId={(fileId) =>
                            setValue("previewImage", fileId as string)
                          }
                          id={watch("previewImage")}
                          setUrl={(url) => setPreviewImage(url as string)}
                          url={previewImage}
                        />
                      </div>
                    </div>
                  </div>
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
