import { useState } from "react";
import { Briefcase, Users, Building, Globe } from "lucide-react";

const businessTypes = [
  {
    id: "b2b",
    title: "B2B",
    fullForm: "Business-to-Business",
    icon: <Briefcase className="w-10 h-10 text-primary" />,
    placeholder: "Add B2B details here...",
  },
  {
    id: "b2c",
    title: "B2C",
    fullForm: "Business-to-Consumer",
    icon: <Users className="w-10 h-10 text-primary" />,
    placeholder: "Add B2C details here...",
  },
  {
    id: "b2g",
    title: "B2G",
    fullForm: "Business-to-Government",
    icon: <Building className="w-10 h-10 text-primary" />,
    placeholder: "Add B2G details here...",
  },
  {
    id: "b2i",
    title: "B2I",
    fullForm: "Business-to-Institution",
    icon: <Globe className="w-10 h-10 text-primary" />,
    placeholder: "Add B2I details here...",
  },
];

export default function Typess({
  selectedType,
  setSelectedType,
}: {
  selectedType: string | null;
  setSelectedType: React.Dispatch<
    React.SetStateAction<"b2b" | "b2c" | "b2g" | "b2i" | null>
  >;
}) {
  //   const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleSelect = (id: "b2b" | "b2c" | "b2g" | "b2i") => {
    setSelectedType(id);
    console.log(`Selected Business Type: ${id}`); // Replace with your logic
  };

  return (
    <div className="w-full mx-auto p-6 ">
      <h2 className="text-3xl font-bold text-center mb-6">
        Types of Business Models
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {businessTypes.map((type) => (
          <div
            key={type.id}
            onClick={() =>
              handleSelect(type.id as "b2b" | "b2c" | "b2g" | "b2i")
            }
            className={`flex items-center gap-4 p-6 cursor-pointer shadow-md rounded-xl border 
              transition-all duration-300 
              ${
                selectedType === type.id
                  ? "border-blue-200 bg-blue-50 shadow-lg scale-105"
                  : "border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700"
              }`}
          >
            <div className="flex-shrink-0">{type.icon}</div>
            <div>
              <h3 className="text-xl font-semibold">{type.title}</h3>
              <p className="text-sm text-gray-500">{type.fullForm}</p>
              <p className="text-gray-400 italic text-sm">{type.placeholder}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
