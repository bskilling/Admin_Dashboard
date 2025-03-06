import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineStar } from "react-icons/md";

interface HighlightsProps {
  highlights: string[];
}

const Highlights: React.FC<HighlightsProps> = ({ highlights }) => {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md mt-7">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <MdOutlineStar className="text-blue-500" /> Course Highlights
      </h2>

      <ul className="space-y-3">
        {highlights.map((highlight, index) => (
          <li
            key={index}
            className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition"
          >
            <FaCheckCircle className="text-blue-500 text-lg" />
            <span className="text-gray-700 text-sm font-medium">
              {highlight}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Highlights;
