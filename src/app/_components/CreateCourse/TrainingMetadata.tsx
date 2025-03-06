import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useGetCoursesTitleQuery,
} from "@/redux/features/courses/coursesApi";
import React, { useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { useSelector } from "react-redux";
import { ThreeCircles } from "react-loader-spinner";
import toast from "react-hot-toast";

type Props = {
  course_data: any;
  setTrainingMetadata: any;
  trainingMetadata: any;
};

export default function TrainingMetadata({
  course_data,
  trainingMetadata,
  setTrainingMetadata,
}: Props) {
  const { courseData } = useSelector((state: any) => state.courses);
  const [searchIsActive, setSearchIsActive] = useState(false);

  console.log(trainingMetadata, "trainingMetadatatrainingMetadata");

  const [editCourse, { isLoading: createCourseLoading, isSuccess, error }] =
    useEditCourseMutation();

  const { isLoading, data, refetch } = useGetCoursesTitleQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setTrainingMetadata((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleObjectiveChange = (index: number, value: any) => {
    const updatedObjectives = { ...trainingMetadata };
    console.log(updatedObjectives, "-==-=-");
    updatedObjectives.objectives[index].title = value;
    setTrainingMetadata(updatedObjectives);
  };

  const handlePrerequisitesChange = (index: number, value: any) => {
    const updatedObjectives = { ...trainingMetadata };
    updatedObjectives.prerequisites[index].title = value;
    setTrainingMetadata(updatedObjectives);
  };

  const handleSkillsChange = (index: number, value: any) => {
    const updatedObjectives = { ...trainingMetadata };
    updatedObjectives.skills_covered[index].title = value;
    setTrainingMetadata(updatedObjectives);
  };

  const handleRemoveSkills = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };

    if (updatedTrainingMetadata.skills_covered.length > 0) {
      updatedTrainingMetadata.skills_covered.pop();

      setTrainingMetadata(updatedTrainingMetadata);
    }
  };

  const handleAddSkills = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };

    updatedTrainingMetadata.skills_covered.push({ title: "" });

    setTrainingMetadata(updatedTrainingMetadata);
  };

  const handleRemovePrerequisites = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };

    if (updatedTrainingMetadata.prerequisites.length > 0) {
      updatedTrainingMetadata.prerequisites.pop();

      setTrainingMetadata(updatedTrainingMetadata);
    }
  };

  const handleAddPrerequisites = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };

    updatedTrainingMetadata.prerequisites.push({ title: "" });

    setTrainingMetadata(updatedTrainingMetadata);
  };

  const handleRemoveObjective = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };

    if (updatedTrainingMetadata.objectives.length > 0) {
      updatedTrainingMetadata.objectives.pop();

      setTrainingMetadata(updatedTrainingMetadata);
    }
  };

  const handleAddObjectives = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };

    updatedTrainingMetadata.objectives.push({ title: "" });

    setTrainingMetadata(updatedTrainingMetadata);
  };

  const handleAudienceChange = (index: number, value: any) => {
    const updatedObjectives = { ...trainingMetadata };
    updatedObjectives.audience[index].title = value;
    setTrainingMetadata(updatedObjectives);
  };

  const handleRemoveAudience = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };

    if (updatedTrainingMetadata.audience.length > 0) {
      updatedTrainingMetadata.audience.pop();

      setTrainingMetadata(updatedTrainingMetadata);
    }
  };

  const handleAddAudience = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };

    updatedTrainingMetadata.audience.push({ title: "" });

    setTrainingMetadata(updatedTrainingMetadata);
  };

  const handleKeyFeaturesChange = (index: number, value: any) => {
    const updatedObjectives = { ...trainingMetadata };
    updatedObjectives.key_features[index].title = value;
    setTrainingMetadata(updatedObjectives);
  };

  const handleRemoveKeyFeatures = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };

    if (updatedTrainingMetadata.key_features.length > 0) {
      updatedTrainingMetadata.key_features.pop();

      setTrainingMetadata(updatedTrainingMetadata);
    }
  };

  const handleAddKeyFeatures = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };

    updatedTrainingMetadata.key_features.push({ title: "" });

    setTrainingMetadata(updatedTrainingMetadata);
  };

  const handleBenefitsChange = (index: number, value: any) => {
    const updatedObjectives = { ...trainingMetadata };
    updatedObjectives.benefits[index].title = value;
    setTrainingMetadata(updatedObjectives);
  };

  const handleRemoveBenefits = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };

    if (updatedTrainingMetadata.benefits.length > 0) {
      updatedTrainingMetadata.benefits.pop();

      setTrainingMetadata(updatedTrainingMetadata);
    }
  };

  const handleAddBenefits = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };

    updatedTrainingMetadata.benefits.push({ title: "" });

    setTrainingMetadata(updatedTrainingMetadata);
  };

  const handleOutcomesChange = (index: number, value: any) => {
    const updatedObjectives = { ...trainingMetadata };
    updatedObjectives.outcomes[index].title = value;
    setTrainingMetadata(updatedObjectives);
  };

  const handleRemoveOutcomes = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };

    if (updatedTrainingMetadata.outcomes.length > 0) {
      updatedTrainingMetadata.outcomes.pop();

      setTrainingMetadata(updatedTrainingMetadata);
    }
  };

  const handleAddOutcomes = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };

    updatedTrainingMetadata.outcomes.push({ title: "" });

    setTrainingMetadata(updatedTrainingMetadata);
  };
  const handleResourcesChange = (index: number, value: any) => {
    const updatedObjectives = { ...trainingMetadata };
    updatedObjectives.resources[index].title = value;
    setTrainingMetadata(updatedObjectives);
  };

  const handleRemoveResources = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };

    if (updatedTrainingMetadata.resources.length > 0) {
      updatedTrainingMetadata.resources.pop();

      setTrainingMetadata(updatedTrainingMetadata);
    }
  };

  const handleAddResources = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };

    updatedTrainingMetadata.resources.push({ title: "" });

    setTrainingMetadata(updatedTrainingMetadata);
  };

  const handleFaqsChange = (index: number, value: any, type: string) => {
    const updatedObjectives = { ...trainingMetadata };

    if (type === "question") {
      updatedObjectives.FAQs[index].question = value;
    } else if (type === "answer") {
      updatedObjectives.FAQs[index].answer = value;
    }
    setTrainingMetadata(updatedObjectives);
  };

  const handleRemoveFaqs = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };

    if (updatedTrainingMetadata.FAQs.length > 0) {
      updatedTrainingMetadata.FAQs.pop();

      setTrainingMetadata(updatedTrainingMetadata);
    }
  };

  const handleAddFaqs = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };

    updatedTrainingMetadata.FAQs.push({ question: "", answer: "" });

    setTrainingMetadata(updatedTrainingMetadata);
  };

  const addCurriculumSection = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };
    updatedTrainingMetadata.curriculum.push({
      title: "",
      videoSection: "",
      section_parts: [{ title: "" }],
    });
    setTrainingMetadata(updatedTrainingMetadata);
  };

  const removeCurriculumSection = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };
    if (updatedTrainingMetadata.curriculum.length > 0) {
      updatedTrainingMetadata.curriculum.pop();
      setTrainingMetadata(updatedTrainingMetadata);
    }
  };

  const handleShouldAttendChange = (index: number, value: any) => {
    const newWhoShouldAttend = [...trainingMetadata.who_should_attend];
    newWhoShouldAttend[index].title = value;
    setTrainingMetadata({
      ...trainingMetadata,
      who_should_attend: newWhoShouldAttend,
    });
  };

  const handleRemoveShouldAttend = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };
    if (updatedTrainingMetadata.who_should_attend.length > 0) {
      updatedTrainingMetadata.who_should_attend.pop();
      setTrainingMetadata(updatedTrainingMetadata);
    }
  };

  const handleAddShouldAttend = () => {
    const updatedTrainingMetadata = { ...trainingMetadata };
    updatedTrainingMetadata.who_should_attend.push({
      title: "",
    });
    setTrainingMetadata(updatedTrainingMetadata);
  };

  const handleCurriculumChange = (index: number, value: any) => {
    const newCurriculum = [...trainingMetadata.curriculum];
    newCurriculum[index].title = value;
    setTrainingMetadata({ ...trainingMetadata, curriculum: newCurriculum });
  };

  const handleSectionTitleChange = (
    curriculumIndex: number,
    sectionIndex: number,
    value: any
  ) => {
    const newCurriculum = [...trainingMetadata.curriculum];
    newCurriculum[curriculumIndex].section_parts[sectionIndex].title = value;
    setTrainingMetadata({ ...trainingMetadata, curriculum: newCurriculum });
  };

  const addCurriculumSectionTitle = (
    curriculumIndex: number,
    sectionIndex: number
  ) => {
    const updatedTrainingMetadata = { ...trainingMetadata };
    updatedTrainingMetadata.curriculum[curriculumIndex].section_parts.push({
      title: "",
    });
    setTrainingMetadata(updatedTrainingMetadata);
  };

  const removeCurriculumSectionTitle = (
    curriculumIndex: number,
    sectionIndex: number
  ) => {
    const updatedTrainingMetadata = { ...trainingMetadata };
    if (
      updatedTrainingMetadata.curriculum[curriculumIndex].section_parts.length >
      0
    ) {
      updatedTrainingMetadata.curriculum[curriculumIndex].section_parts.pop();
      setTrainingMetadata(updatedTrainingMetadata);
    }
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    handleCourseCreate();
  };

  const handleCourseCreate = async () => {
    const data = course_data;
    await editCourse({
      id: courseData?.course?._id,
      data,
    });
    toast.success("course metadata updated successfully");
  };

  return (
    <div className="overflow-auto h-[100%] relative">
      <form onSubmit={handleFormSubmit}>
        <div className="mt-2 h-[420px] overflow-auto pb-32">
          <div className="w-[100%] mt-4">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Headline
            </label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <input
                  autoComplete="off"
                  type="text"
                  value={trainingMetadata.headline}
                  onChange={handleChange}
                  name="headline"
                  id="headline"
                  className="bg-transparent w-[95%] border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
              </div>
              {!trainingMetadata?.headline && (
                <p className="text-red-600 text-sm">Headline is required</p>
              )}
            </div>
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Body
            </label>

            <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
              <textarea
                value={trainingMetadata.body}
                onChange={handleChange}
                name="body"
                id="body"
                className="bg-transparent w-full p-2 border-none rounded-[5px] h-[100px] outline-none text-[#292929] text-[14px] font-[500] font-Josefin"
                style={{ resize: "none" }}
              />
            </div>
            {!trainingMetadata?.body && (
              <p className="text-red-600 text-sm">Body is required</p>
            )}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Overview
            </label>
            <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
              <textarea
                value={trainingMetadata.overview}
                onChange={handleChange}
                name="overview"
                id="overview"
                className="bg-transparent w-full p-2 border-none rounded-[5px] h-[80px] outline-none text-[#292929] text-[14px] font-[500] font-Josefin"
                style={{ resize: "none" }}
              />
            </div>
            {!trainingMetadata?.body && (
              <p className="text-red-600 text-sm">Overview is required</p>
            )}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Preview Video
            </label>
            <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
              <input
                autoComplete="off"
                type="text"
                value={trainingMetadata.preview_video}
                onChange={handleChange}
                name="preview_video"
                id="preview_video"
                className="bg-transparent w-[95%] border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
              />
            </div>
            {!trainingMetadata?.preview_video && (
              <p className="text-red-600 text-sm">Preview Video is required</p>
            )}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Objectives
            </label>
            {trainingMetadata?.objectives?.map((obj: any, index: number) => {
              return (
                <>
                  <div className="flex items-center mt-2" key={obj}>
                    <input
                      autoComplete="off"
                      type="text"
                      value={obj.title}
                      onChange={(e) =>
                        handleObjectiveChange(index, e.target.value)
                      }
                      name="objectives"
                      id="objectives"
                      className="bg-transparent w-[90%] pl-2 border-2 left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                    />
                    <AiOutlineMinus
                      style={{
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                        color: "white",
                      }}
                      className="rounded-full bg-sky-800 p-2 ml-2"
                      onClick={handleRemoveObjective}
                    />
                    <AiOutlinePlus
                      style={{
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                        color: "white",
                      }}
                      className="rounded-full bg-sky-800 p-2 ml-2"
                      onClick={handleAddObjectives}
                    />
                  </div>

                  {!obj?.title?.length && (
                    <p className="text-red-600 text-sm">Body is required</p>
                  )}
                </>
              );
            })}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Prerequisites
            </label>
            {trainingMetadata?.prerequisites?.map((obj: any, index: number) => {
              return (
                <>
                  <div className="flex items-center mt-2" key={obj}>
                    <input
                      autoComplete="off"
                      type="text"
                      value={obj.title}
                      onChange={(e) =>
                        handlePrerequisitesChange(index, e.target.value)
                      }
                      name="prerequisites"
                      id="prerequisites"
                      className="bg-transparent w-[90%] pl-2 border-2 left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                    />
                    <AiOutlineMinus
                      style={{
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                        color: "white",
                      }}
                      className="rounded-full bg-sky-800 p-2 ml-2"
                      onClick={handleRemovePrerequisites}
                    />
                    <AiOutlinePlus
                      style={{
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                        color: "white",
                      }}
                      className="rounded-full bg-sky-800 p-2 ml-2"
                      onClick={handleAddPrerequisites}
                    />
                  </div>
                  {!obj?.title?.length && (
                    <p className="text-red-600 text-sm">field required</p>
                  )}
                </>
              );
            })}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Audience
            </label>
            {trainingMetadata?.audience?.map((obj: any, index: number) => {
              return (
                <>
                  <div className="flex items-center mt-2" key={obj}>
                    <input
                      autoComplete="off"
                      type="text"
                      value={obj.title}
                      onChange={(e) =>
                        handleAudienceChange(index, e.target.value)
                      }
                      name="prerequisites"
                      id="prerequisites"
                      className="bg-transparent w-[90%] pl-2 border-2 left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                    />
                    <AiOutlineMinus
                      style={{
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                        color: "white",
                      }}
                      className="rounded-full bg-sky-800 p-2 ml-2"
                      onClick={handleRemoveAudience}
                    />
                    <AiOutlinePlus
                      style={{
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                        color: "white",
                      }}
                      className="rounded-full bg-sky-800 p-2 ml-2"
                      onClick={handleAddAudience}
                    />
                  </div>
                  {!obj?.title?.length && (
                    <p className="text-red-600 text-sm">field required</p>
                  )}
                </>
              );
            })}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Skills Covered
            </label>
            {trainingMetadata?.skills_covered?.map(
              (obj: any, index: number) => {
                return (
                  <>
                    <div className="flex items-center mt-2" key={obj}>
                      <input
                        autoComplete="off"
                        type="text"
                        value={obj.title}
                        onChange={(e) =>
                          handleSkillsChange(index, e.target.value)
                        }
                        name="prerequisites"
                        id="prerequisites"
                        className="bg-transparent w-[90%] pl-2 border-2 left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                      />
                      <AiOutlineMinus
                        style={{
                          cursor: "pointer",
                          width: "35px",
                          height: "35px",
                          color: "white",
                        }}
                        className="rounded-full bg-sky-800 p-2 ml-2"
                        onClick={handleRemoveSkills}
                      />
                      <AiOutlinePlus
                        style={{
                          cursor: "pointer",
                          width: "35px",
                          height: "35px",
                          color: "white",
                        }}
                        className="rounded-full bg-sky-800 p-2 ml-2"
                        onClick={handleAddSkills}
                      />
                    </div>
                    {!obj?.title?.length && (
                      <p className="text-red-600 text-sm">field required</p>
                    )}
                  </>
                );
              }
            )}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Who Should Attend?
            </label>
            {trainingMetadata?.who_should_attend?.map(
              (obj: any, index: number) => {
                return (
                  <>
                    <div className="flex items-center mt-2" key={obj}>
                      <input
                        autoComplete="off"
                        type="text"
                        value={obj.title}
                        onChange={(e) =>
                          handleShouldAttendChange(index, e.target.value)
                        }
                        name="who_should_attend"
                        id="who_should_attend"
                        className="bg-transparent w-[90%] pl-2 border-2 left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                      />
                      <AiOutlineMinus
                        style={{
                          cursor: "pointer",
                          width: "35px",
                          height: "35px",
                          color: "white",
                        }}
                        className="rounded-full bg-sky-800 p-2 ml-2"
                        onClick={handleRemoveShouldAttend}
                      />
                      <AiOutlinePlus
                        style={{
                          cursor: "pointer",
                          width: "35px",
                          height: "35px",
                          color: "white",
                        }}
                        className="rounded-full bg-sky-800 p-2 ml-2"
                        onClick={handleAddShouldAttend}
                      />
                    </div>
                    {!obj?.title?.length && (
                      <p className="text-red-600 text-sm">field required</p>
                    )}
                  </>
                );
              }
            )}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Key Featured
            </label>
            {trainingMetadata?.key_features?.map((obj: any, index: number) => {
              return (
                <>
                  <div className="flex items-center mt-2" key={obj}>
                    <input
                      autoComplete="off"
                      type="text"
                      value={obj.title}
                      onChange={(e) =>
                        handleKeyFeaturesChange(index, e.target.value)
                      }
                      name="prerequisites"
                      id="prerequisites"
                      className="bg-transparent w-[90%] pl-2 border-2 left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                    />
                    <AiOutlineMinus
                      style={{
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                        color: "white",
                      }}
                      className="rounded-full bg-sky-800 p-2 ml-2"
                      onClick={handleRemoveKeyFeatures}
                    />
                    <AiOutlinePlus
                      style={{
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                        color: "white",
                      }}
                      className="rounded-full bg-sky-800 p-2 ml-2"
                      onClick={handleAddKeyFeatures}
                    />
                  </div>
                  {!obj?.title?.length && (
                    <p className="text-red-600 text-sm">field required</p>
                  )}
                </>
              );
            })}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Benifits
            </label>
            {trainingMetadata?.benefits?.map((obj: any, index: number) => {
              return (
                <>
                  <div className="flex items-center mt-2" key={obj}>
                    <input
                      autoComplete="off"
                      type="text"
                      value={obj.title}
                      onChange={(e) =>
                        handleBenefitsChange(index, e.target.value)
                      }
                      name="prerequisites"
                      id="prerequisites"
                      className="bg-transparent w-[90%] pl-2 border-2 left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                    />
                    <AiOutlineMinus
                      style={{
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                        color: "white",
                      }}
                      className="rounded-full bg-sky-800 p-2 ml-2"
                      onClick={handleRemoveBenefits}
                    />
                    <AiOutlinePlus
                      style={{
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                        color: "white",
                      }}
                      className="rounded-full bg-sky-800 p-2 ml-2"
                      onClick={handleAddBenefits}
                    />
                  </div>
                  {!obj?.title?.length && (
                    <p className="text-red-600 text-sm">field required</p>
                  )}
                </>
              );
            })}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Resources
            </label>
            {trainingMetadata?.resources?.map((obj: any, index: number) => {
              return (
                <>
                  <div className="flex items-center mt-2" key={obj}>
                    <input
                      autoComplete="off"
                      type="text"
                      value={obj.title}
                      onChange={(e) =>
                        handleResourcesChange(index, e.target.value)
                      }
                      name="prerequisites"
                      id="prerequisites"
                      className="bg-transparent w-[90%] pl-2 border-2 left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                    />
                    <AiOutlineMinus
                      style={{
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                        color: "white",
                      }}
                      className="rounded-full bg-sky-800 p-2 ml-2"
                      onClick={handleRemoveResources}
                    />
                    <AiOutlinePlus
                      style={{
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                        color: "white",
                      }}
                      className="rounded-full bg-sky-800 p-2 ml-2"
                      onClick={handleAddResources}
                    />
                  </div>
                  {!obj?.title?.length && (
                    <p className="text-red-600 text-sm">field required</p>
                  )}
                </>
              );
            })}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Outcomes
            </label>
            {trainingMetadata?.outcomes?.map((obj: any, index: number) => {
              return (
                <>
                  <div className="flex items-center mt-2" key={obj}>
                    <input
                      autoComplete="off"
                      type="text"
                      value={obj.title}
                      onChange={(e) =>
                        handleOutcomesChange(index, e.target.value)
                      }
                      name="prerequisites"
                      id="prerequisites"
                      className="bg-transparent w-[90%] pl-2 border-2 left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                    />
                    <AiOutlineMinus
                      style={{
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                        color: "white",
                      }}
                      className="rounded-full bg-sky-800 p-2 ml-2"
                      onClick={handleRemoveOutcomes}
                    />
                    <AiOutlinePlus
                      style={{
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                        color: "white",
                      }}
                      className="rounded-full bg-sky-800 p-2 ml-2"
                      onClick={handleAddOutcomes}
                    />
                  </div>
                  {!obj?.title?.length && (
                    <p className="text-red-600 text-sm">field required</p>
                  )}
                </>
              );
            })}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Certification Text
            </label>
            <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
              <textarea
                value={trainingMetadata.certification_text}
                onChange={handleChange}
                id="certification_text"
                name="certification_text"
                className="bg-transparent w-full p-2 border-none rounded-[5px] h-[90px] outline-none text-[#292929] text-[14px] font-[500] font-Josefin"
                style={{ resize: "none" }}
              />
            </div>
            {!trainingMetadata.certification_text && (
              <p className="text-red-600 text-sm">field required</p>
            )}
          </div>
          <div className="w-[23%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Certification Image
            </label>
            <div className="relative h-[45px] ">
              <div className="flex bg-transparent w-full h-full rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <label className="block rounded-md h-full">
                  <span className="sr-only">Choose file</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={() => {}}
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
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              FAQs
            </label>
            {trainingMetadata?.FAQs?.map((obj: any, index: number) => {
              return (
                <div className="flex flex-col mt-2" key={obj}>
                  <div className="flex items-center">
                    <input
                      autoComplete="off"
                      type="text"
                      value={obj.question}
                      onChange={(e) =>
                        handleFaqsChange(index, e.target.value, "question")
                      }
                      name="prerequisites"
                      id="prerequisites"
                      className="bg-transparent w-[90%] pl-2 border-2 left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                    />
                    <AiOutlineMinus
                      style={{
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                        color: "white",
                      }}
                      className="rounded-full bg-sky-800 p-2 ml-2"
                      onClick={handleRemoveFaqs}
                    />
                    <AiOutlinePlus
                      style={{
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                        color: "white",
                      }}
                      className="rounded-full bg-sky-800 p-2 ml-2"
                      onClick={handleAddFaqs}
                    />
                  </div>

                  <div className="block mt-2">
                    <div className="flex items-center">
                      <textarea
                        value={obj.answer}
                        onChange={(e) =>
                          handleFaqsChange(index, e.target.value, "answer")
                        }
                        className="bg-transparent w-[85%] pl-2 border-2 rounded-[5px] h-[90px] outline-none text-[#292929] text-[14px] font-[500] font-Josefin"
                        style={{ resize: "none", marginLeft: "50px" }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Curriculum
            </label>
            {trainingMetadata?.curriculum?.map((obj: any, index: number) => {
              return (
                <div className="flex flex-col mt-2" key={obj}>
                  <div className="flex items-center mt-4">
                    <input
                      autoComplete="off"
                      type="text"
                      value={obj.title}
                      onChange={(e) =>
                        handleCurriculumChange(index, e.target.value)
                      }
                      className="bg-transparent w-[90%] pl-2 border-2 left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                    />
                    <AiOutlineMinus
                      style={{
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                        color: "white",
                      }}
                      className="rounded-full bg-sky-800 p-2 ml-2"
                      onClick={removeCurriculumSection}
                    />
                    <AiOutlinePlus
                      style={{
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                        color: "white",
                      }}
                      className="rounded-full bg-sky-800 p-2 ml-2"
                      onClick={addCurriculumSection}
                    />
                  </div>
                  {obj.section_parts.map((item: any, i: number) => (
                    <div className="block mt-2" key={i}>
                      <div className="flex items-center">
                        <input
                          autoComplete="off"
                          type="text"
                          value={item.title}
                          onChange={(e) =>
                            handleSectionTitleChange(index, i, e.target.value)
                          }
                          className="bg-transparent w-[85%] pl-2 border-2 rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                          style={{ marginLeft: "50px" }}
                        />
                        <AiOutlineMinus
                          style={{
                            cursor: "pointer",
                            width: "35px",
                            height: "35px",
                            color: "white",
                          }}
                          className="rounded-full bg-sky-800 p-2 ml-2"
                          onClick={() => removeCurriculumSectionTitle(index, i)}
                        />
                        <AiOutlinePlus
                          style={{
                            cursor: "pointer",
                            width: "35px",
                            height: "35px",
                            color: "white",
                          }}
                          className="rounded-full bg-sky-800 p-2 ml-2"
                          onClick={() => addCurriculumSectionTitle(index, i)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <div className="absolute bottom-0 right-4 bg-gray-100 w-full h-20 flex justify-end items-center pb-2">
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            style={{ position: "absolute", bottom: "1rem", right: "1rem" }}
            type="submit"
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
      </form>
    </div>
  );
}
