'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import env from '@/lib/env';
import { Input } from '@/components/ui/input';

interface Course {
  _id: string;
  title: string;
  description?: string;
}

interface FormData {
  courseId: string;
  externalBundleId: number | undefined;
  externalOrgId: number | undefined;
  isActive: boolean;
}

export default function ExternalCourseMappingForm() {
  const [selectedMappingId, setSelectedMappingId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormData>({
    courseId: '',
    externalBundleId: undefined,
    externalOrgId: undefined,
    isActive: true,
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked,
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value ? Number(value) : undefined,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Fetch available courses
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data } = await axios.get(env?.BACKEND_URL + '/api/courses');
      return data.data.courses as Course[];
    },
  });

  // Fetch existing mappings
  const { data: mappings, isLoading: isLoadingMappings } = useQuery({
    queryKey: ['courseMappings'],
    queryFn: async () => {
      const { data } = await axios.get(env?.BACKEND_URL + '/api/edmingle/external/mappings');
      return data.data.mappings;
    },
  });

  // Create new mapping mutation
  const createMapping = useMutation({
    mutationFn: async (values: FormData) => {
      const { data } = await axios.post(
        env?.BACKEND_URL + '/api/edmingle/external/mappings',
        values
      );
      return data;
    },
    onSuccess: () => {
      toast.success('Mapping created successfully');
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['courseMappings'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error creating mapping');
    },
  });

  // Update existing mapping mutation
  const updateMapping = useMutation({
    mutationFn: async (values: FormData & { id: string }) => {
      const { id, ...updateData } = values;
      const { data } = await axios.put(
        env?.BACKEND_URL + `/api/edmingle/external/mappings/${id}`,
        updateData
      );
      return data;
    },
    onSuccess: () => {
      toast.success('Mapping updated successfully');
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['courseMappings'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error updating mapping');
    },
  });

  // Delete mapping mutation
  const deleteMapping = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(
        env?.BACKEND_URL + `/api/edmingle/external/mappings/${id}`
      );
      return data;
    },
    onSuccess: () => {
      toast.success('Mapping deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['courseMappings'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error deleting mapping');
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.courseId) {
      toast.error('Please select a course');
      return;
    }

    if (!formData.externalBundleId) {
      toast.error('Please enter the Edmingle bundle ID');
      return;
    }

    if (!formData.externalOrgId) {
      toast.error('Please enter the Edmingle organization ID');
      return;
    }

    if (selectedMappingId) {
      updateMapping.mutate({ id: selectedMappingId, ...formData });
    } else {
      createMapping.mutate(formData);
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedMappingId(null);
    setFormData({
      courseId: '',
      externalBundleId: undefined,
      externalOrgId: undefined,
      isActive: true,
    });
  };

  // Edit a mapping
  const handleEditMapping = (mapping: any) => {
    setSelectedMappingId(mapping._id);
    setFormData({
      courseId: mapping.courseId._id,
      externalBundleId: mapping.externalBundleId,
      externalOrgId: mapping.externalOrgId,
      isActive: mapping.isActive,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        {selectedMappingId ? 'Edit Course Mapping' : 'Create New Course Mapping'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Course <span className="text-red-500">*</span>
          </label>
          <Input
            name="courseId"
            value={formData.courseId}
            placeholder="Enter Course ID"
            onChange={e => setFormData({ ...formData, courseId: e.target.value })}
          />
          {/* <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            disabled={isLoadingCourses}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select a course
            </option>
            {isLoadingCourses ? (
              <option value="" disabled>
                Loading courses...
              </option>
            ) : (
              courses?.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))
            )}
          </select> */}
        </div>

        {/* External Bundle ID */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Edmingle Bundle ID <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="externalBundleId"
            value={formData.externalBundleId || ''}
            onChange={handleChange}
            placeholder="Enter the Edmingle bundle ID"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* External Organization ID */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Edmingle Organization ID <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="externalOrgId"
            value={formData.externalOrgId || ''}
            onChange={handleChange}
            placeholder="Enter the Edmingle organization ID"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div>
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active
            </label>
            <p className="text-sm text-gray-500">
              Only active mappings will be used for enrollment
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={createMapping.isPending || updateMapping.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {createMapping.isPending || updateMapping.isPending ? (
              <>
                <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                {selectedMappingId ? 'Updating...' : 'Creating...'}
              </>
            ) : selectedMappingId ? (
              'Update Mapping'
            ) : (
              'Create Mapping'
            )}
          </button>

          {selectedMappingId && (
            <>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this mapping?')) {
                    deleteMapping.mutate(selectedMappingId);
                    resetForm();
                  }
                }}
                disabled={deleteMapping.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMapping.isPending ? (
                  <>
                    <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </>
          )}
        </div>
      </form>

      {/* Existing Mappings Table */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Existing Mappings</h3>

        {isLoadingMappings ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : mappings && mappings.length > 0 ? (
          <div className="border rounded-md overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bundle ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mappings.map((mapping: any) => (
                  <tr key={mapping._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {mapping.courseId.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{mapping.externalBundleId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{mapping.externalOrgId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          mapping.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {mapping.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEditMapping(mapping)}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 border rounded-md">
            <p className="text-gray-500">No mappings found. Create your first mapping above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
