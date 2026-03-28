'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, TrendingUp, Users, DollarSign, ExternalLink, Award, Star } from 'lucide-react';
import { TopCourse } from './types';
import { formatCurrency, truncateText } from './purchaseUtils';

interface TopCoursesProps {
  topCourses: TopCourse[];
  loading?: boolean;
}

interface CourseItemProps {
  course: TopCourse;
  rank: number;
  maxPurchaseCount: number;
  maxRevenue: number;
}

const CourseItemSkeleton = () => (
  <div className="flex items-center gap-4 p-4 rounded-lg border">
    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
    <div className="flex-1 space-y-2">
      <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="w-1/2 h-3 bg-gray-100 rounded animate-pulse"></div>
    </div>
    <div className="text-right space-y-2">
      <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="w-12 h-3 bg-gray-100 rounded animate-pulse"></div>
    </div>
  </div>
);

const CourseItem: React.FC<CourseItemProps> = ({ course, rank, maxPurchaseCount, maxRevenue }) => {
  const purchaseProgress =
    maxPurchaseCount > 0 ? (course.purchaseCount / maxPurchaseCount) * 100 : 0;
  const revenueProgress = maxRevenue > 0 ? (course.revenue / maxRevenue) * 100 : 0;

  const getRankBadge = () => {
    const badgeColors = {
      1: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      2: 'bg-gray-100 text-gray-800 border-gray-200',
      3: 'bg-orange-100 text-orange-800 border-orange-200',
    };

    const color =
      badgeColors[rank as keyof typeof badgeColors] || 'bg-blue-100 text-blue-800 border-blue-200';

    return (
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${color} border`}
      >
        {rank === 1 && <Award className="w-4 h-4" />}
        {rank === 2 && <Star className="w-4 h-4" />}
        {rank > 2 && rank}
      </div>
    );
  };

  return (
    <div className="group hover:bg-accent/50 transition-colors rounded-lg border">
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Rank Badge */}
          {getRankBadge()}

          {/* Course Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4
                  className="font-semibold text-sm leading-tight"
                  title={course.courseDetails.title}
                >
                  {truncateText(course.courseDetails.title, 40)}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Course • {course.courseDetails.slug}
                </p>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Purchases</span>
                  <span className="font-medium">{course.purchaseCount}</span>
                </div>
                <Progress value={purchaseProgress} className="h-1.5" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="font-medium">{formatCurrency(course.revenue)}</span>
                </div>
                <Progress value={revenueProgress} className="h-1.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TopCoursesComponent: React.FC<TopCoursesProps> = ({ topCourses, loading = false }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Top Courses
          </CardTitle>
          <CardDescription>Best performing courses by purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <CourseItemSkeleton key={index} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!topCourses || topCourses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Top Courses
          </CardTitle>
          <CardDescription>Best performing courses by purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No course data available</p>
            <p className="text-sm">Course analytics will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxPurchaseCount = Math.max(...topCourses.map(course => course.purchaseCount));
  const maxRevenue = Math.max(...topCourses.map(course => course.revenue));
  const totalRevenue = topCourses.reduce((sum, course) => sum + course.revenue, 0);
  const totalPurchases = topCourses.reduce((sum, course) => sum + course.purchaseCount, 0);

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Top Courses
          </div>
          <Badge variant="secondary" className="text-xs">
            Top {topCourses.length}
          </Badge>
        </CardTitle>
        <CardDescription>Best performing courses by purchases and revenue</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-3 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-lg font-bold text-blue-600">
              <Users className="w-4 h-4" />
              {totalPurchases}
            </div>
            <div className="text-xs text-muted-foreground">Total Purchases</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-lg font-bold text-green-600">
              <DollarSign className="w-4 h-4" />
              {formatCurrency(totalRevenue)}
            </div>
            <div className="text-xs text-muted-foreground">Total Revenue</div>
          </div>
        </div>

        {/* Courses List */}
        <div className="space-y-3">
          {topCourses.map((course, index) => (
            <CourseItem
              key={course._id}
              course={course}
              rank={index + 1}
              maxPurchaseCount={maxPurchaseCount}
              maxRevenue={maxRevenue}
            />
          ))}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center text-xs text-muted-foreground">
            <div>
              <div className="font-medium text-foreground">
                {totalPurchases > 0 ? (totalRevenue / totalPurchases).toFixed(0) : '0'}
              </div>
              <div>Avg Revenue per Purchase</div>
            </div>
            <div>
              <div className="font-medium text-foreground">
                {topCourses.length > 0 ? (totalPurchases / topCourses.length).toFixed(1) : '0'}
              </div>
              <div>Avg Purchases per Course</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopCoursesComponent;
