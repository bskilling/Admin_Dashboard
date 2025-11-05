import { useState } from 'react';
import { Briefcase, Users, Building, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

const businessTypes = [
  {
    id: 'b2b',
    title: 'B2B',
    fullForm: 'Business-to-Business',
    icon: <Briefcase className="w-10 h-10 text-primary" />,
    placeholder: 'Add B2B details here...',
  },
  {
    id: 'b2c',
    title: 'B2C',
    fullForm: 'Business-to-Consumer',
    icon: <Users className="w-10 h-10 text-primary" />,
    placeholder: 'Add B2C details here...',
  },
  {
    id: 'b2g',
    title: 'B2G',
    fullForm: 'Business-to-Government',
    icon: <Building className="w-10 h-10 text-primary" />,
    placeholder: 'Add B2G details here...',
  },
  {
    id: 'b2i',
    title: 'B2I',
    fullForm: 'Business-to-Institution',
    icon: <Globe className="w-10 h-10 text-primary" />,
    placeholder: 'Add B2I details here...',
  },
];

export default function Typess({
  selectedType,
  setSelectedType,
}: {
  selectedType: string | null;
  setSelectedType: React.Dispatch<React.SetStateAction<'b2b' | 'b2c' | 'b2g' | 'b2i' | null>>;
}) {
  //   const [selectedType, setSelectedType] = useState<string | null>(null);
  const router = useRouter();

  const handleSelect = (id: 'b2b' | 'b2c' | 'b2g' | 'b2i') => {
    setSelectedType(id);
    router.push(`/dashboard/categories?type=${id}`);
    console.log(`Selected Business Type: ${id}`); // Replace with your logic
  };

  return (
    <div className="w-full mx-auto px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {businessTypes.map(type => (
          <div
            key={type.id}
            onClick={() => handleSelect(type.id as 'b2b' | 'b2c' | 'b2g' | 'b2i')}
            className={`flex items-start gap-4 p-6 cursor-pointer shadow-md rounded-xl border
            transition-all duration-300 group
            ${
              selectedType === type.id
                ? 'border-blue-400 bg-blue-100 shadow-lg scale-[1.02]'
                : 'border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-800'
            }`}
          >
            {/* Icon Section */}
            <div
              className={`flex-shrink-0 p-3 rounded-lg transition-all duration-300 
              ${
                selectedType === type.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
              }`}
            >
              {type.icon}
            </div>

            {/* Text Section */}
            <div>
              <h3
                className={`text-lg font-bold transition-all ${
                  selectedType === type.id
                    ? 'text-blue-600 dark:text-blue-300'
                    : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                {type.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{type.fullForm}</p>
              <p className="text-gray-500 dark:text-gray-500 italic text-xs mt-1">
                {type.placeholder}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
