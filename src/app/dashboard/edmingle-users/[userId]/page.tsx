// app/dashboard/edmingle-users/[userId]/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  Check,
  ExternalLink,
  Info,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { IEdmingleUser, IEnrollment } from "../_components/enrollments";
import env from "@/lib/env";

// Fetch single user with enrollments
const fetchUserDetails = async (userId: string) => {
  try {
    const response = await axios.get(
      `${env?.BACKEND_URL}/api/edmingle/user/${userId}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user details");
  }
};

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserDetails(userId),
    staleTime: 1000 * 60 * 60 * 24 * 200,
  });

  // Selected tab state
  const [activeTab, setActiveTab] = useState("overview");

  const user: IEdmingleUser | undefined = data?.data;

  // Get status counts
  const getStatusCounts = (enrollments: IEnrollment[]) => {
    return enrollments.reduce(
      (counts, enrollment) => {
        counts[enrollment.status] = (counts[enrollment.status] || 0) + 1;
        return counts;
      },
      { enrolled: 0, pending: 0, failed: 0 } as Record<string, number>
    );
  };

  // Filter enrollments by status
  const filterByStatus = (enrollments: IEnrollment[], status: string) => {
    return enrollments.filter((enrollment) => enrollment.status === status);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-700"></div>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            User Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The user you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts(user.enrollments);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">User Details</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>User Information</CardTitle>
            <CardDescription>Personal and contact details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-700">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-500 mb-1">Contact Number</p>
                <p className="font-medium">{user.contactNumber}</p>
              </div>

              {user.externalUserId && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Edmingle ID</p>
                    <div className="flex items-center">
                      <p className="font-medium">{user.externalUserId}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <p className="text-sm text-gray-500 mb-1">Registered On</p>
                <p className="font-medium">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enrollment Stats Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Enrollment Statistics</CardTitle>
            <CardDescription>Summary of enrollment status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-gray-800">
                  {user.enrollments.length}
                </p>
                <p className="text-xs text-gray-600">Total Courses</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-700">
                  {statusCounts.enrolled || 0}
                </p>
                <p className="text-xs text-green-600">Enrolled</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-yellow-700">
                  {statusCounts.pending || 0}
                </p>
                <p className="text-xs text-yellow-600">Pending</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Enrolled</p>
                <p className="text-sm">
                  {Math.round(
                    ((statusCounts.enrolled || 0) / user.enrollments.length) *
                      100
                  )}
                  %
                </p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${Math.round(((statusCounts.enrolled || 0) / user.enrollments.length) * 100)}%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Pending</p>
                <p className="text-sm">
                  {Math.round(
                    ((statusCounts.pending || 0) / user.enrollments.length) *
                      100
                  )}
                  %
                </p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${Math.round(((statusCounts.pending || 0) / user.enrollments.length) * 100)}%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Failed</p>
                <p className="text-sm">
                  {Math.round(
                    ((statusCounts.failed || 0) / user.enrollments.length) * 100
                  )}
                  %
                </p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${Math.round(((statusCounts.failed || 0) / user.enrollments.length) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Last Enrollment Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Latest Activity</CardTitle>
            <CardDescription>
              Most recent enrollment information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user.enrollments.length > 0 ? (
              (() => {
                const latestEnrollment = [...user.enrollments].sort(
                  (a, b) =>
                    new Date(b.enrolledAt).getTime() -
                    new Date(a.enrolledAt).getTime()
                )[0];

                return (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800">
                        {latestEnrollment.courseId.title}
                      </h3>
                      <div className="flex items-center mt-2">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <p className="text-sm text-gray-600">
                          {formatDate(latestEnrollment.enrolledAt)}
                        </p>
                      </div>
                      <div className="mt-3">
                        <Badge
                          className={`${
                            latestEnrollment.status === "enrolled"
                              ? "bg-green-100 text-green-800"
                              : latestEnrollment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {latestEnrollment.status.charAt(0).toUpperCase() +
                            latestEnrollment.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Enrollment Details:
                      </p>
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        <p className="text-gray-500">Bundle ID:</p>
                        <p className="font-medium text-gray-700">
                          {latestEnrollment.externalBundleId}
                        </p>

                        <p className="text-gray-500">Enrollment ID:</p>
                        <p className="font-medium text-gray-700">
                          {latestEnrollment.externalEnrollmentId}
                        </p>

                        <p className="text-gray-500">Payment ID:</p>
                        <p className="font-medium text-gray-700">
                          {latestEnrollment.paymentId}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="text-center py-6">
                <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No enrollments yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enrollments Tabs */}
      <div className="mt-8">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Enrollments</TabsTrigger>
            <TabsTrigger value="enrolled">Enrolled</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <EnrollmentList enrollments={user.enrollments} />
          </TabsContent>

          <TabsContent value="enrolled" className="mt-6">
            <EnrollmentList
              enrollments={filterByStatus(user.enrollments, "enrolled")}
            />
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <EnrollmentList
              enrollments={filterByStatus(user.enrollments, "pending")}
            />
          </TabsContent>

          <TabsContent value="failed" className="mt-6">
            <EnrollmentList
              enrollments={filterByStatus(user.enrollments, "failed")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface EnrollmentListProps {
  enrollments: IEnrollment[];
}

function EnrollmentList({ enrollments }: EnrollmentListProps) {
  if (enrollments.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">No enrollments in this category</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Enrolled On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Bundle ID</TableHead>
            <TableHead>Payment ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.map((enrollment) => (
            <TableRow key={enrollment.externalEnrollmentId}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-20 relative rounded overflow-hidden">
                    {enrollment.courseId.previewImage ? (
                      <img
                        src={enrollment.courseId.previewImage?.viewUrl}
                        alt={enrollment.courseId.title}
                        className="object-cover h-20"
                      />
                    ) : (
                      <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{enrollment.courseId.title}</p>
                    <p className="text-xs text-gray-500">
                      {enrollment.courseId.type.toUpperCase()}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {enrollment.courseId.category.map((cat) => (
                    <Badge key={cat._id} variant="outline" className="text-xs">
                      {cat.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{formatDate(enrollment.enrolledAt)}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {enrollment.status === "enrolled" ? (
                    <Badge className="bg-green-100 text-green-800 flex items-center">
                      <Check className="h-3 w-3 mr-1" /> Enrolled
                    </Badge>
                  ) : enrollment.status === "pending" ? (
                    <Badge
                      variant="outline"
                      className="text-yellow-700 border-yellow-300 flex items-center"
                    >
                      Pending
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="flex items-center">
                      <X className="h-3 w-3 mr-1" /> Failed
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{enrollment.externalBundleId}</TableCell>
              <TableCell>{enrollment.paymentId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
