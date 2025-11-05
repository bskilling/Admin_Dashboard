'use client';
import React, { useEffect, useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { IoIosAdd } from 'react-icons/io';
import { FaFilter } from 'react-icons/fa6';
import { AiOutlineClose } from 'react-icons/ai';
import Dropdown from './Dropdown';
import { useLogOutQuery } from '../../redux/features/auth/authApi';
import { useRouter } from 'next/navigation';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import { category, level, language, ispaid, mode } from '../../utils/list';
import {
  useGetCoursesTitleQuery,
  useGetCoursesLengthQuery,
} from '@/redux/features/courses/coursesApi';
import Search from './Search';
import { useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi';
import dynamic from 'next/dynamic';
import { Pagination } from './Pagination';
import Link from 'next/link';
import { ThreeCircles } from 'react-loader-spinner';
const Course = dynamic(() => import('./Course'), {
  ssr: false,
});

type Props = {};

const CourseContent = (props: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [logout, setLogout] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const router = useRouter();
  const [searchData, setSearchData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterParams, setFilterParams] = useState({
    category: '',
    level: '',
    language: '',
    isPaid: '',
    mode: '',
  });

  const {
    isLoading: loading,
    data: coursesLength,
    refetch: refetchLength,
  } = useGetCoursesLengthQuery({}, { refetchOnMountOrArgChange: true });
  const { data: searchQueryData } = useGetCoursesTitleQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const { isLoading, data, refetch } = useGetCoursesTitleQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const {
    isLoading: isLoadingCourse,
    data: dataCourse,
    refetch: refetchCourse,
  } = useGetAllCoursesQuery({ ...filterParams, page: currentPage });

  const [resultData, setResultData] = useState(data || []);

  useEffect(() => {
    if (searchQuery) {
      const filteredResult = resultData.filter((item: any) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchData(filteredResult);
    } else {
      setSearchData([]);
    }
  }, [searchQuery, resultData]);

  useEffect(() => {
    if (data?.courses) {
      setResultData(data?.courses);
    }
  }, [data]);

  useEffect(() => {
    if (dataCourse?.courses) {
      setResultData(dataCourse?.courses);
    }
  }, [dataCourse]);

  const {} = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  });

  const logOutHandler = async () => {
    setLogout(true);
    router.push('/');
  };

  type changeHandler = React.ChangeEventHandler<HTMLInputElement>;
  const courseData = resultData;
  const handleChange: changeHandler = e => {
    const { target } = e;
    const filteredValue = courseData?.filter((data: any) =>
      data?.title.toLowerCase().startsWith(target.value.toLowerCase())
    );

    setSearchData(filteredValue);
  };

  const handleApplyFilters = () => {
    refetchCourse();
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFilterParams(prevParams => ({
      ...prevParams,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (currentPage) {
      paginate(currentPage);
    }
  }, [currentPage]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="w-full bg-main-bg-img bg-no-repeat bg-cover relative">
      <div className="fixed top-0 w-full bg-main-bg-img bg-no-repeat bg-cover px-8 z-10 flex justify-around transition-all">
        <div
          className={`fixed top-0 right-0 h-screen w-1/4 bg-white z-20 transition-all ease-out duration-300 shadow-lg transform ${
            filterModalVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {filterModalVisible && (
            <div className="flex flex-col py-10 px-6 gap-10">
              <div className="flex justify-between items-center ">
                <h3 className="text-sky-800 font-[600]">Apply Filters</h3>
                <div className="border-sky-700 w-6 h-6 border-2 flex justify-center items-center rounded-full">
                  <AiOutlineClose
                    className="text-sky-700 cursor-pointer"
                    size={24}
                    style={{ padding: '4px' }}
                    onClick={() => setFilterModalVisible(false)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
                  <select
                    id="categories"
                    name="category"
                    className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:placeholder-gray-400"
                    value={filterParams.category}
                    onChange={handleInputChange}
                  >
                    {category.map((val, ind) => {
                      return (
                        <option value={val.name} key={val.id} className="text-gray-600">
                          {val.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Level</label>
                  <select
                    id="level"
                    name="level"
                    className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:placeholder-gray-400"
                    value={filterParams.level}
                    onChange={handleInputChange}
                  >
                    {level.map((val, ind) => {
                      return (
                        <option value={val.name} key={val.id} className="text-gray-600">
                          {val.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Language</label>
                  <select
                    id="language"
                    name="language"
                    className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:placeholder-gray-400"
                    value={filterParams.language}
                    onChange={handleInputChange}
                  >
                    {language.map((val, ind) => {
                      return (
                        <option value={val.name} key={val.id} className="text-gray-600">
                          {val.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Is Paid</label>
                  <select
                    id="isPaid"
                    name="isPaid"
                    className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:placeholder-gray-400"
                    value={filterParams.isPaid}
                    onChange={handleInputChange}
                  >
                    {ispaid.map((val, ind) => {
                      return (
                        <option value={val.name} key={val.id} className="text-gray-600">
                          {val.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Mode</label>
                  <select
                    id="mode"
                    name="mode"
                    className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:placeholder-gray-400"
                    value={filterParams.mode}
                    onChange={handleInputChange}
                  >
                    {mode.map((val, ind) => {
                      return (
                        <option value={val.name} key={val.id} className="text-gray-600">
                          {val.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex justify-end gap-3">
                  <button className="border-2 border-sky-800 text-sky-800 px-4 py-2 rounded-md">
                    Clear
                  </button>
                  <button
                    className="border-none bg-sky-800 text-white px-4 py-2 rounded-md"
                    onClick={handleApplyFilters}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-[50%] pl-4 h-[80px] flex justify-start items-center gap-6">
          <div className="px-4 py-[8px] bg-sky-700 rounded-md text-white font-[600]">
            <button>Trainings({coursesLength?.coursesLength || 0})</button>
          </div>

          <Link
            href="/dashboard/blogs"
            // target="_blank"
            className="px-4 py-[8px] bg-sky-700 rounded-md text-white font-[600] hover:bg-sky-600 transition-all"
          >
            Blog
          </Link>

          <Link
            href="/dashboard/reviews"
            // target="_blank"
            className="px-4 py-[8px] bg-sky-700 rounded-md text-white font-[600] hover:bg-sky-600 transition-all"
          >
            Reviews
          </Link>
          <Link
            href="/dashboard"
            // target="_blank"
            className="px-4 py-[8px] bg-sky-700 rounded-md text-white font-[600] hover:bg-sky-600 transition-all"
          >
            Dashboard
          </Link>
          <Search
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            results={searchQuery && searchData.length > 0 ? searchData : resultData}
            renderItem={item => <p>{item.title}</p>}
            onChange={handleChange}
          />
        </div>

        <div className="h-[80px] flex justify-end items-center gap-3">
          <div className="w-60">
            {coursesLength && (
              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={coursesLength?.coursesLength}
                paginate={paginate}
                currentPage={currentPage}
              />
            )}
          </div>
          <Dropdown selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
          <button
            className="p-3 bg-sky-900 rounded-md"
            data-tooltip-id="add-trainings-tooltip"
            data-tooltip-content="Add Trainings"
            onClick={() => setOpenModal(true)}
          >
            <IoIosAdd size={20} color="white" />
          </button>
          <Tooltip
            id="add-trainings-tooltip"
            opacity={1}
            style={{
              backgroundColor: '#665c5c',
              fontSize: '12px',
              color: 'white',
            }}
          />
          <button
            className="p-3 bg-sky-900 rounded-md"
            data-tooltip-id="filter-trainings-tooltip"
            data-tooltip-content="Filter Trainings"
            onClick={() => setFilterModalVisible(!filterModalVisible)}
          >
            <FaFilter size={20} color="white" />
          </button>
          <Tooltip
            id="filter-trainings-tooltip"
            opacity={1}
            style={{
              backgroundColor: '#665c5c',
              fontSize: '13px',
              color: 'white',
            }}
          />
          <button
            className="p-3 bg-sky-900 rounded-md"
            onClick={() => logOutHandler()}
            data-tooltip-id="signout-tooltip"
            data-tooltip-content="Sign out"
          >
            <BiLogOut size={20} color="white" />
          </button>
          <Tooltip
            id="signout-tooltip"
            opacity={1}
            style={{
              backgroundColor: '#665c5c',
              fontSize: '12px',
              color: 'white',
            }}
          />
        </div>
      </div>
      {isLoadingCourse ? (
        <ThreeCircles
          visible={true}
          height="60"
          width="60"
          color="#000000"
          ariaLabel="three-circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      ) : (
        <Course
          selectedFilter={selectedFilter}
          resultData={searchQuery && searchData.length > 0 ? searchData : resultData}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
    </div>
  );
};

export default CourseContent;
