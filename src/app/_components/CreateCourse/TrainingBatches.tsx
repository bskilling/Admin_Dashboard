import React, { useEffect, useState } from 'react';
import { BiSolidDownArrow, BiSolidUpArrow } from 'react-icons/bi';
import { batch_status } from '@/utils/list';
import { useSelector } from 'react-redux';
import { useEditCourseMutation } from '@/redux/features/courses/coursesApi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Props = {
  course_data: any;
  setTrainingBatchesData: any;
  trainingBatchesData: any;
};

export default function TrainingBatches({
  course_data,
  trainingBatchesData,
  setTrainingBatchesData,
}: Props) {
  const [searchIsActive, setSearchIsActive] = useState(false);
  const { courseData } = useSelector((state: any) => state.courses);
  const [editCourse, { isSuccess, error }] = useEditCourseMutation();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setTrainingBatchesData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCourseCreate = async () => {
    const data = course_data;
    await editCourse({
      id: courseData?.course?._id,
      data,
    });
  };

  return (
    <>
      <div className="overflow-auto h-[100%] w-[100%] relative">
        <p className="block mb-6 text-sm font-[700] text-gray-600 pt-8">Create Batch</p>
        <div className="flex flex-wrap justify-between gap-4 mt-2 h-[350px] overflow-auto pb-28">
          <div className="w-[30%] mb-6">
            <label className="block mb-2 text-sm font-[700] text-gray-600">Batch Name</label>
            <div className="relative h-[45px]">
              <div
                className={`flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center ${
                  !trainingBatchesData.batch_name && 'border-red-600 border-1'
                }`}
              >
                <input
                  type="search"
                  value={trainingBatchesData.batch_name}
                  onChange={handleChange}
                  name="batch_name"
                  id="batch_name"
                  className="bg-transparent w-[90%] pl-2 border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
              </div>
              {!trainingBatchesData.batch_name && (
                <p className="text-red-600 text-sm">Batch Name required</p>
              )}
            </div>
          </div>
          <div className="w-[30%] mb-6">
            <label className="block mb-2 text-sm font-[700] text-gray-600">Paid</label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <button
                  className={`bg-violet-950 w-[50%] pl-2 border-none left-[50px] rounded-l-md h-[45px] outline-none text-[14px] font-[500] font-Josefin ${
                    !trainingBatchesData.isPaid
                      ? 'bg-violet-950 text-white'
                      : 'bg-white text-sky-800'
                  }`}
                  type="button"
                  onClick={() => {
                    setTrainingBatchesData((prevData: any) => ({
                      ...prevData,
                      isPaid: false,
                    }));
                  }}
                >
                  NO
                </button>
                <button
                  type="button"
                  className={`bg-transparent w-[50%] pl-2 border-none left-[50px] h-[45px] rounded-r-md outline-none text-sky-800 text-[14px] font-[500] font-Josefin ${
                    trainingBatchesData.isPaid
                      ? 'bg-violet-950 text-white'
                      : 'bg-white text-sky-800'
                  }`}
                  onClick={() => {
                    setTrainingBatchesData((prevData: any) => ({
                      ...prevData,
                      isPaid: true,
                    }));
                  }}
                >
                  YES
                </button>
              </div>
            </div>
          </div>
          <div className="w-[30%] mb-6">
            <label className="block mb-2 text-sm font-[700] text-gray-600">Trainer</label>
            <div className="relative h-[45px]">
              <div
                className={`flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center ${
                  !trainingBatchesData.trainer && 'border-red-600 border-1'
                }`}
              >
                <input
                  type="search"
                  value={trainingBatchesData.trainer}
                  onChange={handleChange}
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
                        // onClick={() => setSearchIsActive(false)}
                      />
                    ) : (
                      <BiSolidDownArrow
                        className="text-gray-500 z-10"
                        size={10}
                        // onClick={() => setSearchIsActive(true)}
                      />
                    )}
                  </div>
                </div>
              </div>
              {!trainingBatchesData.trainer && (
                <p className="text-red-600 text-sm">Trainer required</p>
              )}
            </div>
          </div>
          <div className="w-[30%] mb-6">
            <label className="block mb-2 text-sm font-[700] text-gray-600">Start Time</label>
            <div className="relative h-[45px]">
              <div
                className={`flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center ${
                  !trainingBatchesData.start_time && 'border-1 border-red-600'
                }`}
              >
                <DatePicker
                  showTimeSelect
                  withPortal
                  dateFormat={'MM/dd/yyyy h:mm aa'}
                  selected={trainingBatchesData.start_time}
                  placeholderText="Select Start Time"
                  onChange={(date: any) => {
                    setTrainingBatchesData((prevData: any) => ({
                      ...prevData,
                      start_time: date,
                    }));
                  }}
                  className="bg-transparent w-full border-none rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
              </div>

              {!trainingBatchesData.start_time && (
                <p className="text-red-600 text-sm">Start Time required</p>
              )}
            </div>
          </div>
          <div className="w-[30%] mb-6">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Enrollment End Date
            </label>
            <div className="relative h-[45px]">
              <div
                className={`flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center ${
                  !trainingBatchesData.enrollment_end_date && 'border-1 border-red-600'
                }`}
              >
                <DatePicker
                  showTimeSelect
                  withPortal
                  dateFormat={'MM/dd/yyyy h:mm aa'}
                  selected={trainingBatchesData.enrollment_end_date}
                  placeholderText="Select Enrollment End Date"
                  onChange={(date: any) => {
                    setTrainingBatchesData((prevData: any) => ({
                      ...prevData,
                      enrollment_end_date: date,
                    }));
                  }}
                  className="bg-transparent w-full border-none rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
              </div>
              {!trainingBatchesData.enrollment_end_date && (
                <p className="text-red-600 text-sm">End Registration Date is required</p>
              )}
            </div>
          </div>
          <div className="w-[30%] mb-6">
            <label className="block mb-2 text-sm font-[700] text-gray-600">End Date</label>
            <div className="relative h-[45px]">
              <div
                className={`flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center ${
                  !trainingBatchesData.end_date && 'border-1 border-red-600'
                }`}
              >
                <DatePicker
                  showTimeSelect
                  withPortal
                  dateFormat={'MM/dd/yyyy h:mm aa'}
                  selected={trainingBatchesData.end_date}
                  placeholderText="Select End Date"
                  onChange={(date: any) => {
                    setTrainingBatchesData((prevData: any) => ({
                      ...prevData,
                      end_date: date,
                    }));
                  }}
                  className="bg-transparent w-full border-none rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
              </div>
              {!trainingBatchesData.end_date && (
                <p className="text-red-600 text-sm">End Date is required</p>
              )}
            </div>
          </div>
          <div className="w-[30%] mb-6">
            <label className="block mb-2 text-sm font-[700] text-gray-600">Capacity</label>
            <div className="relative h-[45px]">
              <div
                className={`flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center ${
                  trainingBatchesData.capacity <= 0 && 'border-1 border-red-600'
                }`}
              >
                <input
                  type="number"
                  value={trainingBatchesData.capacity || 0}
                  onChange={handleChange}
                  name="capacity"
                  id="capacity"
                  className="bg-transparent w-[90%] pl-2 border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
              </div>
              {trainingBatchesData.capacity <= 0 && (
                <p className="text-red-600 text-sm">Capacity should be {'>'} 0</p>
              )}
            </div>
          </div>
          <div className="w-[30%] mb-6">
            <label className="block mb-2 text-sm font-[700] text-gray-600">Batch Status</label>
            <div className="relative h-[45px]">
              <div
                className={`flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center ${
                  !trainingBatchesData.batch_status && 'border-1 border-red-600'
                }`}
              >
                <input
                  type="search"
                  value={trainingBatchesData.batch_status}
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
              {!trainingBatchesData.batch_status && (
                <p className="text-red-600 text-sm">Batch Status is required</p>
              )}
              {searchIsActive && batch_status && batch_status.length > 0 && (
                <div className="z-50 absolute mt-1 w-[100%] p-2 bg-white shadow-lg rounded-bl-md rounded-br-md max-h-52 overflow-y-auto">
                  {searchIsActive &&
                    batch_status?.map((item: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="cursor-pointer hover:bg-black hover:bg-opacity-10 p-2"
                          onClick={() => {
                            setTrainingBatchesData((prevData: any) => ({
                              ...prevData,
                              batch_status: item.title,
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
            <label className="block mb-2 text-sm font-[700] text-gray-600">Description</label>

            <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
              <textarea
                value={trainingBatchesData.description}
                onChange={handleChange}
                name="description"
                id="description"
                className="bg-transparent w-full p-2 border-none rounded-[5px] h-[100px] outline-none text-[#292929] text-[14px] font-[500] font-Josefin"
                style={{ resize: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 bg-gray-100 w-full h-20 flex justify-end pb-2">
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-auto absolute bottom-4 right-8"
          type="button"
          onClick={handleCourseCreate}
        >
          Save
        </button>
      </div>
    </>
  );
}
