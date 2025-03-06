import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ICourse } from "./types";

interface HeroSectionProps {
  category?: ICourse["category"];
  title: string;
  description: string;
  bannerImage: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  category,
  title,
  description,
  bannerImage,
}) => {
  return (
    <section
      id="hero"
      className={cn(
        "relative w-full min-h-[600px] bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] flex justify-center items-center overflow-hidden rounded-xl shadow-xl"
      )}
    >
      {/* Decorative Background Elements */}
      <div className="absolute -top-12 left-12 w-32 h-32 bg-[#FFD166] rounded-full opacity-30 blur-lg"></div>
      <div className="absolute -bottom-12 right-12 w-28 h-28 bg-[#06D6A0] rounded-full opacity-30 blur-lg"></div>
      <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-[#118AB2] rounded-full opacity-40 blur-lg"></div>
      <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-[#EF476F] rounded-full opacity-40 blur-lg"></div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto grid md:grid-cols-2 gap-10 w-[85vw] py-16">
        {/* Left Column: Course Details */}
        <div className="space-y-6 text-[#FCEFEF] max-w-lg">
          {category && (
            <span className="inline-block bg-white text-[#118AB2] px-4 py-2 rounded-full text-sm font-semibold shadow-md">
              {category?.name}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            {title}
          </h1>
          <p className="text-lg text-[#E5E5E5] opacity-90">{description}</p>

          <div className="flex gap-5 mt-6">
            <Button className="bg-white text-[#118AB2] px-6 py-3 rounded-lg font-semibold hover:bg-[#FFD166] transition">
              Apply Now
            </Button>
            <Button className="border-none bg-[#118AB2] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#FFD166] hover:text-[#118AB2] transition">
              Get Syllabus
            </Button>
          </div>
        </div>

        {/* Right Column: Course Banner Image */}
        <div className="relative w-full flex justify-center">
          <Image
            width={600}
            height={600}
            src={bannerImage}
            alt="Course Banner"
            className="w-full max-h-96 rounded-lg object-cover shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};
