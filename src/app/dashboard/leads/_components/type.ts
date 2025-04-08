export interface Lead {
  _id: string;
  name: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  category:
    | "individual_course"
    | "corporate_training"
    | "institutional"
    | "government";
  type: "b2i" | "b2b" | "b2c" | "b2g";
  subCategory?: "jobs" | "skills";
  query: string;
  createdAt: string;
  updatedAt: string;
  status:
    | "NEW"
    | "Attempted to Contact"
    | "Not Contact"
    | "In-conversation"
    | "Prospect"
    | "Not-Eligible"
    | "Not-Interested"
    | "Spam"
    | "Opportunity"
    | "Contact-in-Future"
    | "Closed-Won"
    | "Closed-Lost";
  comment?: string;
  websiteUrl?: string;
  notes: Array<{
    text: string;
    status: string;
    addedBy?: string;
    createdAt: string;
    updatedAt?: string;
  }>;
}
export interface FilterOptions {
  type: string;
  subCategory: string;
  status: string;
  searchQuery: string;
}
