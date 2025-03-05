import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { RiGroupLine } from "react-icons/ri";
import { FaCopy } from "react-icons/fa";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import Link from "next/link";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Modal from "./Modal";

type Props = {
  selectedFilter: string;
  resultData: any;
  openModal: boolean;
  setOpenModal: any;
};

function Course({
  selectedFilter,
  resultData,
  openModal,
  setOpenModal,
}: Props) {
  const { isLoading, data, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [courseData, setCourseData] = useState<any>();

  useEffect(() => {
    if (resultData) {
      let sortedData = [
        ...(Array.isArray(resultData) ? resultData : resultData?.courses),
      ];

      if (selectedFilter === "Price (High-Low)") {
        sortedData.sort((a, b) => b.price - a.price);
      } else if (selectedFilter === "Price (Low-High)") {
        sortedData.sort((a, b) => a.price - b.price);
      } else if (selectedFilter === "Oldest First") {
        sortedData.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (selectedFilter === "Popularity") {
        sortedData.sort((a, b) => b.ratings - a.ratings);
      } else if (selectedFilter === "Latest First") {
        sortedData.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }

      setCourseData(sortedData);
    }
  }, [resultData, selectedFilter]);

  const displayData = courseData;

  return (
    <div className="mt-20 pt-10 h-full pb-8 flex justify-center items-center">
      <div className="flex justify-center items-center gap-6 flex-wrap">
        {displayData?.map((val: any, index: number) => {
          return (
            <Link href={`/learning/trainings/${val._id}`} key={index}>
              <div
                key={index}
                className="bg-white p-4 shadow-md rounded-lg w-60 h-[30rem] transition-all hover:scale-105 flex flex-col justify-between"
              >
                <div className="relative flex flex-col items-center mb-4">
                  <Image
                    src={val?.preview_image_uri || ""}
                    alt="course_img"
                    className="rounded-t-md object-cover w-full h-36"
                    width={400}
                    height={200}
                  />
                  <div className="absolute flex justify-around items-center w-full -bottom-6">
                    <span className="text-sm text-white bg-sky-700 p-2 rounded-md border-blue-300 border-2">
                      {val.level}
                    </span>
                    <span className="text-sm text-white bg-sky-700 p-2 rounded-md border-blue-300 border-2">
                      {val.price}/-
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-bold py-2">{val.title}</h3>
                <p className="text-gray-600 text-sm mb-4">Learning Admin</p>
                <div className="flex items-center flex-wrap gap-2">
                  <div
                    className="flex items-center text-sm border border-sky-700 py-1 px-3 font-semibold rounded-md text-sky-700"
                    data-tooltip-id="language-tooltip"
                    data-tooltip-content="Learning"
                  >
                    <AiOutlineGlobal className="mr-1" />
                    {val.language}
                  </div>
                  <Tooltip
                    id="language-tooltip"
                    opacity={0.3}
                    style={{
                      backgroundColor: "#665c5c",
                      color: "white",
                    }}
                  />
                  <div
                    className="flex items-center text-sm border border-sky-700 py-1 px-3 font-semibold rounded-md text-sky-700"
                    data-tooltip-id="users-tooltip"
                    data-tooltip-content="Taken By Users"
                  >
                    <RiGroupLine className="mr-1" />
                    {0}
                  </div>
                  <Tooltip
                    id="users-tooltip"
                    opacity={0.3}
                    style={{
                      backgroundColor: "#665c5c",
                      color: "white",
                    }}
                  />
                  <div
                    className="flex items-center text-sm border border-sky-700 py-1 px-3 font-semibold rounded-md text-sky-700"
                    data-tooltip-id="rating-tooltip"
                    data-tooltip-content="Rating"
                  >
                    <FaStar className="mr-1" />
                    {val.ratings}
                  </div>
                  <Tooltip
                    id="rating-tooltip"
                    opacity={0.3}
                    style={{
                      backgroundColor: "#665c5c",
                      color: "white",
                    }}
                  />
                  <div
                    className="flex items-center text-sm border border-sky-700 py-1 px-3 font-semibold rounded-md text-sky-700"
                    data-tooltip-id="batch-tooltip"
                    data-tooltip-content="Total Batches"
                  >
                    <FaCopy className="mr-1" />
                    {0}
                  </div>
                  <Tooltip
                    id="batch-tooltip"
                    opacity={0.3}
                    style={{
                      backgroundColor: "#665c5c",
                      color: "white",
                    }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {openModal && (
        <Modal
          isOpen={openModal}
          handleClose={() => {
            setOpenModal(!openModal);
          }}
        />
      )}
    </div>
  );
}

export default Course;
