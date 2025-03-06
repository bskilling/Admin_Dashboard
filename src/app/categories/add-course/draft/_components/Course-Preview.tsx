/* eslint-disable @next/next/no-img-element */
"use client";
import { format } from "date-fns";
import { Link } from "react-scroll";
import {
  PlayIcon,
  CheckIcon,
  BookOpenIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  ShieldCheckIcon,
  UserPlus,
  Users,
} from "lucide-react";
import { IoIosCheckbox, IoIosCheckmarkCircle } from "react-icons/io";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ICourse } from "./types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BsFillBookmarkCheckFill, BsFolderCheck } from "react-icons/bs";
import { CreditCardIcon, ClockIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { LuRadioTower } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { BiSolidCertification } from "react-icons/bi";
// import ContactForm from "./ContactForm";
// @ts-ignore
import { heroVariants } from "../[id]/_components/HeroSection";
import { HeroSection } from "./HeroSection";
import CourseDetails from "./Certificate";
import CourseContent from "@/app/_components/CourseContent";
import CourseOverview from "./CourseOverview";
import Highlights from "./Highlights";
import Outcomes from "./Outcomes";
import CourseEnrollment from "./Price";
import FAQSection from "./faqs";
import WhyJoinSection from "./Whychoose";
import Footer from "./Footer";
// Adjust this type as needed.
export interface TDraftCourseForm {
  _id: string;
  title: string;
  description: string;
  isPaid: boolean;
  appliedCount: number;
  trainedCount: number;
  price: number;
  videoUrl?: string;
  banner?: { _id: string; viewUrl: string } | null;
  previewImage?: { _id: string; viewUrl: string } | null;
  logoUrl?: { _id: string; viewUrl: string } | null;
  durationHours: number;
  startTime: string;
  endTime?: string;
  faqs?: { question: string; answer: string }[];
  category?: string;
  highlights?: string[];
  images?: string[];
  certification?: {
    image: {
      _id: string;
      viewUrl: string;
    };
    title: string;
    content: string;
  };
  partnership: {
    image: {
      _id: string;
      viewUrl: string;
    };
    title: string;
    content: string;
  };
  overview?: {
    title: string;
    description: string;
    keyFeatures?: string[];
    skillsCovered?: string[];
  };
  curriculum?: {
    eligibility?: string;
    prerequisites?: string;
    chapters?: {
      title: string;
      lessons?: {
        title: string;
        content: string;
        _id: string;
      }[];
      _id: string;
    }[];
  };
  whyJoin?: string[];
  skills?: string[];
  slug?: string;
  isPublished: boolean;
}

const CourseLandingPage = ({ courseData }: { courseData: ICourse }) => {
  const {
    title,
    description,
    category,
    highlights,
    skills,
    curriculum,
    whyJoin,
    price,
    videoUrl,
    banner,
    durationHours,
    startTime,
    endTime,
    trainedCount,
    appliedCount,
    faqs,
    images,
    overview,
    tools,
    partnerShip,
    certification,
    outcomes,
    variant,
    // logoUrl, previewImage, slug not used in this single-page layout
  } = courseData;

  const [activeTab, setActiveTab] = useState("home");

  // Use a default banner image if not provided.
  const bannerImage =
    banner?.viewUrl ||
    "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";
  const placeholder =
    "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";

  // Format price (assuming price is in cents)
  const formattedPrice = price ? price?.amount?.toFixed(2) : "Free";
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return (
    <div className="min-h-screen  ">
      {/* Navigation */}
      <nav className="fixed w-full bg-white shadow-sm z-50 top-0">
        <div className="w-full 2xl:w-[80vw] md:[90vw]  mx-auto px-4 sm:px-3 lg:px-4">
          <div className="flex justify-between h-16">
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="hero"
                spy={true}
                smooth={true}
                onClick={() => {
                  setActiveTab("home");
                }}
                className={cn(
                  "cursor-pointer text-gray-600 hover:text-blue-600",
                  activeTab === "home" &&
                    "text-blue-500 font-bold border-b border-blue-500"
                )}
              >
                Home
              </Link>
              <Link
                to="overview"
                smooth={true}
                onClick={() => {
                  setActiveTab("overview");
                }}
                className={cn(
                  "cursor-pointer text-gray-600 hover:text-blue-600",
                  activeTab === "overview" && "text-blue-600 font-bold"
                )}
              >
                Overview
              </Link>
              <Link
                to="curriculum"
                smooth={true}
                onClick={() => {
                  setActiveTab("curriculum");
                }}
                className={cn(
                  "cursor-pointer text-gray-600 hover:text-blue-600",
                  activeTab === "curriculum" && "text-blue-600 font-bold"
                )}
              >
                Curriculum
              </Link>
              {skills && skills.length > 0 && (
                <Link
                  to="skills"
                  smooth={true}
                  className={cn(
                    "cursor-pointer text-gray-600 hover:text-blue-600",
                    activeTab === "skills" && "text-blue-600 font-bold"
                  )}
                  onClick={() => {
                    setActiveTab("skills");
                  }}
                >
                  Skills
                </Link>
              )}
              <Link
                to="why-join"
                smooth={true}
                onClick={() => {
                  setActiveTab("why-join");
                }}
                className={cn(
                  "cursor-pointer text-gray-600 hover:text-blue-600",
                  activeTab === "why-join" && "text-blue-600 font-bold"
                )}
              >
                Why Join
              </Link>
              <Link
                to="faqs"
                spy={true}
                onClick={() => {
                  setActiveTab("faqs");
                }}
                smooth={true}
                className={cn(
                  "cursor-pointer text-gray-600 hover:text-blue-600",
                  activeTab === "faqs" && "text-blue-600 font-bold"
                )}
              >
                FAQs
              </Link>
              <Link
                to="pricing"
                smooth={true}
                onClick={() => {
                  setActiveTab("pricing");
                }}
                className={cn(
                  "cursor-pointer text-gray-600 hover:text-blue-600",
                  activeTab === "pricing" && "text-blue-600 font-bold"
                )}
              >
                Pricing
              </Link>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Azure AI</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection
        category={category}
        title={title}
        description={description}
        bannerImage={bannerImage}
      />

      <CourseDetails
        durationHours={durationHours}
        enrolledStudents={1000}
        certification={certification}
      />

      <section className="   -mt-56  m-auto flex ">
        <section className="flex  w-[90vw]  pl-[10vw] pt-60 pb-10">
          <div className=" w-full">
            <h2 className="text-3xl font-bold mt-10">Course Overview</h2>
            {overview && (
              <section id="overview" className="mt-5">
                <h2 className="font-semibold  ">{overview.title}</h2>
                <p className=" mb-3">{overview.description}</p>{" "}
              </section>
            )}

            {/* Chapters */}

            <div className="rounded-xl  mt-10">
              <h3 className="text-xl font-bold mb-4">Course Modules</h3>
              <div className="space-y-4">
                {curriculum.chapters?.map((chapter) => (
                  <div
                    key={chapter._id}
                    className="border-l-4 border-green-500 pl-4"
                  >
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          {" "}
                          <h4 className="font-semibold">{chapter.title}</h4>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="mt-2 space-y-2">
                            {chapter.lessons?.map((lesson) => (
                              <div
                                key={lesson._id}
                                className="flex items-center space-x-2"
                              >
                                <PlayIcon className="h-4 w-4 text-gray-500" />
                                <span>
                                  {lesson.title}: {lesson.content}
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
            </div>
            <Highlights highlights={highlights || []} />
            <Outcomes outcomes={outcomes || []} />

            {category?.type !== "b2i" && (
              <div className=" rounded-xl  mt-10">
                <h3 className="text-xl font-bold mb-4">Projects Covered</h3>
                <div className="space-y-4">
                  {curriculum.projects?.map((project) => (
                    <div
                      key={project._id}
                      className="border-l-4 border-purple-500 pl-4"
                    >
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger>
                            {" "}
                            <h4 className="font-semibold capitalize">
                              {project.title}
                            </h4>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="mt-2 space-y-2">
                              {project.content?.map((lesson: string) => (
                                <div
                                  key={lesson}
                                  className="flex items-center space-x-2"
                                >
                                  {/* <PlayIcon className="h-4 w-4 text-gray-500" /> */}
                                  <BsFolderCheck className="h-4 w-4 text-purple-500" />
                                  <span>{lesson}</span>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* prerequists */}

            {category?.type !== "b2i" && (
              <section className="mt-10">
                <h3 className="text-xl font-bold mb-4">Creteria</h3>
                <section className=" flex flex-col gap-y-5  ">
                  <div className="w-full">
                    {curriculum.prerequisites && (
                      <div className="bg-blue-50 p-4 rounded-lg flex flex-col">
                        <h4 className="font-semibold mb-2">Prerequisites</h4>
                        {/* <p>{curriculum.prerequisites}</p> */}
                        {curriculum.prerequisites.map((prerequisite, index) => (
                          <p key={index} className="mt-5 inline-flex gap-x-4">
                            {" "}
                            <IoIosCheckmarkCircle className="w-6 h-6 text-blue-500" />{" "}
                            <span className="text-sm font-semibold">
                              {prerequisite}
                            </span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    {curriculum.eligibility && (
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Eligibility</h4>
                        {/* <p>{curriculum.eligibility}</p> */}
                        <div className="flex flex-col ">
                          {curriculum.eligibility.map((eligibility, index) => (
                            <p
                              key={index}
                              className="mt-5 inline-flex gap-x-4 items-center"
                            >
                              <IoIosCheckmarkCircle className="w-6 h-6 text-purple-500" />{" "}
                              <span className="text-sm font-semibold">
                                {eligibility}
                              </span>
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </section>
            )}
          </div>
        </section>
        <section className="bg-card w-[50vw]  pt-60 pb-10 pl-10 flex flex-col">
          <div className="hidden lg:flex flex-col gap-6 w-80  top-10">
            {/* Inquiry Form */}
            <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Quick Inquiry
              </h3>
              <p className="text-gray-600 text-sm">
                Want more details? Fill in your info and we’ll get in touch!
              </p>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button className="bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
                Submit Inquiry
              </button>
            </div>

            {/* Key Highlights */}
            <div className="bg-gradient-to-b from-purple-600 to-purple-800 text-white shadow-lg rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="text-xl font-semibold">
                Why Choose This Program?
              </h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Hands-on projects with real-world applications.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Training in modern tools & emerging technologies.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Industry-relevant curriculum aligned with market trends.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Personalized mentorship and career guidance.
                </li>
              </ul>
            </div>

            {/* Call-to-Action Box */}
            <div className="bg-purple-100 text-purple-900 shadow-lg rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold">🚀 Ready to Upskill?</h3>
              <p className="text-sm mt-2">
                Take the first step towards a brighter future with our
                cutting-edge program.
              </p>
              <button className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition">
                Apply Now
              </button>
            </div>
          </div>
          <div className="mt-6">
            <div>
              <p className="mt-10 text-xl font-semibold">Skills Covered</p>
              <div className="flex flex-col gap-y-5 mt-5">
                {skills && skills.length > 0 && (
                  <>
                    {skills.map((skill, index) => (
                      <div key={index} className="flex gap-x-3">
                        <Image
                          width={100}
                          height={100}
                          src={skill?.logo?.viewUrl}
                          alt={skill?.title}
                          className="w-6 h-6 object-cover rounded-full"
                        />
                        <p key={index}>{skill?.title}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            <div className="mt-5">
              <p className="mt-10 text-xl font-semibold">Tools Covered</p>
              <div className="flex flex-col gap-y-5 mt-5">
                {tools.map((tool, index) => (
                  <div key={index} className="flex gap-x-3">
                    <Image
                      width={100}
                      height={100}
                      src={tool?.logo?.viewUrl}
                      alt={tool?.title}
                      className="w-6 h-6 object-cover rounded-full"
                    />
                    <p key={index}>{tool?.title}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <h2 className="mt-10 text-xl font-semibold">Key Features</h2>
              {overview.keyFeatures && overview.keyFeatures.length > 0 && (
                <div className="flex flex-col gap-y-5 mt-5">
                  {overview.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-x-2">
                      <IoIosCheckmarkCircle className="w-6 h-6 text-blue-500" />
                      <p>{feature}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </section>
      <CourseEnrollment
        formattedPrice={formattedPrice}
        durationHours={durationHours}
      />

      {/* Overview Section */}
      <FAQSection faqs={faqs} />
      <WhyJoinSection whyJoin={whyJoin} />
      <Footer />
    </div>
  );
};

export default CourseLandingPage;

interface DetailCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const DetailCard: React.FC<DetailCardProps> = ({ icon, title, value }) => {
  return (
    <div className="flex items-center bg-gradient-to-r from-indigo-500 to-purple-500 p-1 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
      <div className="flex flex-1 bg-white p-4 rounded-xl items-center">
        <div className="p-2 bg-indigo-50 rounded-full">{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-semibold text-gray-600">{title}</p>
          <p className="text-lg font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};
