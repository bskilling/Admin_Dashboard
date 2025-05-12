// components/RelatedCoursesSelect.tsx
import { Controller } from 'react-hook-form';
import { useState } from 'react';
import { CourseType, useCourseCategories, useCourses } from './useCourses';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function RelatedCoursesSelect({
  control,
  initialSelected = [],
}: {
  control: any;
  initialSelected?: string[];
}) {
  const [selectedType, setSelectedType] = useState<CourseType>('b2b');
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch categories based on selected type
  const { data: categories } = useCourseCategories(selectedType);

  // Fetch courses based on type and category
  const { data: courseData, isLoading } = useCourses({
    type: selectedType,
    category: selectedCategory,
    isPublished: true,
    // search: searchQuery,
  });

  return (
    <div className="mb-4 space-y-4">
      <Controller
        name="relatedCourses"
        control={control}
        defaultValue={initialSelected}
        render={({ field }) => (
          <>
            <div className="flex flex-wrap gap-2">
              {field.value?.map((courseId: string) => {
                const course = courseData?.courses?.find(c => c._id === courseId);
                return (
                  <Badge
                    key={courseId}
                    variant="outline"
                    className="flex items-center gap-2 py-1 px-3"
                  >
                    {course?.title || 'Unknown Course'}
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange(field.value.filter((id: string) => id !== courseId));
                      }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Badge>
                );
              })}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Related Courses
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-7xl h-[80vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Add Related Courses</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Course Type</label>
                      <select
                        className="w-full px-3 py-2 border rounded-lg"
                        value={selectedType}
                        onChange={e => {
                          setSelectedType(e.target.value as CourseType);
                          setSelectedCategory(undefined);
                        }}
                      >
                        <option value="b2b">B2B</option>
                        <option value="b2c">B2C</option>
                        <option value="b2g">B2G</option>
                        <option value="b2i">B2I</option>
                      </select>
                    </div>

                    {categories && categories.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                          className="w-full px-3 py-2 border rounded-lg"
                          value={selectedCategory || ''}
                          onChange={e => setSelectedCategory(e.target.value || undefined)}
                        >
                          <option value="">All Categories</option>
                          {categories.map((cat: any) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <Input
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-span-3">
                    <ScrollArea className="h-[60vh] pr-4">
                      {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                          Loading courses...
                        </div>
                      ) : courseData?.courses?.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {courseData.courses.map(course => (
                            <Card key={course._id}>
                              <CardHeader>
                                <CardTitle className="text-lg">{course.title}</CardTitle>
                                <Badge variant="secondary">{course.type.toUpperCase()}</Badge>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">
                                  {
                                    // @ts-expect-error
                                    course?.description || 'No description available'
                                  }
                                </p>
                              </CardContent>
                              <CardFooter>
                                <Button
                                  type="button"
                                  variant={
                                    field.value?.includes(course._id) ? 'default' : 'outline'
                                  }
                                  size="sm"
                                  onClick={() => {
                                    if (field.value?.includes(course._id)) {
                                      field.onChange(
                                        field.value.filter((id: string) => id !== course._id)
                                      );
                                    } else {
                                      field.onChange([...(field.value || []), course._id]);
                                    }
                                  }}
                                >
                                  {field.value?.includes(course._id) ? 'Remove' : 'Add'}
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="flex justify-center items-center h-40">
                          No courses found
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      />
    </div>
  );
}
