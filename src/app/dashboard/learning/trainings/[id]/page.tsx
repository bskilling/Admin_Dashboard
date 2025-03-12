"use client";
import Link from "next/link";
import React, { useState } from "react";
import { BiPencil, BiLogOut, BiTrash } from "react-icons/bi";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useLogOutQuery } from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";
import {
  useDeleteCourseMutation,
  useGetCourseByIdQuery,
} from "@/redux/features/courses/coursesApi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import CourseEditModal from "@/app/_components/CourseEditModal";
import Image from "next/image";
// import loginBg from "../../../../public/assets/loginBg.png";
import { formatToStringDate } from "@/utils/formatter";

const Header = ({ courseId, setEditModal }: any) => {
  const router = useRouter();
  const [logout, setLogout] = useState(false);
  const {} = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  });

  const [deleteCourse, { isSuccess, error }] = useDeleteCourseMutation({});

  const logOutHandler = async () => {
    setLogout(true);
    router.push("/");
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "Are You Sure?",
      text: "Are you sure to delete this course!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result: any) => {
      if (result.isConfirmed) {
        handleDeleteConfirm();
      }
    });
  };

  const handleDeleteConfirm = async () => {
    const id = courseId;
    try {
      const deletedCourseData = await deleteCourse(id);

      if ("data" in deletedCourseData && deletedCourseData.data.success) {
        toast.success("Course has been deleted.");
        router.push("/dashboard/learning/trainings");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the course.");
      console.error("Error deleting course:", error);
    }
  };

  return (
    <header className="bg-transparent w-[95%] h-[80px] flex justify-between items-center mx-auto container">
      <Link
        href={"/learning/trainings"}
        className="container flex gap-2 text-lg items-center text-sky-900 font-[600]"
      >
        <FaArrowLeftLong />
        Back To Training List
      </Link>
      <div className="flex gap-2">
        <button
          className="p-3 bg-sky-900 rounded-md"
          onClick={() => setEditModal(true)}
        >
          <BiPencil size={20} color="white" />
        </button>

        <button
          className="p-3 bg-sky-900 rounded-md"
          onClick={() => handleDelete()}
        >
          <BiTrash size={20} color="white" />
        </button>

        <button
          className="p-3 bg-sky-900 rounded-md"
          onClick={() => logOutHandler()}
        >
          <BiLogOut size={20} color="white" />
        </button>
      </div>
    </header>
  );
};

const RenderData = ({ title, data }: any) => {
  return (
    <div className="flex flex-col gap-2 mb-6">
      <label className="font-[600] text-sky-800">{title}</label>
      <div className="w-full bg-white border-2 border-gray-800 rounded-md px-6 py-3">
        {data?.map((obj: any, index: number) => {
          return (
            <ul key={obj} className="list-disc leading-8 text-sm">
              <li>{obj.title}</li>
            </ul>
          );
        })}
      </div>
    </div>
  );
};

const Page = ({ params }: any) => {
  const [sectionActive, setSectionActive] = useState(0);

  const { isLoading, data, refetch } = useGetCourseByIdQuery(params.id);
  const [editModal, setEditModal] = useState(false);

  return (
    <>
      <div className="w-full h-full pb-6 bg-main-bg-img bg-no-repeat bg-cover">
        <div className="mx-auto container">
          <div className="fixed top-0 left-0 right-0 z-50 bg-main-bg-img bg-no-repeat bg-cover">
            <div className="flex items-center h-[80px]">
              <Header courseId={params.id} setEditModal={setEditModal} />
            </div>
            <div className="flex border-b-2 border-gray-500 mt-10 gap-6 px-8 mx-auto container md:w-[95%]">
              <span
                className={`text-gray-400 font-[600] h-full cursor-pointer pb-6 ${
                  sectionActive === 0 &&
                  "text-sky-800 border-b-4 border-sky-800"
                }`}
                onClick={() => setSectionActive(0)}
              >
                Training Details
              </span>
              <span
                className={`text-gray-400 font-[600] h-full cursor-pointer pb-6 ${
                  sectionActive === 1 &&
                  "text-sky-800 border-b-4 border-sky-800"
                }`}
                onClick={() => setSectionActive(1)}
              >
                Training Metadata
              </span>
            </div>
          </div>
          <div className="pt-44">
            {sectionActive === 0 && (
              <div className="px-8 mt-8">
                <div className="w-full border-1 border-gray-800 rounded-md flex mb-4">
                  <div className="p-4 flex bg-white flex-col gap-4 justify-start w-[50%]">
                    <table className="text-sm my-3">
                      <tbody>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Name
                          </td>
                          <td className="px-2 py-2">{data?.course?.title}</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Category
                          </td>
                          <td className="px-2 py-2">
                            {data?.course?.category}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Assessment Required
                          </td>
                          <td className="px-2 py-2">
                            {data?.course?.assessment_required}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Duration
                          </td>
                          <td className="px-2 py-2">
                            {data?.course?.duration}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Level
                          </td>
                          <td className="px-2 py-2">{data?.course?.level}</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Language
                          </td>
                          <td className="px-2 py-2">
                            {data?.course?.language}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Created Date
                          </td>
                          <td className="px-2 py-2">
                            {formatToStringDate(data?.course?.createdAt)}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Training Status
                          </td>
                          <td className="px-2 py-2">
                            {/* {data?.course?.training_status} */}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Description
                          </td>
                          <td className="px-2 py-2">
                            {data?.course?.description || "NA"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 flex flex-col bg-white gap-4 justify-start flex-1">
                    <table className="text-sm my-3">
                      <tbody>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Owned By
                          </td>
                          <td className="px-2 py-2">bSkilling</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Endorsed By
                          </td>
                          <td className="px-2 py-2">bSkilling</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Assessment
                          </td>
                          <td className="px-2 py-2">
                            {data?.course?.assessment}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Price
                          </td>
                          <td className="px-2 py-2">{data?.course?.price}</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Currency
                          </td>
                          <td className="px-2 py-2">
                            {data?.course?.currency}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Discount
                          </td>
                          <td className="px-2 py-2">
                            {data?.course?.discount}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Created By
                          </td>
                          <td className="px-2 py-2">{"Learning Admin"}</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Complted At
                          </td>
                          <td className="px-2 py-2">{""}</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Url
                          </td>
                          <td className="px-2 py-2">{data?.course?.url}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="w-full border-1 border-gray-800 rounded-md flex flex-col">
                  <span
                    className={`text-sky-800 font-[600] h-full cursor-pointer pb-6`}
                  >
                    Training Batches
                  </span>
                  <div className="p-4 flex bg-white gap-4 justify-start">
                    <table className="text-sm my-3">
                      <tbody>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Batch Name
                          </td>
                          <td className="px-2 py-2">
                            {data?.course?.training_batches?.batch_name}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            is Paid
                          </td>
                          <td className="px-2 py-2">
                            {data?.course?.training_batches?.isPaid
                              ? "Yes"
                              : "No"}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Trainer
                          </td>
                          <td className="px-2 py-2">
                            {data?.course?.training_batches?.trainer}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Start Time
                          </td>
                          <td className="px-2 py-2">
                            {formatToStringDate(
                              data?.course?.training_batches?.start_time
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Enrollment End Date
                          </td>
                          <td className="px-2 py-2">
                            {formatToStringDate(
                              data?.course?.training_batches
                                ?.enrollment_end_date
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            End Date
                          </td>
                          <td className="px-2 py-2">
                            {formatToStringDate(
                              data?.course?.training_batches?.end_date
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-gray-500 font-semibold">
                            Description
                          </td>
                          <td className="px-2 py-2">
                            {data?.course?.training_batches?.description}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {sectionActive === 1 && (
              <div className="px-8 mt-8 overflow-auto">
                <div className="flex flex-col gap-2 mb-6">
                  <label className="font-[600] text-sky-800">Headline</label>
                  <input
                    className="w-full bg-white border-2 border-gray-800 rounded-md px-2 py-3 flex justify-start items-center "
                    value={data?.course?.training_metadata?.headline || ""}
                    readOnly
                    disabled
                  />
                </div>

                <div className="flex flex-col gap-2 mb-6">
                  <label className="font-[600] text-sky-800">Body</label>
                  <div className="w-full bg-white border-2 border-gray-800 rounded-md px-2 py-3">
                    {data?.course?.training_metadata?.body || ""}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-6">
                  <label className="font-[600] text-sky-800">Overview</label>
                  <div className="w-full bg-white border-2 border-gray-800 rounded-md px-2 py-3">
                    {data?.course?.training_metadata?.overview}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-6">
                  <div className="px-2 py-3 grid grid-cols-4">
                    <div className="col-span-3 flex flex-col gap-2 pr-2">
                      <label className="font-[600] text-sky-800">
                        Preview Video
                      </label>
                      <div className="rounded-lg bg-white border bg-card text-card-foreground shadow-sm p-4 items-center flex justify-center">
                        <iframe
                          width="740"
                          height="416"
                          src={
                            data?.course?.training_metadata?.preview_video || ""
                          }
                          title="Valentines Day Special - Jukebox | Video Song Jukebox | Odia Love Songs |Valentines Day 2023 Jukebox"
                          frameBorder={0}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                    <div className="col-span-1 flex flex-col gap-2 pl-2">
                      <label className="font-[600] text-sky-800">
                        Preview Image
                      </label>
                      <div className="rounded-md bg-white border bg-card text-card-foreground shadow-sm p-4 items-center flex justify-center h-full">
                        <Image
                          src={
                            data?.course?.preview_image_uri ??
                            "/assets/loginBg.png"
                          }
                          width={280}
                          height={280}
                          alt="preview Image"
                          className="rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <RenderData
                  title={"Objectives"}
                  data={data?.course?.training_metadata?.objectives}
                />

                <RenderData
                  title={"Prerequisites"}
                  data={data?.course?.training_metadata?.prerequisites}
                />

                <RenderData
                  title={"Audience"}
                  data={data?.course?.training_metadata?.audience}
                />

                <RenderData
                  title={"Skills Covered"}
                  data={data?.course?.training_metadata?.skills_covered}
                />

                <RenderData
                  title={"Who Should Attend ?"}
                  data={data?.course?.training_metadata?.who_should_attend}
                />

                <RenderData
                  title={"Key Features"}
                  data={data?.course?.training_metadata?.key_features}
                />

                <RenderData
                  title={"Benefits"}
                  data={data?.course?.training_metadata?.benefits}
                />

                <RenderData
                  title={"Resources"}
                  data={data?.course?.training_metadata?.resources}
                />

                <RenderData
                  title={"Outcomes"}
                  data={data?.course?.training_metadata?.outcomes}
                />

                <div className="flex flex-col gap-2 mb-6">
                  <div className="px-2 py-3 grid grid-cols-4">
                    <div className="col-span-2 flex flex-col gap-2 pr-2">
                      <label className="font-[600] text-sky-800">
                        Certification Text
                      </label>
                      <div className="rounded-lg bg-white border bg-card text-card-foreground shadow-sm p-4 h-full flex justify-center items-center">
                        {data?.course?.training_metadata?.certification_text ||
                          "No data"}
                      </div>
                    </div>
                    <div className="col-span-2 flex flex-col gap-2 pl-2">
                      <label className="font-[600] text-sky-800">
                        Certification Image
                      </label>
                      <div className="rounded-lg bg-white border bg-card text-card-foreground shadow-sm py-4 px-10 items-center flex justify-center h-full">
                        <Image
                          src={"/assets/loginBg.png"}
                          alt="preview Image"
                          className="rounded-t-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-6">
                  <label className="font-[600] text-sky-800">FAQs</label>
                  <div className="w-full bg-white border-2 border-gray-800 rounded-md px-6 py-3">
                    {data?.course?.training_metadata?.FAQs?.map(
                      (obj: any, index: number) => {
                        return (
                          <div key={obj} className="leading-2 text-base mb-2">
                            <p>Question : {obj.question}</p>
                            <p>Answer : {obj.answer}</p>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-6">
                  <label className="font-[600] text-sky-800">Curriculum</label>
                  <div className="w-full bg-white border-2 border-gray-800 rounded-md px-6 py-3">
                    {data?.course?.training_metadata?.curriculum?.map(
                      (obj: any, index: number) => {
                        return (
                          <div key={obj} className="leading-2 text-base mb-2">
                            <p>Topic : {obj.title}</p>
                            {obj?.section_parts.map((sec: any, ind: number) => {
                              return (
                                <ul
                                  key={obj}
                                  className="list-disc leading-6 text-sm ml-24"
                                >
                                  <li>{sec.title}</li>
                                </ul>
                              );
                            })}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {editModal && (
        <CourseEditModal
          courseId={params.id}
          isOpen={editModal}
          handleClose={() => {
            setEditModal(!editModal);
          }}
        />
      )}
    </>
  );
};

export default Page;
