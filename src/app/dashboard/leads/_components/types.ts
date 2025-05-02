// types.ts
export interface Note {
  text: string;
  status: string;
  addedBy?: string;
  createdAt: string;
  updatedAt?: string;
  _id?: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  type: "b2i" | "b2b" | "b2c" | "b2g" | "general";
  subCategory?: string;
  query: string;
  status: string;
  websiteUrl?: string;
  course: {
    _id: string;
    type: string;
    title: string;
    slug: string;
    category: {
      _id: string;
      name: string;
    };
  };
  notes: Note[];
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilterOptions {
  type: string;
  subCategory: string;
  status: string;
  searchQuery: string;
  category?: string;
  courseId?: string;
}

export interface LeadCounts {
  all: number;
  b2i: number;
  b2b: number;
  b2c: number;
  b2g: number;
}

export const STATUS_OPTIONS = [
  "NEW",
  "Attempted to Contact",
  "Not Contacted",
  "In-conversation",
  "Prospect",
  "Not-Eligible",
  "Not-Interested",
  "Spam",
  "Opportunity",
  "Contact-in-Future",
  "Closed-Won",
  "Closed-Lost",
];

export const TYPE_OPTIONS = [
  { value: "b2i", label: "B2I" },
  { value: "b2b", label: "B2B" },
  { value: "b2c", label: "B2C" },
  { value: "b2g", label: "B2G" },
  { value: "general", label: "General" },
];
