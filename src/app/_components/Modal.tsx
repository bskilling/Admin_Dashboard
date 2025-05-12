import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import TrainingDetails from './CreateCourse/TrainingDetails';
import TrainingMetadata from './CreateCourse/TrainingMetadata';
import TrainingBatches from './CreateCourse/TrainingBatches';
import { useSelector } from 'react-redux';

interface ModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

const Modal = ({ isOpen, handleClose }: ModalProps) => {
  const { courseData: createCourseData } = useSelector((state: any) => state.courses);
  const [active, setActive] = useState(0);
  const [isCourseCreated, setIsCourseCreated] = useState(false);

  const [trainingMetadata, setTrainingMetadata] = useState({
    headline: '',
    body: '',
    overview: '',
    preview_video: '',
    preview_image: '',
    objectives: [{ title: '' }],
    prerequisites: [{ title: '' }],
    audience: [{ title: '' }],
    skills_covered: [{ title: '' }],
    key_features: [{ title: '' }],
    benefits: [{ title: '' }],
    resources: [{ title: '' }],
    outcomes: [{ title: '' }],
    certification_text: '',
    certification_image: '',
    FAQs: [{ question: '', answer: '' }],
    curriculum: [{ title: '', videoSection: '', section_parts: [{ title: '' }] }],
    who_should_attend: [{ title: '' }],
  });

  const [trainingBatchesData, setTrainingBatchesData] = useState({
    batch_name: '',
    isPaid: false,
    trainer: '',
    start_time: '',
    enrollment_end_date: '',
    end_date: '',
    capacity: '',
    batch_status: '',
    description: '',
  });

  const [courseData, setCourseData] = useState({
    title: '',
    category: '',
    duration: '',
    level: '',
    language: '',
    owned_by: '',
    endorsed_by: '',
    training_mode: '',
    description: '',
    assessment_required: false,
    isPaid: false,
    preview_image_uri: '',
    file_attach: '',
    assessment: '',
    price: '',
    currency: '',
    discount: '',
    coupon_code: '',
    training_metadata: trainingMetadata,
    trainng_batches: trainingBatchesData,
  });

  useEffect(() => {
    setCourseData(prev => ({
      ...prev,
      training_metadata: trainingMetadata,
    }));
  }, [trainingMetadata]);

  useEffect(() => {
    setCourseData(prev => ({
      ...prev,
      training_batches: trainingBatchesData,
    }));
  }, [trainingBatchesData]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return (): void => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="w-[80%] flex flex-col relative z-50 overflow-y-hidden rounded-md bg-white">
        <div className=" py-3 px-8 rounded">
          <div className="border-b-2 h-10">
            <div className="flex justify-around gap-1 h-full items-center">
              <div
                className={`text-gray-400 font-[600] cursor-pointer h-full ${
                  active === 0 ? 'border-b-4 border-b-sky-950' : ''
                }`}
                onClick={() => setActive(0)}
              >
                Training Details
              </div>
              <div
                className={`${
                  isCourseCreated ? 'text-gray-400' : 'text-gray-300'
                } font-[600] sticky top-0 cursor-pointer h-full ${
                  active === 1 ? 'border-b-4 border-b-sky-950' : ''
                }`}
                onClick={() => {
                  if (isCourseCreated) {
                    setActive(1);
                  }
                }}
              >
                Training Metadata
              </div>
              <div
                className={`${
                  isCourseCreated ? 'text-gray-400' : 'text-gray-300'
                } font-[600] sticky top-0 cursor-pointer h-full ${
                  active === 2 ? 'border-b-4 border-b-sky-950' : ''
                }`}
                onClick={() => {
                  if (isCourseCreated) {
                    setActive(2);
                  }
                }}
              >
                Training Batches
              </div>
              <div
                className={`${
                  isCourseCreated ? 'text-gray-400' : 'text-gray-300'
                } font-[600] sticky top-0 cursor-pointer h-full ${
                  active === 3 ? 'border-b-4 border-b-sky-950' : ''
                }`}
                onClick={() => {
                  if (isCourseCreated) {
                    setActive(3);
                  }
                }}
              >
                Batch Sessions
              </div>
              <div
                className={`${
                  isCourseCreated ? 'text-gray-400' : 'text-gray-300'
                } font-[600] sticky top-0 cursor-pointer h-full ${
                  active === 4 ? 'border-b-4 border-b-sky-950' : ''
                }`}
                onClick={() => {
                  if (isCourseCreated) {
                    setActive(4);
                  }
                }}
              >
                Batch Students
              </div>
              <div
                className={`${
                  isCourseCreated ? 'text-gray-400' : 'text-gray-300'
                } font-[600] sticky top-0 cursor-pointer h-full ${
                  active === 5 ? 'border-b-4 border-b-sky-950' : ''
                }`}
                onClick={() => {
                  if (isCourseCreated) {
                    setActive(5);
                  }
                }}
              >
                Batch Attendance
              </div>
              <div className="h-full">
                <button
                  className="text-white border-2 border-sky-800 rounded-full"
                  onClick={handleClose}
                >
                  <MdClose size={20} className="text-sky-800" />
                </button>
              </div>
            </div>
          </div>
          <div className="h-[100%]">
            {active === 0 && (
              <TrainingDetails
                setIsCourseCreated={setIsCourseCreated}
                courseData={courseData}
                setCourseData={setCourseData}
              />
            )}
            {active === 1 && isCourseCreated && (
              <TrainingMetadata
                course_data={courseData}
                trainingMetadata={trainingMetadata}
                setTrainingMetadata={setTrainingMetadata}
              />
            )}
            {active === 2 && (
              <TrainingBatches
                course_data={courseData}
                trainingBatchesData={trainingBatchesData}
                setTrainingBatchesData={setTrainingBatchesData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
