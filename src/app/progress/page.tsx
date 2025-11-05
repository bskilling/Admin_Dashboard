'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const BASE_URL = 'https://nsdc.bskilling.com';

// Type definitions
interface GeneratedStatus {
  nsdc: boolean;
  cloud: boolean;
}

interface Student {
  integration_id: string;
  user_id: string;
  bundle_id: string;
  email: string;
  student_name: string;
  course_id: string;
  generated: GeneratedStatus;
}

interface ApiResponse {
  success: boolean;
  students: Student[];
  total_students: number;
}

interface ProgressUpdatePayload {
  user_id: string;
  bundle_id: string;
}

interface ProgressUpdateResponse {
  error?: string;
}

export default function StudentProgressPage(): JSX.Element {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingProgress, setUpdatingProgress] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const studentsPerPage: number = 10;

  // Fetch students data
  const fetchStudents = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/students/all`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setStudents(data.students);
        toast.success(`Loaded ${data.total_students} students successfully`);
      } else {
        toast.error('Failed to fetch students');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Error fetching students: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update student progress
  const updateStudentProgress = async (student: Student): Promise<void> => {
    setUpdatingProgress(student.user_id);
    try {
      const payload: ProgressUpdatePayload = {
        user_id: student.user_id,
        bundle_id: student.bundle_id,
      };

      const response = await fetch(`${BASE_URL}/student/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload }),
      });

      const result: ProgressUpdateResponse = await response.json();

      if (response.ok) {
        toast.success(`Progress updated successfully for ${student.student_name}`);
      } else {
        toast.error(`Failed to update progress: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Error updating progress: ' + errorMessage);
    } finally {
      setUpdatingProgress(null);
      setDialogOpen(false);
      setSelectedStudent(null);
    }
  };

  // Filter students based on search term
  const filteredStudents: Student[] = students.filter(
    (student: Student) =>
      student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.integration_id.includes(searchTerm)
  );

  // Pagination logic
  const totalPages: number = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex: number = (currentPage - 1) * studentsPerPage;
  const endIndex: number = startIndex + studentsPerPage;
  const currentStudents: Student[] = filteredStudents.slice(startIndex, endIndex);

  const goToNextPage = (): void => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleProgressUpdate = (student: Student): void => {
    setSelectedStudent(student);
    setDialogOpen(true);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Student Progress Management</h1>
        <Button onClick={fetchStudents} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Refresh Data'
          )}
        </Button>
      </div>

      {/* Search Input */}
      <div className="w-full max-w-sm">
        <Input
          placeholder="Search students by name, email, or ID..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Students Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Integration ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bundle ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    <p className="mt-2 text-gray-600">Loading students...</p>
                  </td>
                </tr>
              ) : currentStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    {searchTerm
                      ? 'No students found matching your search.'
                      : 'No students available.'}
                  </td>
                </tr>
              ) : (
                currentStudents.map((student: Student) => (
                  <tr key={student.user_id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-mono text-gray-900">
                      {student.integration_id}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {student.student_name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{student.email}</td>
                    <td className="px-4 py-4 text-sm font-mono text-gray-900">{student.user_id}</td>
                    <td className="px-4 py-4 text-sm font-mono text-gray-900">
                      {student.bundle_id}
                    </td>
                    <td className="px-4 py-4 text-sm font-mono text-gray-900">
                      {student.course_id}
                    </td>
                    <td className="px-4 py-4 text-sm font-mono text-gray-900">
                      {JSON.stringify(student.generated)}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <Link
                        href={`/progress/${student.user_id}?bundleId=${student.bundle_id}`}
                        className="text-blue-600 hover:underline"
                      >
                        <Button size="sm">{'View'}</Button>
                      </Link>
                      {/* <Button
                        size="sm"
                        onClick={() => handleProgressUpdate(student)}
                        disabled={updatingProgress === student.user_id}
                      >
                        {updatingProgress === student.user_id ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update Progress'
                        )}
                      </Button> */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredStudents.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of{' '}
            {filteredStudents.length} students
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Student Progress</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the progress for{' '}
              <strong>{selectedStudent?.student_name}</strong>?
              <br />
              <br />
              This will set their course status to completed (100%) with today's date.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Student:</strong> {selectedStudent?.student_name}
            </p>
            <p>
              <strong>Email:</strong> {selectedStudent?.email}
            </p>
            <p>
              <strong>User ID:</strong> {selectedStudent?.user_id}
            </p>
            <p>
              <strong>Bundle ID:</strong> {selectedStudent?.bundle_id}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setSelectedStudent(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedStudent && updateStudentProgress(selectedStudent)}
              disabled={!!updatingProgress}
            >
              {updatingProgress ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Confirm Update'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
