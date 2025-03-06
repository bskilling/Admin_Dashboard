import React from "react";
import { FaBullseye, FaRocket } from "react-icons/fa";

interface OutcomesProps {
  outcomes: string[];
}

const Outcomes: React.FC<OutcomesProps> = ({ outcomes }) => {
  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900 rounded-xl shadow-md border border-gray-300 mt-7">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <FaRocket className="text-green-600" /> Learning Outcomes
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {outcomes.map((outcome, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-white border border-gray-300 rounded-md shadow-sm hover:shadow-md transition"
          >
            <FaBullseye className="text-green-600 text-lg" />
            <span className="text-gray-700 text-sm font-medium">{outcome}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Outcomes;
