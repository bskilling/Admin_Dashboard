import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { BiSearch, BiSolidDownArrow, BiSolidUpArrow } from 'react-icons/bi';
import {
  useCreateCourseMutation,
  useGetCourseByIdQuery,
  useGetCoursesTitleQuery,
} from '../../../redux/features/courses/coursesApi';
import { language, mode, category, level } from '@/utils/list';
import { ThreeCircles } from 'react-loader-spinner';
import toast from 'react-hot-toast';
import { useUploadFileMutation, useUploadImageMutation } from '@/redux/features/upload/uploadApi';

type Props = {
  setIsCourseCreated: any;
  courseData: any;
  setCourseData: any;
};

export default function TrainingDetails({ setIsCourseCreated, courseData, setCourseData }: Props) {
  const [lanIsActive, setLanIsActive] = useState(false);
  const [modeIsActive, setModeIsActive] = useState(false);
  const [categoryIsActive, setCategoryIsActive] = useState(false);
  const [levelIsActive, setLevelIsActive] = useState(false);
  const [traingData, setTraingingData] = useState('');
  const [selectedCourse, setSelectedCourse] = useState({ id: '', title: '' });

  const [createCourse, { isLoading: createCourseLoading, isSuccess, error }] =
    useCreateCourseMutation();

  const { isLoading, data, refetch } = useGetCoursesTitleQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [
    uploadImage,
    { isLoading: uploadLoading, isSuccess: isUploadSuccess, error: uploadError },
  ] = useUploadImageMutation();

  const [
    uploadFile,
    { isLoading: uploadFileLoading, isSuccess: isUploadFileSuccess, error: uploadFileError },
  ] = useUploadFileMutation();

  const {
    isLoading: courseDataLoading,
    data: refetchData,
    refetch: refetchCourseData,
  } = useGetCourseByIdQuery(selectedCourse?.id || '662e6189474738cd09c9d978');

  useEffect(() => {
    if (selectedCourse && refetchData) {
      setCourseData((prevData: any) => ({
        ...prevData,
        title: refetchData?.course?.title || '',
        category: refetchData?.course?.category || '',
        duration: refetchData?.course?.duration || '',
        level: refetchData?.course?.level || '',
        language: refetchData?.course?.language || '',
        owned_by: refetchData?.course?.owned_by || '',
        endorsed_by: refetchData?.course?.endorsed_by || '',
        training_mode: refetchData?.course?.training_mode || '',
        description: refetchData?.course?.description || '',
        assessment_required: refetchData?.course?.assessment_required || false,
        isPaid: refetchData?.course?.isPaid || false,
        preview_image_uri: refetchData?.course?.preview_image_uri || '',
        file_attach: refetchData?.course?.file_attach || '',
        assessment: refetchData?.course?.assessment || '',
        price: refetchData?.course?.price || 0,
        currency: refetchData?.course?.currency || '',
        discount: refetchData?.course?.discount || 0,
        url: refetchData?.course?.url || '',
        coupon_code: refetchData?.course?.coupon_code || '',
      }));
    }
  }, [selectedCourse, refetchData, setCourseData]);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    handleCourseCreate();
  };

  const handlePreviewImageInputChange = async (e: any) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // setIsImageLoading(true);
      const file = files[0];

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const data = await uploadImage(formData);
        setCourseData((prev: any) => ({
          ...prev,
          preview_image_uri: data.data.url,
        }));
        // setIsImageLoading(false);
      }
    }
  };

  const handleChange = (e: any) => {
    const { value, name } = e.target;
    setCourseData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileAttachment = async (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const data = await uploadFile(formData);
      setCourseData((prev: any) => ({
        ...prev,
        file_attachment_uri: data.data.url,
      }));
    }
  };

  const handleCourseCreate = async () => {
    const data = courseData;
    if (!isLoading) {
      await createCourse(data);
      setIsCourseCreated(true);
      toast.success('Course created successfully');
    }
  };

  return (
    <div className="overflow-hidden h-[100%] relative">
      <form
        className="flex flex-wrap justify-between gap-2 mt-2 mb-2 h-[420px] overflow-auto"
        onSubmit={handleFormSubmit}
      >
        <div className="flex flex-wrap justify-between gap-4 mt-2 pb-32">
          <div className="w-[23%] mt-4">
            <label className="block mb-2 text-sm font-[700] text-gray-600">Training Name</label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <input
                  type="search"
                  value={courseData?.title || ''}
                  onChange={handleChange}
                  name="title"
                  id="title"
                  className="bg-transparent w-[90%] pl-2 border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
              </div>
              {!courseData?.title && (
                <p className="text-red-600 text-sm">Training Name is required</p>
              )}
            </div>
          </div>
          <div className="w-[23%] mt-4">
            <label className="block mb-2 text-sm font-[700] text-gray-600">Category</label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <input
                  type="search"
                  value={courseData.category}
                  onChange={handleChange}
                  name="category"
                  id="category"
                  className="bg-transparent w-[90%] pl-2 border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
                <div className="flex items-center justify-center w-[40px] cursor-pointer h-[45px] rounded-r-[5px]">
                  <div className="hover:bg-gray-100 hover:rounded-full transition-all hover:p-2">
                    {categoryIsActive ? (
                      <BiSolidUpArrow
                        className="text-gray-500 z-10"
                        size={10}
                        onClick={() => setCategoryIsActive(false)}
                      />
                    ) : (
                      <BiSolidDownArrow
                        className="text-gray-500 z-10"
                        size={10}
                        onClick={() => setCategoryIsActive(true)}
                      />
                    )}
                  </div>
                </div>
              </div>
              {!courseData?.category && (
                <p className="text-red-600 text-sm">Category is required</p>
              )}
              {categoryIsActive && category && category.length > 0 && (
                <div className="z-50 absolute mt-1 w-[100%] p-2 bg-white shadow-lg rounded-bl-md rounded-br-md max-h-52 overflow-y-auto">
                  {categoryIsActive &&
                    category?.map((item: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="cursor-pointer hover:bg-black hover:bg-opacity-10 p-2"
                          onClick={() => {
                            setCourseData((prevData: any) => ({
                              ...prevData,
                              category: item.name,
                            }));
                            setCategoryIsActive(false);
                          }}
                        >
                          <p>{item.name}</p>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
          <div className="w-[23%] mt-4">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Duration{'(Hours)'}
            </label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <input
                  type="number"
                  required
                  value={courseData.duration || 0}
                  onChange={handleChange}
                  name="duration"
                  id="duration"
                  className="bg-transparent w-[90%] pl-2 border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
              </div>
              {!courseData?.duration && (
                <p className="text-red-600 text-sm">Duration should be greater than 0</p>
              )}
            </div>
          </div>
          <div className="w-[23%] mt-4">
            <label className="block mb-2 text-sm font-[700] text-gray-600">Level</label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <input
                  type="search"
                  value={courseData.level}
                  onChange={handleChange}
                  id="level"
                  name="level"
                  className="bg-transparent w-[90%] pl-2 border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
                <div className="flex items-center justify-center w-[45px] cursor-pointer h-[45px] rounded-r-[5px]">
                  <div className="hover:bg-gray-100 hover:rounded-full transition-all hover:p-2">
                    {levelIsActive ? (
                      <BiSolidUpArrow
                        className="text-gray-500 z-10"
                        size={10}
                        onClick={() => setLevelIsActive(false)}
                      />
                    ) : (
                      <BiSolidDownArrow
                        className="text-gray-500 z-10"
                        size={10}
                        onClick={() => setLevelIsActive(true)}
                      />
                    )}
                  </div>
                </div>
              </div>
              {!courseData?.level && <p className="text-red-600 text-sm">Level is required</p>}
              {levelIsActive && level && level.length > 0 && (
                <div className="z-50 absolute mt-1 w-[100%] p-2 bg-white shadow-lg rounded-bl-md rounded-br-md max-h-52 overflow-y-auto">
                  {levelIsActive &&
                    level?.map((item: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="cursor-pointer hover:bg-black hover:bg-opacity-10 p-2"
                          onClick={() => {
                            setCourseData((prevData: any) => ({
                              ...prevData,
                              level: item.name,
                            }));
                            setLevelIsActive(false);
                          }}
                        >
                          <p>{item.name}</p>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
          <div className="w-[23%] mt-4">
            <label className="block mb-2 text-sm font-[700] text-gray-600">Language</label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <input
                  type="search"
                  value={courseData.language}
                  onChange={handleChange}
                  className="bg-transparent w-[90%] pl-2 border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
                <div className="flex items-center justify-center w-[40px] cursor-pointer h-[45px] rounded-r-[5px]">
                  <div className="hover:bg-gray-100 hover:rounded-full transition-all hover:p-2">
                    {lanIsActive ? (
                      <BiSolidUpArrow
                        className="text-gray-500 z-10"
                        size={10}
                        onClick={() => setLanIsActive(false)}
                      />
                    ) : (
                      <BiSolidDownArrow
                        className="text-gray-500 z-10"
                        size={10}
                        onClick={() => setLanIsActive(true)}
                      />
                    )}
                  </div>
                </div>
              </div>

              {!courseData?.language && (
                <p className="text-red-600 text-sm">Language is required</p>
              )}
              {lanIsActive && language && language.length > 0 && (
                <div className="z-50 absolute mt-1 w-[100%] p-2 bg-white shadow-lg rounded-bl-md rounded-br-md max-h-52 overflow-y-auto">
                  {lanIsActive &&
                    language?.map((item: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="cursor-pointer hover:bg-black hover:bg-opacity-10 p-2"
                          onClick={() => {
                            {
                              setCourseData((prevData: any) => ({
                                ...prevData,
                                language: item.name,
                              }));
                              setLanIsActive(false);
                            }
                          }}
                        >
                          <p>{item.name}</p>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
          <div className="w-[23%] mt-4">
            <label className="block mb-2 text-sm font-[700] text-gray-600">Owned By</label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <input
                  type="search"
                  value={courseData.owned_by}
                  onChange={handleChange}
                  name="owned_by"
                  id="owned_by"
                  className="bg-transparent w-[90%] pl-2 border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
              </div>
              {!courseData?.owned_by && (
                <p className="text-red-600 text-sm">Owned by is required</p>
              )}
            </div>
          </div>
          <div className="w-[23%] mt-4">
            <label className="block mb-2 text-sm font-[700] text-gray-600">Endorsed By</label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <input
                  type="search"
                  required
                  value={courseData.endorsed_by}
                  onChange={handleChange}
                  name="endorsed_by"
                  id="endorsed_by"
                  className="bg-transparent w-[90%] pl-2 border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
              </div>
              {!courseData?.endorsed_by && (
                <p className="text-red-600 text-sm">Endorsed by is required</p>
              )}
            </div>
          </div>
          <div className="w-[23%] mt-4">
            <label className="block mb-2 text-sm font-[700] text-gray-600">Training Mode</label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <input
                  type="search"
                  value={courseData.training_mode}
                  onChange={handleChange}
                  name="training_mode"
                  id="training_mode"
                  className="bg-transparent w-[90%] pl-2 border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
                <div className="flex items-center justify-center w-[40px] cursor-pointer h-[45px] rounded-r-[5px]">
                  <div className="hover:bg-gray-100 hover:rounded-full transition-all hover:p-2">
                    {modeIsActive ? (
                      <BiSolidUpArrow
                        className="text-gray-500 z-10"
                        size={10}
                        onClick={() => setModeIsActive(false)}
                      />
                    ) : (
                      <BiSolidDownArrow
                        className="text-gray-500 z-10"
                        size={10}
                        onClick={() => setModeIsActive(true)}
                      />
                    )}
                  </div>
                </div>
              </div>
              {!courseData?.training_mode && (
                <p className="text-red-600 text-sm">Training Mode is required</p>
              )}
              {modeIsActive && mode && mode.length > 0 && (
                <div className="z-50 absolute mt-1 w-[100%] p-2 bg-white shadow-lg rounded-bl-md rounded-br-md max-h-52 overflow-y-auto">
                  {modeIsActive &&
                    mode?.map((item: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="cursor-pointer hover:bg-black hover:bg-opacity-10 p-2"
                          onClick={() => {
                            setCourseData((prevData: any) => ({
                              ...prevData,
                              training_mode: item.name,
                            }));
                            setModeIsActive(false);
                          }}
                        >
                          <p>{item.name}</p>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
          <div className="w-[23%] mt-4">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Assessment Required
            </label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <button
                  type="button"
                  className={`w-[50%] pl-2 border-none left-[50px] rounded-l-md h-[45px] outline-none text-[14px] font-[500] font-Josefin  ${
                    !courseData.assessment_required
                      ? 'bg-violet-950 text-white'
                      : 'bg-white text-sky-800'
                  }`}
                  onClick={() => {
                    setCourseData((prevData: any) => ({
                      ...prevData,
                      assessment_required: false,
                    }));
                  }}
                >
                  NO
                </button>
                <button
                  type="button"
                  className={`bg-transparent w-[50%] pl-2 border-none left-[50px] h-[45px] rounded-r-md outline-none text-sky-800 text-[14px] font-[500] font-Josefin ${
                    courseData.assessment_required && 'bg-violet-950 text-white'
                  }`}
                  onClick={() => {
                    setCourseData((prevData: any) => ({
                      ...prevData,
                      assessment_required: true,
                    }));
                  }}
                >
                  YES
                </button>
              </div>
            </div>
          </div>
          {courseData.assessment_required && (
            <div className="w-[23%] mt-4">
              <label className="block mb-2 text-sm font-[700] text-gray-600">Assessment</label>
              <div className="relative h-[45px]">
                <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                  <input
                    type="search"
                    value={courseData.assessment}
                    name="assessment"
                    id="assessment"
                    onChange={handleChange}
                    className="bg-transparent w-[90%] pl-2 border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                  />
                  <div className="flex items-center justify-center w-[40px] cursor-pointer h-[45px] rounded-r-[5px]">
                    <div className="hover:bg-gray-100 hover:rounded-full transition-all hover:p-2">
                      {categoryIsActive ? (
                        <BiSolidUpArrow
                          className="text-gray-500 z-10"
                          size={10}
                          onClick={() => setCategoryIsActive(false)}
                        />
                      ) : (
                        <BiSolidDownArrow
                          className="text-gray-500 z-10"
                          size={10}
                          onClick={() => setCategoryIsActive(true)}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {courseData.assessment_required && !courseData?.assessment && (
                  <p className="text-red-600 text-sm">Assessment is required</p>
                )}
                {/* {categoryIsActive && category && category.length > 0 && (
                  <div className="z-50 absolute mt-1 w-[100%] p-2 bg-white shadow-lg rounded-bl-md rounded-br-md max-h-52 overflow-y-auto">
                    {categoryIsActive &&
                      category?.map((item: any, index: number) => {
                        return (
                          <div
                            key={index}
                            className="cursor-pointer hover:bg-black hover:bg-opacity-10 p-2"
                            onClick={() => {
                              setCourseData((prevData: any) => ({
                                ...prevData,
                                category: item.name,
                              }));
                              setCategoryIsActive(false);
                            }}
                          >
                            <p>{item.name}</p>
                          </div>
                        );
                      })}
                  </div>
                )} */}
              </div>
            </div>
          )}
          <div className="w-[23%] mt-4">
            <label className="block mb-2 text-sm font-[700] text-gray-600">Paid</label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <button
                  className={`bg-violet-950 w-[50%] pl-2 border-none left-[50px] rounded-l-md h-[45px] outline-none text-[14px] font-[500] font-Josefin ${
                    !courseData.isPaid ? 'bg-violet-950 text-white' : 'bg-white text-sky-800'
                  }`}
                  type="button"
                  onClick={() => {
                    setCourseData((prevData: any) => ({
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
                    courseData.isPaid && 'bg-violet-950 text-white'
                  }`}
                  onClick={() => {
                    {
                      setCourseData((prevData: any) => ({
                        ...prevData,
                        isPaid: true,
                      }));
                    }
                  }}
                >
                  YES
                </button>
              </div>
            </div>
          </div>

          {courseData.isPaid && (
            <>
              <div className="w-[23%] mt-4">
                <label className="block mb-2 text-sm font-[700] text-gray-600">Price</label>
                <div className="relative h-[45px]">
                  <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                    <input
                      type="number"
                      value={courseData.price}
                      name="price"
                      id="price"
                      onChange={handleChange}
                      className="bg-transparent w-[90%] pl-2 border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                    />
                  </div>
                  {courseData.isPaid && !courseData?.price && (
                    <p className="text-red-600 text-sm">Price is required</p>
                  )}
                </div>
              </div>
              <div className="w-[23%] mt-4">
                <label className="block mb-2 text-sm font-[700] text-gray-600">Currency</label>
                <div className="relative h-[45px]">
                  <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                    <input
                      type="text"
                      value={courseData.currency || 'IN'}
                      name="currency"
                      id="currency"
                      onChange={handleChange}
                      className="bg-transparent w-[90%] pl-2 border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                    />
                  </div>
                </div>
              </div>
              <div className="w-[23%] mt-4">
                <label className="block mb-2 text-sm font-[700] text-gray-600">Discount</label>
                <div className="relative h-[45px]">
                  <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                    <input
                      type="number"
                      value={courseData.discount}
                      name="discount"
                      id="discount"
                      onChange={handleChange}
                      className="bg-transparent w-[90%] pl-2 border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                    />
                  </div>
                </div>
              </div>
              <div className="w-[23%] mt-4">
                <label className="block mb-2 text-sm font-[700] text-gray-600">Coupon Code</label>
                <div className="relative h-[45px]">
                  <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                    <input
                      type="text"
                      value={courseData.coupon_code}
                      name="coupon_code"
                      id="coupon_code"
                      onChange={handleChange}
                      className="bg-transparent w-[90%] pl-2 border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="w-[23%] mt-4">
            <label className="block mb-2 text-sm font-[700] text-gray-600">Preview Image</label>
            <div className="relative h-[45px] ">
              <div className="flex bg-transparent w-full h-full rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <label className="block rounded-md h-full">
                  <span className="sr-only">Choose file</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePreviewImageInputChange}
                    className="block w-full h-full text-sm text-gray-500 rounded-l-md
                file:mr-4 file:py-4 file:px-4
                file:text-sm file:font-semibold
                file:rounded-l-md
                file:border-none
                file:bg-violet-950 file:text-white
                file:cursor-pointer cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="w-[23%] mt-4">
            <label className="block mb-2 text-sm font-[700] text-gray-600">File Attachment</label>
            <div className="relative h-[45px] ">
              <div className="flex bg-transparent w-full h-full rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <label className="block rounded-md h-full">
                  <span className="sr-only">Choose file</span>
                  <input
                    type="file"
                    accept=".doc, .docx, .pdf, .txt"
                    onChange={handleFileAttachment}
                    className="block w-full h-full text-sm text-gray-500 rounded-l-md
                file:mr-4 file:py-4 file:px-4
                file:text-sm file:font-semibold
                file:rounded-l-md
                file:border-none
                file:bg-violet-950 file:text-white
                file:cursor-pointer cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="w-[100%] mt-4">
            <label className="block mb-2 text-sm font-[700] text-gray-600">Url</label>
            <div className="h-[65px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <textarea
                  value={courseData?.url}
                  onChange={handleChange}
                  name="url"
                  id="url"
                  className="bg-transparent w-full p-2 border-none rounded-[5px] h-[40px] outline-none text-[#292929] text-[14px] font-[500] font-Josefin"
                  style={{ resize: 'none' }}
                />
              </div>
            </div>
          </div>
          <div className="w-[100%] mt-4">
            <label className="block mb-2 text-sm font-[700] text-gray-600">Description</label>
            <div className="h-[65px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <textarea
                  value={courseData.description}
                  onChange={handleChange}
                  name="description"
                  id="description"
                  className="bg-transparent w-full p-2 border-none rounded-[5px] h-[80px] outline-none text-[#292929] text-[14px] font-[500] font-Josefin"
                  style={{ resize: 'none' }}
                />
              </div>
              {!courseData?.description && (
                <p className="text-red-600 text-sm">Description is required</p>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-1 right-4 bg-gray-100 w-full h-20 flex justify-end pb-2">
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded my-auto"
            type="submit"
          >
            {createCourseLoading ? (
              <ThreeCircles
                visible={true}
                height="30"
                width="30"
                color="#ffffff"
                ariaLabel="three-circles-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : (
              'save'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
