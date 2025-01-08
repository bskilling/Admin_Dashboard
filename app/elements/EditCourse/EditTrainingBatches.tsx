import { useEditCourseMutation } from "@/redux/features/courses/coursesApi";
import { formattDate } from "@/utils/formatter";
import { batch_status } from "@/utils/list";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { ThreeCircles } from "react-loader-spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function EditTrainingBatches({ courseData, setCourseData, setActive }: any) {
  const [editCourse, { isLoading: createCourseLoading, isSuccess, error }] =
    useEditCourseMutation();
  const [searchIsActive, setSearchIsActive] = useState(false);

  const handleCourseCreate = async () => {
    await editCourse({
      id: courseData?._id,
      data: courseData,
    });

    toast.success("Training Batch updated successfully");
    if (isSuccess) {
      setActive(3);
    }
  };

  console.log(courseData, "Trainindaksjdn asjdla sd[0a-0=-0p0-=p");
  return (
    <>
      <div className="overflow-auto h-[100%] w-[100%] relative">
        <div className="flex flex-wrap justify-start gap-4 mt-6 h-[420px] overflow-auto pb-24">
          <div className="w-[30%] mb-6">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Batch Name
            </label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <input
                  type="search"
                  value={courseData?.training_batches?.batch_name}
                  onChange={(e) => {
                    setCourseData((prevData: any) => ({
                      ...prevData,
                      training_batches: {
                        ...prevData.training_batches,
                        batch_name: e.target.value,
                      },
                    }));
                  }}
                  name="batch_name"
                  id="batch_name"
                  className="bg-transparent w-[90%] pl-2 border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
              </div>
            </div>
          </div>
          <div className="w-[30%] mb-6">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Paid
            </label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <button
                  className={`w-[50%] pl-2 border-none left-[50px] rounded-l-md h-[45px] outline-none text-[14px] font-[500] font-Josefin  ${
                    !courseData?.training_batches?.isPaid
                      ? "bg-violet-950 text-white"
                      : "bg-white text-sky-800"
                  }`}
                  type="button"
                  onClick={() => {
                    setCourseData((prevData: any) => ({
                      ...prevData,
                      training_batches: {
                        ...prevData.training_batches,
                        isPaid: false,
                      },
                    }));
                  }}
                >
                  NO
                </button>
                <button
                  type="button"
                  className={`w-[50%] pl-2 border-none left-[50px] rounded-l-md h-[45px] outline-none text-[14px] font-[500] font-Josefin  ${
                    courseData?.training_batches?.isPaid
                      ? "bg-violet-950 text-white"
                      : "bg-white text-sky-800"
                  }`}
                  onClick={() => {
                    setCourseData((prevData: any) => ({
                      ...prevData,
                      training_batches: {
                        ...prevData.training_batches,
                        isPaid: true,
                      },
                    }));
                  }}
                >
                  YES
                </button>
              </div>
            </div>
          </div>
          <div className="w-[30%] mb-6">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Trainer
            </label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <input
                  type="search"
                  value={courseData?.training_batches?.trainer}
                  onChange={(e) => {
                    setCourseData((prevData: any) => ({
                      ...prevData,
                      training_batches: {
                        ...prevData.training_batches,
                        trainer: e.target.value,
                      },
                    }));
                  }}
                  name="trainer"
                  id="trainer"
                  className="bg-transparent w-[90%] pl-2 border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
                <div className="flex items-center justify-center w-[40px] cursor-pointer h-[45px] rounded-r-[5px]">
                  <div className="hover:bg-gray-100 hover:rounded-full transition-all hover:p-2">
                    {searchIsActive ? (
                      <BiSolidUpArrow
                        className="text-gray-500 z-10"
                        size={10}
                        onClick={() => setSearchIsActive(false)}
                      />
                    ) : (
                      <BiSolidDownArrow
                        className="text-gray-500 z-10"
                        size={10}
                        onClick={() => setSearchIsActive(true)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[30%] mb-6">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Start Time
            </label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <DatePicker
                  showTimeSelect
                  withPortal
                  dateFormat={"MM/dd/yyyy h:mm aa"}
                  selected={new Date(courseData?.training_batches?.start_time)}
                  onChange={(date: any) => {
                    setCourseData((prevData: any) => ({
                      ...prevData,
                      training_batches: {
                        ...prevData.training_batches,
                        start_time: date,
                      },
                    }));
                  }}
                  className="bg-transparent w-full border-none rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
              </div>
            </div>
          </div>
          <div className="w-[30%] mb-6">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Enrollment End Date
            </label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <DatePicker
                  showTimeSelect
                  withPortal
                  dateFormat={"MM/dd/yyyy h:mm aa"}
                  selected={
                    new Date(courseData?.training_batches?.enrollment_end_date)
                  }
                  onChange={(date: any) => {
                    setCourseData((prevData: any) => ({
                      ...prevData,
                      training_batches: {
                        ...prevData.training_batches,
                        enrollment_end_date: date,
                      },
                    }));
                  }}
                  className="bg-transparent w-full border-none rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
              </div>
            </div>
          </div>
          <div className="w-[30%] mb-6">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              End Date
            </label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <DatePicker
                  showTimeSelect
                  withPortal
                  dateFormat={"MM/dd/yyyy h:mm aa"}
                  selected={new Date(courseData?.training_batches?.end_date)}
                  onChange={(date: any) => {
                    setCourseData((prevData: any) => ({
                      ...prevData,
                      training_batches: {
                        ...prevData.training_batches,
                        end_date: date,
                      },
                    }));
                  }}
                  className="bg-transparent w-full border-none rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
              </div>
            </div>
          </div>
          <div className="w-[30%] mb-6">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Capacity
            </label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <input
                  type="number"
                  value={courseData?.training_batches?.capacity || 0}
                  onChange={(e) => {
                    setCourseData((prevData: any) => ({
                      ...prevData,
                      training_batches: {
                        ...prevData.training_batches,
                        capacity: e.target.value,
                      },
                    }));
                  }}
                  name="capacity"
                  id="capacity"
                  className="bg-transparent w-[90%] pl-2 border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
              </div>
            </div>
          </div>
          <div className="w-[30%] mb-6">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Batch Status
            </label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <input
                  type="search"
                  value={courseData?.training_batches?.batch_status}
                  name="batch_status"
                  id="batch_status"
                  className="bg-transparent w-[90%] pl-2 border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
                <div className="flex items-center justify-center w-[40px] cursor-pointer h-[45px] rounded-r-[5px]">
                  <div className="hover:bg-gray-100 hover:rounded-full transition-all hover:p-2">
                    {searchIsActive ? (
                      <BiSolidUpArrow
                        className="text-gray-500 z-10"
                        size={10}
                        onClick={() => setSearchIsActive(false)}
                      />
                    ) : (
                      <BiSolidDownArrow
                        className="text-gray-500 z-10"
                        size={10}
                        onClick={() => setSearchIsActive(true)}
                      />
                    )}
                  </div>
                </div>
              </div>
              {searchIsActive && batch_status && batch_status.length > 0 && (
                <div className="z-50 absolute mt-1 w-[100%] p-2 bg-white shadow-lg rounded-bl-md rounded-br-md max-h-52 overflow-y-auto">
                  {searchIsActive &&
                    batch_status?.map((item: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="cursor-pointer hover:bg-black hover:bg-opacity-10 p-2"
                          onClick={() => {
                            setCourseData((prevData: any) => ({
                              ...prevData,
                              training_batches: {
                                ...prevData.training_batches,
                                batch_status: item.title,
                              },
                            }));
                            setSearchIsActive(false);
                          }}
                        >
                          <p>{item.title}</p>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
          <div className="w-[100%]">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Description
            </label>

            <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
              <textarea
                value={courseData?.training_batches?.description}
                onChange={(e) => {
                  setCourseData((prevData: any) => ({
                    ...prevData,
                    training_batches: {
                      ...prevData.training_batches,
                      description: e.target.value,
                    },
                  }));
                }}
                name="description"
                id="description"
                className="bg-transparent w-full p-2 border-none rounded-[5px] h-[100px] outline-none text-[#292929] text-[14px] font-[500] font-Josefin"
                style={{ resize: "none" }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 bg-gray-100 w-full h-20 flex justify-end items-center pb-2">
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          style={{ position: "absolute", bottom: "1rem", right: "1rem" }}
          onClick={handleCourseCreate}
        >
          {createCourseLoading ? (
            <ThreeCircles
              visible={true}
              height="20"
              width="20"
              color="#ffffff"
              ariaLabel="three-circles-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          ) : (
            "save"
          )}
        </button>
      </div>
    </>
  );
}

export default EditTrainingBatches;
