/* eslint-disable @next/next/no-img-element */
import { Calendar, Clock } from "lucide-react";
import { BiSolidCertification } from "react-icons/bi";

interface CourseDetailsProps {
  durationHours: number;
  enrolledStudents?: number;
  certification?: {
    title: string;
  };
}

const CourseDetails: React.FC<CourseDetailsProps> = ({
  durationHours,
  enrolledStudents = 1200, // Default random value
  certification,
}) => {
  return (
    <section className="py-8 bg-card rounded-lg shadow-lg px-10 relative z-40 -mt-20 w-[80vw] flex justify-between m-auto min-h-[250px]">
      {/* Left Section: Course Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 w-1/2">
        <div className="flex items-center gap-x-3">
          <Clock className="w-6 h-6 text-indigo-500" />
          <div>
            <p className="font-semibold">Duration</p>
            <p className="text-muted-foreground text-lg">
              {durationHours} Hours
            </p>
          </div>
        </div>

        <div className="flex items-center gap-x-3">
          <Calendar className="w-6 h-6 text-indigo-500" />
          <div>
            <p className="font-semibold">Enrolled Students</p>
            <p className="text-muted-foreground text-lg">
              {enrolledStudents}+ Students
            </p>
          </div>
        </div>
      </div>

      {/* Right Section: Certification */}
      <div className="w-1/2 flex flex-col items-center text-center">
        <p className="font-semibold flex items-center gap-x-3 text-lg">
          <BiSolidCertification className="w-6 h-6 text-blue-500" />
          Certification
        </p>
        {certification?.title && (
          <p className="font-semibold text-lg mt-2">{certification.title}</p>
        )}
        <img
          src="/assets/certificate.png"
          className="w-3/4 max-h-40 object-cover rounded-lg mt-4"
          alt="Certification"
        />
      </div>
    </section>
  );
};

export default CourseDetails;
