import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import EditTrainingDetails from "./EditCourse/EditTrainingDetails";
import { useGetCourseByIdQuery } from "@/redux/features/courses/coursesApi";
import EditTrainingMetadata from "./EditCourse/EditTrainingMetadata";
import EditTrainingBatches from "./EditCourse/EditTrainingBatches";

interface ModalProps {
  courseId: string;
  isOpen: boolean;
  handleClose: () => void;
}

const CourseEditModal = ({ courseId, isOpen, handleClose }: ModalProps) => {
  const { isLoading, data, refetch } = useGetCourseByIdQuery(courseId);
  const [active, setActive] = useState(0);
  //   const { courseData: createCourseData } = useSelector(
  //     (state: any) => state.courses
  //   );

  const [trainingMetadata, setTrainingMetadata] = useState({
    headline: "",
    body: "",
    overview: "",
    preview_video: "",
    preview_image: "",
    objectives: [{ title: "" }],
    prerequisites: [{ title: "" }],
    audience: [{ title: "" }],
    skills_covered: [{ title: "" }],
    key_features: [{ title: "" }],
    benefits: [{ title: "" }],
    resources: [{ title: "" }],
    outcomes: [{ title: "" }],
    certification_text: "",
    certification_image: "",
    FAQs: [{ question: "", answer: "" }],
    curriculum: [
      { title: "", videoSection: "", section_parts: [{ title: "" }] },
    ],
  });

  const [trainingBatchesData, setTrainingBatchesData] = useState({
    batch_name: "",
    isPaid: false,
    trainer: "",
    start_time: "",
    enrollment_end_date: "",
    end_date: "",
    capacity: "",
    batch_status: "",
    description: "",
  });

  const [courseData, setCourseData] = useState(data?.course || null);

  // disalbe scroll on modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return (): void => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="w-[80%] h-[80%] flex flex-col relative z-50 overflow-y-hidden rounded-md bg-white">
        <div className=" py-3 px-8 rounded">
          <div className="border-b-2 border-gray-400">
            <div className="flex justify-around gap-1 items-center">
              <span
                className={`text-gray-400 font-[600] h-full cursor-pointer pb-2 ${
                  active === 0 && "text-sky-800 border-b-4 border-sky-800"
                }`}
                onClick={() => setActive(0)}
              >
                Training Details
              </span>
              <span
                className={`text-gray-400 font-[600] h-full cursor-pointer pb-2 ${
                  active === 1 && "text-sky-800 border-b-4 border-sky-800"
                }`}
                onClick={() => {
                  setActive(1);
                }}
              >
                Training Metadata
              </span>
              <span
                className={`text-gray-400 font-[600] h-full cursor-pointer pb-2 ${
                  active === 2 && "text-sky-800 border-b-4 border-sky-800"
                }`}
                onClick={() => {
                  setActive(2);
                }}
              >
                Training Batches
              </span>
              <span
                className={`text-gray-400 font-[600] h-full cursor-pointer pb-2 ${
                  active === 3 && "text-sky-800 border-b-4 border-sky-800"
                }`}
                onClick={() => {
                  setActive(3);
                }}
              >
                Batch Sessions
              </span>
              <span
                className={`text-gray-400 font-[600] h-full cursor-pointer pb-2 ${
                  active === 4 && "text-sky-800 border-b-4 border-sky-800"
                }`}
                onClick={() => {
                  setActive(4);
                }}
              >
                Batch Students
              </span>
              <span
                className={`text-gray-400 font-[600] h-full cursor-pointer pb-2 ${
                  active === 5 && "text-sky-800 border-b-4 border-sky-800"
                }`}
                onClick={() => {
                  setActive(5);
                }}
              >
                Batch Attendance
              </span>
              <button
                className="text-white p-[4px] border-2 border-sky-800 rounded-md"
                onClick={handleClose}
              >
                <MdClose size={20} className="text-sky-800" />
              </button>
            </div>
          </div>

          {active === 0 && (
            <EditTrainingDetails
              courseData={courseData}
              setCourseData={setCourseData}
              setActive={setActive}
            />
          )}

          {active === 1 && (
            <EditTrainingMetadata
              courseData={courseData}
              setCourseData={setCourseData}
              setActive={setActive}
            />
          )}

          {active === 2 && (
            <EditTrainingBatches
              courseData={courseData}
              setCourseData={setCourseData}
              setActive={setActive}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseEditModal;
