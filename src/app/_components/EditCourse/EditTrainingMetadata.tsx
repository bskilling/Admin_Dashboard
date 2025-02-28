"use client";

import {
  useEditCourseMutation,
  useGetCoursesTitleQuery,
} from "@/src/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { ThreeCircles } from "react-loader-spinner";

export default function EditTrainingMetadata({
  courseData,
  setCourseData,
  setActive,
}: any) {
  const { isLoading, data, refetch } = useGetCoursesTitleQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [editCourse, { isLoading: createCourseLoading, isSuccess, error }] =
    useEditCourseMutation();

  const [searchIsActive, setSearchIsActive] = useState(false);
  const [objectivesData, setObjectives] = useState(
    courseData?.training_metadata?.objectives || [{ title: "" }]
  );
  const [prerequisitesData, setPrerequisites] = useState(
    courseData?.training_metadata?.prerequisites || [{ title: "" }]
  );
  const [audienceData, setAudience] = useState(
    courseData?.training_metadata?.audience || [{ title: "" }]
  );
  const [skillscoveredData, setSkillscovered] = useState(
    courseData?.training_metadata?.skills_covered || [{ title: "" }]
  );

  const [whoShouldAttendData, setWhoShouldAttend] = useState(
    courseData?.training_metadata?.who_should_attend || [{ title: "" }]
  );

  const [keyFeaturesData, setKeyFeatures] = useState(
    courseData?.training_metadata?.key_features || [{ title: "" }]
  );

  const [benefitsData, setBenefits] = useState(
    courseData?.training_metadata?.benefits || [{ title: "" }]
  );

  const [resourcesData, setResources] = useState(
    courseData?.training_metadata?.resources || [{ title: "" }]
  );

  const [outcomesData, setOutcomes] = useState(
    courseData?.training_metadata?.outcomes || [{ title: "" }]
  );

  const [FAQsData, setFAQs] = useState(
    courseData?.training_metadata?.FAQs || [{ question: "", answer: "" }]
  );

  const [curriculumData, setCurriculum] = useState(
    courseData?.training_metadata?.curriculum || [
      { title: "", section_parts: [{ title: "" }] },
    ]
  );

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    handleCourseCreate();
    if (isSuccess) {
      setActive(2);
    }
  };

  const handleCourseCreate = async () => {
    const formattedFAQs = FAQsData.map((f: any) => ({
      question: f.question,
      answer: f.answer,
    }));

    const formattedCurriculum = curriculumData.map((c: any) => ({
      title: c.title,
      section_parts: c?.section_parts?.map((sp: any) => ({
        title: sp.title,
      })),
    }));

    const formattedobjectives = objectivesData.map((objective: any) => ({
      title: objective.title,
    }));

    const formattedWhoShouldAttend = whoShouldAttendData.map((obj: any) => ({
      title: obj.title,
    }));

    const formattedBenefits = benefitsData.map((ben: any) => ({
      title: ben.title,
    }));

    const formattedResources = resourcesData.map((res: any) => ({
      title: res.title,
    }));

    const formattedPrerequisites = prerequisitesData.map((pre: any) => ({
      title: pre.title,
    }));

    const formattedAudience = audienceData.map((aud: any) => ({
      title: aud.title,
    }));

    const formattedSkillsCovered = skillscoveredData.map((skill: any) => ({
      title: skill.title,
    }));

    const formattedOutcomes = outcomesData.map((data: any) => ({
      title: data.title,
    }));

    const updatedCourseData = { ...courseData };

    const updatedTrainingMetadata = {
      ...updatedCourseData.training_metadata,
      objectives: formattedobjectives,
      prerequisites: formattedPrerequisites,
      audience: formattedAudience,
      skills_covered: formattedSkillsCovered,
      benefits: formattedBenefits,
      resources: formattedResources,
      outcomes: formattedOutcomes,
      FAQs: formattedFAQs,
      curriculum: formattedCurriculum,
      who_should_attend: formattedWhoShouldAttend,
    };

    updatedCourseData.training_metadata = updatedTrainingMetadata;

    await editCourse({
      id: courseData?._id,
      data: updatedCourseData,
    });

    toast.success("Course Metadata updated successfully");
  };

  const handleSectionTitleChange = (
    curriculumIndex: number,
    sectionIndex: number,
    value: any
  ) => {
    let newCurriculum = [...curriculumData];
    newCurriculum = JSON.parse(JSON.stringify(newCurriculum));
    newCurriculum[curriculumIndex].section_parts[sectionIndex].title = value;
    setCurriculum(newCurriculum);
  };

  const removeCurriculumSectionTitle = (
    curriculumIndex: number,
    sectionIndex: number
  ) => {
    let updatedTrainingMetadata = [...curriculumData];
    updatedTrainingMetadata = JSON.parse(
      JSON.stringify(updatedTrainingMetadata)
    );
    if (updatedTrainingMetadata[curriculumIndex].section_parts.length > 0) {
      updatedTrainingMetadata[curriculumIndex].section_parts.pop();
      setCurriculum(updatedTrainingMetadata);
    }
  };

  const addCurriculumSectionTitle = (
    curriculumIndex: number,
    sectionIndex: number
  ) => {
    let updatedTrainingMetadata = [...curriculumData];
    updatedTrainingMetadata = JSON.parse(
      JSON.stringify(updatedTrainingMetadata)
    );
    updatedTrainingMetadata[curriculumIndex].section_parts.push({
      title: "",
    });
    setCurriculum(updatedTrainingMetadata);
  };

  const handleCurriculumChange = (index: number, value: any) => {
    let newCurriculum = [...curriculumData];
    newCurriculum = JSON.parse(JSON.stringify(newCurriculum));
    newCurriculum[index].title = value;
    setCurriculum(newCurriculum);
  };

  const handleAddCurriculum = () => {
    setCurriculum([
      ...curriculumData,
      { title: "", section_parts: [{ title: "" }] },
    ]);
  };

  const removeCurriculumSection = () => {
    const updatedCurriculum = [...curriculumData];

    if (updatedCurriculum.length > 0) {
      updatedCurriculum.pop();

      setCurriculum(updatedCurriculum);
    }
  };

  const handleFaqsChange = (index: number, value: any, type: string) => {
    let updatedFAQs = [...FAQsData];
    updatedFAQs = JSON.parse(JSON.stringify(updatedFAQs));
    if (type === "question") {
      updatedFAQs[index].question = value;
    } else if (type === "answer") {
      updatedFAQs[index].answer = value;
    }
    setFAQs(updatedFAQs);
  };

  const handleAddFaqs = () => {
    setFAQs([...FAQsData, { question: "", answer: "" }]);
  };

  const handleRemoveFaqs = () => {
    const updatedFAQs = [...FAQsData];

    if (updatedFAQs.length > 0) {
      updatedFAQs.pop();

      setFAQs(updatedFAQs);
    }
  };

  const handleOutcomesChange = (index: number, value: any) => {
    let updatedOutcomes = [...outcomesData];
    updatedOutcomes = JSON.parse(JSON.stringify(updatedOutcomes));
    updatedOutcomes[index].title = value;
    setOutcomes(updatedOutcomes);
  };

  const handleAddOutcomes = () => {
    setOutcomes([...outcomesData, { title: "" }]);
  };

  const handleRemoveOutcomes = () => {
    const updatedOutcomes = [...outcomesData];

    if (updatedOutcomes.length > 0) {
      updatedOutcomes.pop();

      setOutcomes(updatedOutcomes);
    }
  };

  const handleResourcesChange = (index: number, value: any) => {
    let updatedresources = [...resourcesData];
    updatedresources = JSON.parse(JSON.stringify(updatedresources));
    updatedresources[index].title = value;
    setResources(updatedresources);
  };

  const handleAddResources = () => {
    setResources([...resourcesData, { title: "" }]);
  };

  const handleRemoveResources = () => {
    const updatedresources = [...resourcesData];

    if (updatedresources.length > 0) {
      updatedresources.pop();

      setResources(updatedresources);
    }
  };

  const handleBenefitsChange = (index: number, value: any) => {
    let updatedBenefits = [...benefitsData];
    updatedBenefits = JSON.parse(JSON.stringify(updatedBenefits));
    updatedBenefits[index].title = value;
    setBenefits(updatedBenefits);
  };

  const handleAddBenefits = () => {
    setBenefits([...benefitsData, { title: "" }]);
  };

  const handleRemoveBenefits = () => {
    const updatedBenefits = [...benefitsData];

    if (updatedBenefits.length > 0) {
      updatedBenefits.pop();

      setKeyFeatures(updatedBenefits);
    }
  };

  const handleKeyFeaturesChange = (index: number, value: any) => {
    let updatedKeyFeatures = [...keyFeaturesData];
    updatedKeyFeatures = JSON.parse(JSON.stringify(updatedKeyFeatures));
    updatedKeyFeatures[index].title = value;
    setKeyFeatures(updatedKeyFeatures);
  };

  const handleAddKeyFeatures = () => {
    setKeyFeatures([...keyFeaturesData, { title: "" }]);
  };

  const handleRemoveKeyFeatures = () => {
    const updatedKeyFeatures = [...keyFeaturesData];

    if (updatedKeyFeatures.length > 0) {
      updatedKeyFeatures.pop();

      setKeyFeatures(updatedKeyFeatures);
    }
  };

  const handleSkillsChange = (index: number, value: any) => {
    let updatedSkills = [...skillscoveredData];
    updatedSkills = JSON.parse(JSON.stringify(updatedSkills));
    updatedSkills[index].title = value;
    setSkillscovered(updatedSkills);
  };

  const handleAddSkills = () => {
    setSkillscovered([...skillscoveredData, { title: "" }]);
  };

  const handleRemoveSkills = () => {
    const updatedSkills = [...skillscoveredData];

    if (updatedSkills.length > 0) {
      updatedSkills.pop();

      setSkillscovered(updatedSkills);
    }
  };

  const handleAudienceChange = (index: number, value: any) => {
    let updatedAudience = [...audienceData];
    updatedAudience = JSON.parse(JSON.stringify(updatedAudience));
    updatedAudience[index].title = value;
    setAudience(updatedAudience);
  };

  const handleAddAudience = () => {
    setAudience([...audienceData, { title: "" }]);
  };

  const handleRemoveAudience = () => {
    const updatedAudience = [...audienceData];

    if (updatedAudience.length > 0) {
      updatedAudience.pop();

      setAudience(updatedAudience);
    }
  };

  const handlePrerequisitesChange = (index: number, value: any) => {
    let updatedPrerequisites = [...prerequisitesData];
    updatedPrerequisites = JSON.parse(JSON.stringify(updatedPrerequisites));
    updatedPrerequisites[index].title = value;
    setPrerequisites(updatedPrerequisites);
  };

  const handleAddPrerequisites = () => {
    setPrerequisites([...prerequisitesData, { title: "" }]);
  };

  const handleRemovePrerequisites = () => {
    const updatedPrerequisites = [...prerequisitesData];

    if (updatedPrerequisites.length > 0) {
      updatedPrerequisites.pop();

      setPrerequisites(updatedPrerequisites);
    }
  };

  const handleObjectiveChange = (index: number, value: any) => {
    let updatedObjectives = [...objectivesData];
    updatedObjectives = JSON.parse(JSON.stringify(updatedObjectives));
    updatedObjectives[index].title = value;
    setObjectives(updatedObjectives);
  };

  const handleAddObjectives = () => {
    setObjectives([...objectivesData, { title: "" }]);
  };

  const handleRemoveObjective = () => {
    const updatedObjectives = [...objectivesData];

    if (updatedObjectives.length > 0) {
      updatedObjectives.pop();

      setObjectives(updatedObjectives);
    }
  };

  return (
    <div className="overflow-auto h-[100%]">
      <form onSubmit={handleFormSubmit}>
        <div className="mt-2 h-[420px] overflow-auto pb-20">
          <div className="w-[100%] mt-4">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Headline
            </label>
            <div className="relative h-[45px]">
              <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
                <input
                  autoComplete="off"
                  type="text"
                  value={courseData?.training_metadata?.headline || ""}
                  onChange={(e) => {
                    setCourseData((prevData: any) => ({
                      ...prevData,
                      training_metadata: {
                        ...prevData.training_metadata,
                        headline: e.target.value,
                      },
                    }));
                  }}
                  name="headline"
                  id="headline"
                  className="bg-transparent w-[95%] border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
                />
              </div>
            </div>
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Body
            </label>

            <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
              <textarea
                value={courseData?.training_metadata?.body || ""}
                onChange={(e) => {
                  setCourseData((prevData: any) => ({
                    ...prevData,
                    training_metadata: {
                      ...prevData.training_metadata,
                      body: e.target.value,
                    },
                  }));
                }}
                name="body"
                id="body"
                className="bg-transparent w-full p-2 border-none rounded-[5px] h-[100px] outline-none text-[#292929] text-[14px] font-[500] font-Josefin"
                style={{ resize: "none" }}
              />
            </div>
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Overview
            </label>
            <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
              <textarea
                value={courseData?.training_metadata?.overview || ""}
                onChange={(e) => {
                  setCourseData((prevData: any) => ({
                    ...prevData,
                    training_metadata: {
                      ...prevData.training_metadata,
                      overview: e.target.value,
                    },
                  }));
                }}
                name="overview"
                id="overview"
                className="bg-transparent w-full p-2 border-none rounded-[5px] h-[80px] outline-none text-[#292929] text-[14px] font-[500] font-Josefin"
                style={{ resize: "none" }}
              />
            </div>
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Preview Video
            </label>
            <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
              <input
                autoComplete="off"
                type="text"
                value={courseData?.training_metadata?.preview_video || ""}
                onChange={(e) => {
                  setCourseData((prevData: any) => ({
                    ...prevData,
                    training_metadata: {
                      ...prevData.training_metadata,
                      preview_video: e.target.value,
                    },
                  }));
                }}
                name="preview_video"
                id="preview_video"
                className="bg-transparent w-[95%] border-none left-[50px] rounded-[5px] h-[45px] outline-none text-black text-[14px] font-[500] font-Josefin"
              />
            </div>
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Objectives
              {objectivesData?.map((obj: any, index: number) => {
                return (
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
                    {index === objectivesData.length - 1 && (
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
                    )}
                  </div>
                );
              })}
            </label>
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Prerequisites
            </label>

            {prerequisitesData?.map((obj: any, index: number) => {
              return (
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
              );
            })}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Audience
            </label>

            {audienceData?.map((obj: any, index: number) => {
              return (
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
              );
            })}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Skills Covered
            </label>
            {skillscoveredData?.map((obj: any, index: number) => {
              return (
                <div className="flex items-center mt-2" key={obj}>
                  <input
                    autoComplete="off"
                    type="text"
                    value={obj.title}
                    onChange={(e) => handleSkillsChange(index, e.target.value)}
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
              );
            })}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Who Should Attend ?
            </label>
            {whoShouldAttendData?.map((obj: any, index: number) => {
              return (
                <div className="flex items-center mt-2" key={obj}>
                  <input
                    autoComplete="off"
                    type="text"
                    value={obj.title}
                    onChange={(e) => {
                      let updatedWhoShouldAttendData = [...whoShouldAttendData];
                      updatedWhoShouldAttendData = JSON.parse(
                        JSON.stringify(updatedWhoShouldAttendData)
                      );
                      updatedWhoShouldAttendData[index].title = e.target.value;
                      setWhoShouldAttend(updatedWhoShouldAttendData);
                    }}
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
                    onClick={() => {
                      const updatedWhoShouldAttendData = [
                        ...whoShouldAttendData,
                      ];

                      if (updatedWhoShouldAttendData.length > 0) {
                        updatedWhoShouldAttendData.pop();

                        setWhoShouldAttend(updatedWhoShouldAttendData);
                      }
                    }}
                  />
                  <AiOutlinePlus
                    style={{
                      cursor: "pointer",
                      width: "35px",
                      height: "35px",
                      color: "white",
                    }}
                    className="rounded-full bg-sky-800 p-2 ml-2"
                    onClick={() => {
                      setWhoShouldAttend([
                        ...whoShouldAttendData,
                        { title: "" },
                      ]);
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Key Featured
            </label>
            {keyFeaturesData?.map((obj: any, index: number) => {
              return (
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
              );
            })}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Benefits
            </label>
            {benefitsData?.map((obj: any, index: number) => {
              return (
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
              );
            })}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Resources
            </label>
            {resourcesData?.map((obj: any, index: number) => {
              return (
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
              );
            })}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Outcomes
            </label>
            {outcomesData?.map((obj: any, index: number) => {
              return (
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
              );
            })}
          </div>
          <div className="w-[100%] mt-10">
            <label className="block mb-2 text-sm font-[700] text-gray-600">
              Certification Text
            </label>
            <div className="flex bg-transparent w-[100%] bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
              <textarea
                value={courseData?.training_metadata?.certification_text || ""}
                onChange={(e) => {
                  setCourseData((prevData: any) => ({
                    ...prevData,
                    training_metadata: {
                      ...prevData.training_metadata,
                      certification_text: e.target.value,
                    },
                  }));
                }}
                className="bg-transparent w-full p-2 border-none rounded-[5px] h-[90px] outline-none text-[#292929] text-[14px] font-[500] font-Josefin"
                style={{ resize: "none" }}
              />
            </div>
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
            {FAQsData?.map((obj: any, index: number) => {
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
            {curriculumData?.map((obj: any, index: number) => {
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
                      onClick={handleAddCurriculum}
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
        <div className="absolute bottom-0 right-0 bg-gray-100 w-full h-20 flex justify-end items-center pb-2">
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
