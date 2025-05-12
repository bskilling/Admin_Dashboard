// components/EnrollmentFilters.tsx
import { useState } from 'react';
import { IFilterState } from './filters';
import { ICategory } from './enrollments';
import { Check, ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface EnrollmentFiltersProps {
  filters: IFilterState;
  setFilters: (filters: IFilterState) => void;
  categories: ICategory[];
  activeFilterCount: number;
}

export default function EnrollmentFilters({
  filters,
  setFilters,
  categories,
  activeFilterCount,
}: EnrollmentFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const courseTypes = [
    { value: 'b2i', label: 'Business to Individual' },
    { value: 'b2b', label: 'Business to Business' },
    { value: 'b2c', label: 'Business to Consumer' },
    { value: 'b2g', label: 'Business to Government' },
  ] as const;

  const statusTypes = [
    { value: 'pending', label: 'Pending' },
    { value: 'enrolled', label: 'Enrolled' },
    { value: 'failed', label: 'Failed' },
  ] as const;

  const handleCategoryChange = (categoryId: string) => {
    setFilters({
      ...filters,
      categories: filters.categories.includes(categoryId)
        ? filters.categories.filter(id => id !== categoryId)
        : [...filters.categories, categoryId],
    });
  };

  const handleTypeChange = (type: 'b2i' | 'b2b' | 'b2c' | 'b2g') => {
    setFilters({
      ...filters,
      types: filters.types.includes(type)
        ? filters.types.filter(t => t !== type)
        : [...filters.types, type],
    });
  };

  const handleStatusChange = (status: 'pending' | 'enrolled' | 'failed') => {
    setFilters({
      ...filters,
      status: filters.status.includes(status)
        ? filters.status.filter(s => s !== status)
        : [...filters.status, status],
    });
  };

  const handlePaidChange = (value: boolean | null) => {
    setFilters({
      ...filters,
      isPaid: filters.isPaid === value ? null : value,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[320px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Enrollments</SheetTitle>
        </SheetHeader>

        <div className="pt-6 pb-20">
          <Accordion type="multiple" defaultValue={['categories', 'types', 'status', 'payment']}>
            {/* Categories filter */}
            <AccordionItem value="categories">
              <AccordionTrigger className="text-sm font-medium">Categories</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category._id}`}
                        checked={filters.categories.includes(category._id)}
                        onCheckedChange={() => handleCategoryChange(category._id)}
                      />
                      <Label htmlFor={`category-${category._id}`} className="flex-1 text-sm">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <div className="text-sm text-muted-foreground">No categories available</div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Course type filter */}
            <AccordionItem value="types">
              <AccordionTrigger className="text-sm font-medium">Course Type</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {courseTypes.map(type => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type.value}`}
                        checked={filters.types.includes(type.value)}
                        onCheckedChange={() => handleTypeChange(type.value)}
                      />
                      <Label htmlFor={`type-${type.value}`} className="flex-1 text-sm">
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Status filter */}
            <AccordionItem value="status">
              <AccordionTrigger className="text-sm font-medium">Enrollment Status</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {statusTypes.map(status => (
                    <div key={status.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status.value}`}
                        checked={filters.status.includes(status.value)}
                        onCheckedChange={() => handleStatusChange(status.value)}
                      />
                      <Label htmlFor={`status-${status.value}`} className="flex-1 text-sm">
                        {status.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Payment filter */}
            <AccordionItem value="payment">
              <AccordionTrigger className="text-sm font-medium">Payment Type</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="paid-courses"
                      checked={filters.isPaid === true}
                      onCheckedChange={() => handlePaidChange(true)}
                    />
                    <Label htmlFor="paid-courses" className="flex-1 text-sm">
                      Paid Courses
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="free-courses"
                      checked={filters.isPaid === false}
                      onCheckedChange={() => handlePaidChange(false)}
                    />
                    <Label htmlFor="free-courses" className="flex-1 text-sm">
                      Free Courses
                    </Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-background p-4 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setFilters({
                  categories: [],
                  types: [],
                  status: [],
                  isPaid: null,
                });
              }}
            >
              Reset
            </Button>
            <Button className="flex-1" onClick={() => setIsOpen(false)}>
              Apply
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
