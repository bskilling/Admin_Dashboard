// components/EnrollmentCard.tsx
import Link from 'next/link';
import { IEnrollment } from './enrollments';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, getStatusColor } from './utils';

interface EnrollmentCardProps {
  enrollment: IEnrollment;
}

export default function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  const { courseId, status, enrolledAt } = enrollment;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative h-40 w-full">
        {courseId.previewImage ? (
          <img
            src={courseId.previewImage?.viewUrl}
            alt={courseId.title}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant={courseId.isPaid ? 'default' : 'secondary'}>
            {courseId.isPaid ? 'Paid' : 'Free'}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{courseId.title}</h3>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{courseId.description}</p>

        <div className="flex flex-wrap gap-1 mb-2">
          {courseId.category &&
            courseId.category.map(cat => (
              <Badge key={cat._id} variant="outline" className="text-xs font-normal">
                {cat.name}
              </Badge>
            ))}
          {courseId.type && (
            <Badge variant="outline" className="text-xs font-normal">
              {courseId.type.toUpperCase()}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          <span className="text-xs text-muted-foreground">Enrolled: {formatDate(enrolledAt)}</span>
        </div>
        <Link href={`/courses/${courseId._id}`} className="text-xs text-primary hover:underline">
          View course
        </Link>
      </CardFooter>
    </Card>
  );
}
