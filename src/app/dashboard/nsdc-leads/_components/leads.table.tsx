// app/nsdc-lead/_components/leads.table.tsx
'use client';

import { Badge } from '@/components/ui/badge';

interface Lead {
  candidateName: string;
  candidateEmail: string;
  mobile: string;
  courseName: string[];
  city: string;
  state: string;
  status: string;
  zohoResponse?: {
    code: string;
  };
}

interface Props {
  data: Lead[];
}

export const DataTable = ({ data }: Props) => {
  return (
    <div className="overflow-x-auto rounded-xl border shadow">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 border-b text-xs uppercase font-semibold text-gray-600">
          <tr>
            <th className="px-4 py-2">No</th>

            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Mobile</th>
            <th className="px-4 py-2">Course</th>
            <th className="px-4 py-2">City</th>
            <th className="px-4 py-2">State</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Zoho Code</th>
          </tr>
        </thead>
        <tbody>
          {data.map((lead, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 whitespace-nowrap">{idx + 1}.</td>
              <td className="px-4 py-2 whitespace-nowrap">{lead.candidateName}</td>
              <td className="px-4 py-2 whitespace-nowrap">{lead.candidateEmail}</td>
              <td className="px-4 py-2 whitespace-nowrap">{lead.mobile}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {lead.courseName.map(course => (
                    <Badge key={course}>{course}</Badge>
                  ))}
                </div>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">{lead.city}</td>
              <td className="px-4 py-2 whitespace-nowrap">{lead.state}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                <Badge variant="outline">{lead.status}</Badge>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <Badge variant="secondary">{lead.zohoResponse?.code || 'UNKNOWN'}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
