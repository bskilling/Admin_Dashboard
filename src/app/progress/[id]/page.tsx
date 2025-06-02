'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Loader2,
  ArrowLeft,
  RefreshCcw,
  User,
  BookOpen,
  Calendar,
  Target,
  Award,
  AlertTriangle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const BASE_URL = 'https://nsdc.bskilling.com';

// Type definitions
interface MasterBatch {
  id: string;
  name: string;
  key: string;
}

interface MasterBatches {
  [key: string]: MasterBatch;
}

interface SubjectProgress {
  subject_name: string;
  progress: string;
}

interface BatchDetails {
  student_name?: string;
  course_name?: string;
  batch_name?: string;
  student_start_date?: number;
  batch_start_date?: number;
  batch_end_date?: number;
}

interface ProgressApiData {
  subjects_progress?: SubjectProgress[];
  batch_details?: BatchDetails;
}

interface ProgressApiResponse {
  data: ProgressApiData;
  message?: string;
  error?: string;
}

interface BatchProgressData {
  data: ProgressApiData;
  courseName: string;
}

interface ProgressData {
  [batchId: string]: BatchProgressData;
}

interface FetchedProgressResult {
  batchId: string;
  data: ProgressApiData;
  courseName: string;
}

interface CertificatePayload {
  user_id: string;
  bundle_id: string | null;
  master_batch_id: string;
  course_key: string;
}

interface CertificateApiResponse {
  error?: string;
}

// Master batch configurations
const MASTER_BATCHES: MasterBatches = {
  '150787': {
    id: '150787',
    name: 'Gen AI',
    key: 'nsdc',
  },
  '148510': {
    id: '148510',
    name: 'Cloud Computing',
    key: 'cloud',
  },
};

export default function ProgressDetailPage(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const searchParams = useSearchParams();

  const bundle_id = searchParams.get('bundleId');

  // State for managing multiple courses
  const [selectedBatchId, setSelectedBatchId] = useState<string>('150787'); // Default to Gen AI
  const [progressData, setProgressData] = useState<ProgressData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState<boolean>(false);
  const [generatingCertificate, setGeneratingCertificate] = useState<boolean>(false);
  const [selectedCourseForCertificate, setSelectedCourseForCertificate] = useState<string | null>(
    null
  );

  // Fetch progress data for a specific batch
  const fetchProgressDataForBatch = async (
    batchId: string
  ): Promise<FetchedProgressResult | null> => {
    if (!userId) {
      return null;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/student/progress?master_batch_id=${batchId}&user_id=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const result: ProgressApiResponse = await response.json();

      if (response.ok && result.data) {
        return {
          batchId,
          data: result.data,
          courseName: MASTER_BATCHES[batchId].name,
        };
      } else {
        console.error(`Failed to fetch data for batch ${batchId}:`, result.message || result.error);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching progress for batch ${batchId}:`, error);
      return null;
    }
  };

  // Fetch progress data for all batches
  const fetchAllProgressData = async (): Promise<void> => {
    if (!userId) {
      setError('User ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const batchIds = Object.keys(MASTER_BATCHES);
      const progressPromises = batchIds.map(batchId => fetchProgressDataForBatch(batchId));

      const results = await Promise.all(progressPromises);

      const progressByBatch: ProgressData = {};
      let hasData = false;

      results.forEach(result => {
        if (result) {
          progressByBatch[result.batchId] = {
            data: result.data,
            courseName: result.courseName,
          };
          hasData = true;
        }
      });

      if (hasData) {
        setProgressData(progressByBatch);
        toast.success('Progress data loaded successfully');
      } else {
        setError('No progress data found for any course');
        toast.error('No progress data found for any course');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching progress:', error);
      setError('Error fetching progress: ' + errorMessage);
      toast.error('Error fetching progress: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAllProgressData();
    }
  }, [userId]);

  const handleGoBack = (): void => {
    router.back();
  };

  const handleRefresh = (): void => {
    fetchAllProgressData();
  };

  // Check if student has completed all subjects for a specific batch (100% progress)
  const isAllSubjectsCompleted = (batchId: string): boolean => {
    const batchData = progressData[batchId];
    if (!batchData?.data?.subjects_progress || batchData.data.subjects_progress.length === 0) {
      return false;
    }
    return batchData.data.subjects_progress.every(subject => parseInt(subject.progress) === 100);
  };

  // Generate certificate function
  const generateCertificate = async (): Promise<void> => {
    if (!selectedCourseForCertificate) {
      toast.error('Please select a course for certificate generation');
      return;
    }

    const batchConfig = MASTER_BATCHES[selectedCourseForCertificate];
    if (!isAllSubjectsCompleted(selectedCourseForCertificate)) {
      toast.error(`Student has not completed all subjects for ${batchConfig.name} yet!`);
      return;
    }

    setGeneratingCertificate(true);
    try {
      const payload: CertificatePayload = {
        user_id: userId,
        bundle_id: bundle_id,
        master_batch_id: selectedCourseForCertificate,
        course_key: batchConfig.key, // Add course key for backend processing
      };

      const response = await fetch(`${BASE_URL}/student/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload }),
      });

      const result: CertificateApiResponse = await response.json();

      if (response.ok) {
        const studentName =
          progressData[selectedCourseForCertificate]?.data?.batch_details?.student_name ||
          'student';
        toast.success(
          `Certificate generated successfully for ${studentName} - ${batchConfig.name}`
        );
        // Refresh the data to get updated status
        fetchAllProgressData();
      } else {
        toast.error(
          `Failed to generate certificate for ${batchConfig.name}: ${result.error || 'Unknown error'}`
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error generating certificate:', error);
      toast.error('Error generating certificate: ' + errorMessage);
    } finally {
      setGeneratingCertificate(false);
      setCertificateDialogOpen(false);
      setSelectedCourseForCertificate(null);
    }
  };

  const handleGenerateCertificate = (batchId: string): void => {
    if (!isAllSubjectsCompleted(batchId)) {
      const courseName = MASTER_BATCHES[batchId].name;
      toast.error(
        `Cannot generate certificate for ${courseName}: Student has not completed all subjects (100% progress required)`
      );
      return;
    }
    setSelectedCourseForCertificate(batchId);
    setCertificateDialogOpen(true);
  };

  // Get available courses for certificate generation
  const getCompletedCourses = (): string[] => {
    return Object.keys(progressData).filter(
      batchId => progressData[batchId] && isAllSubjectsCompleted(batchId)
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin mb-4" />
            <p className="text-gray-600">Loading progress data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Progress</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const currentBatchData = progressData[selectedBatchId];
  const completedCourses = getCompletedCourses();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Student Progress Details</h1>
            <p className="text-gray-600">User ID: {userId}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          {/* Certificate Generation Button */}
          {Object.keys(progressData).length > 0 && (
            <Button
              onClick={() => {
                if (completedCourses.length === 0) {
                  toast.error('No courses completed yet');
                  return;
                }
                if (completedCourses.length === 1) {
                  handleGenerateCertificate(completedCourses[0]);
                } else {
                  setCertificateDialogOpen(true);
                }
              }}
              disabled={completedCourses.length === 0 || generatingCertificate}
              variant={completedCourses.length > 0 ? 'default' : 'secondary'}
            >
              {generatingCertificate ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Award className="mr-2 h-4 w-4" />
                  {completedCourses.length > 0 ? 'Generate Certificate' : 'Certificate Unavailable'}
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Course Selector */}
      {Object.keys(progressData).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Course Selection</CardTitle>
            <CardDescription>Select a course to view detailed progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(progressData).map(([batchId, data]) => (
                    <SelectItem key={batchId} value={batchId}>
                      {MASTER_BATCHES[batchId].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Course Status Badges */}
              <div className="flex space-x-2">
                {Object.keys(progressData).map((batchId: string) => (
                  <Badge
                    key={batchId}
                    variant={isAllSubjectsCompleted(batchId) ? 'default' : 'secondary'}
                    className={isAllSubjectsCompleted(batchId) ? 'bg-green-600' : ''}
                  >
                    {MASTER_BATCHES[batchId].name}:{' '}
                    {isAllSubjectsCompleted(batchId) ? 'Completed' : 'In Progress'}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Data Display */}
      {currentBatchData ? (
        <div className="grid gap-6">
          {/* Student Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Student Information - {MASTER_BATCHES[selectedBatchId].name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="text-lg font-mono">{userId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Master Batch ID</p>
                  <p className="text-lg font-mono">{selectedBatchId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Course</p>
                  <p className="text-lg">{MASTER_BATCHES[selectedBatchId].name}</p>
                </div>
                {currentBatchData.data.batch_details?.student_name && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Student Name</p>
                    <p className="text-lg">{currentBatchData.data.batch_details.student_name}</p>
                  </div>
                )}
                {currentBatchData.data.batch_details?.course_name && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Course Name</p>
                    <p className="text-lg">{currentBatchData.data.batch_details.course_name}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Progress Data Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Progress Details - {MASTER_BATCHES[selectedBatchId].name}
              </CardTitle>
              <CardDescription>Current learning progress and completion status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentBatchData.data.subjects_progress &&
                  currentBatchData.data.subjects_progress.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Subject Progress:</h4>
                        <div className="flex items-center space-x-2">
                          {isAllSubjectsCompleted(selectedBatchId) ? (
                            <Badge variant="default" className="bg-green-600">
                              <Award className="mr-1 h-3 w-3" />
                              All Completed
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              In Progress
                            </Badge>
                          )}
                        </div>
                      </div>
                      {currentBatchData.data.subjects_progress.map(
                        (subject: SubjectProgress, index: number) => (
                          <div key={index} className="border rounded-lg p-4 bg-white">
                            <p className="font-medium mb-2">{subject.subject_name}</p>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-3">
                                <div
                                  className={`h-3 rounded-full ${parseInt(subject.progress) === 100 ? 'bg-green-600' : 'bg-blue-600'}`}
                                  style={{ width: `${subject.progress}%` }}
                                ></div>
                              </div>
                              <span
                                className={`text-lg font-semibold ${parseInt(subject.progress) === 100 ? 'text-green-600' : 'text-blue-600'}`}
                              >
                                {subject.progress}%
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}

                {/* Date Information */}
                {currentBatchData.data.batch_details?.student_start_date && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Student Start Date</p>
                      <p>
                        {new Date(
                          currentBatchData.data.batch_details.student_start_date * 1000
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Batch Information */}
          {currentBatchData.data.batch_details && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Batch Information - {MASTER_BATCHES[selectedBatchId].name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentBatchData.data.batch_details.course_name && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Course Name</p>
                      <p className="text-lg">{currentBatchData.data.batch_details.course_name}</p>
                    </div>
                  )}
                  {currentBatchData.data.batch_details.batch_name && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Batch Name</p>
                      <p className="text-lg">{currentBatchData.data.batch_details.batch_name}</p>
                    </div>
                  )}
                  {currentBatchData.data.batch_details.batch_start_date !== undefined && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Batch Start Date</p>
                      <p className="text-lg">
                        {currentBatchData.data.batch_details.batch_start_date
                          ? new Date(
                              currentBatchData.data.batch_details.batch_start_date * 1000
                            ).toLocaleDateString()
                          : 'Not set'}
                      </p>
                    </div>
                  )}
                  {currentBatchData.data.batch_details.batch_end_date !== undefined && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Batch End Date</p>
                      <p className="text-lg">
                        {currentBatchData.data.batch_details.batch_end_date
                          ? new Date(
                              currentBatchData.data.batch_details.batch_end_date * 1000
                            ).toLocaleDateString()
                          : 'Not set'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No progress data available</p>
          </CardContent>
        </Card>
      )}

      {/* Certificate Generation Dialog */}
      <Dialog open={certificateDialogOpen} onOpenChange={setCertificateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Generate Certificate
            </DialogTitle>
            <DialogDescription>
              {completedCourses.length > 1 ? (
                'Select a course to generate certificate for:'
              ) : (
                <>
                  Are you sure you want to generate a certificate for{' '}
                  <strong>{currentBatchData?.data?.batch_details?.student_name}</strong>?
                  <br />
                  <br />
                  This will mark their course as completed and generate the completion certificate.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {completedCourses.length > 1 && !selectedCourseForCertificate && (
            <div className="space-y-4">
              <Select onValueChange={setSelectedCourseForCertificate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Course for Certificate" />
                </SelectTrigger>
                <SelectContent>
                  {completedCourses.map((batchId: string) => (
                    <SelectItem key={batchId} value={batchId}>
                      {MASTER_BATCHES[batchId].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(selectedCourseForCertificate || completedCourses.length === 1) && (
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>Student:</strong>{' '}
                {
                  progressData[selectedCourseForCertificate || completedCourses[0]]?.data
                    ?.batch_details?.student_name
                }
              </p>
              <p>
                <strong>Course:</strong>{' '}
                {MASTER_BATCHES[selectedCourseForCertificate || completedCourses[0]].name}
              </p>
              <p>
                <strong>User ID:</strong> {userId}
              </p>
              <p>
                <strong>Progress Status:</strong>{' '}
                <Badge variant="default" className="bg-green-600">
                  All subjects completed (100%)
                </Badge>
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCertificateDialogOpen(false);
                setSelectedCourseForCertificate(null);
              }}
              disabled={generatingCertificate}
            >
              Cancel
            </Button>
            <Button
              onClick={generateCertificate}
              disabled={
                generatingCertificate ||
                (completedCourses.length > 1 && !selectedCourseForCertificate)
              }
            >
              {generatingCertificate ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Award className="mr-2 h-4 w-4" />
                  Generate Certificate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
