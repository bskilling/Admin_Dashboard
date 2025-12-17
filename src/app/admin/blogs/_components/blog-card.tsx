/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/_components/blogs/blog-card.tsx
'use client';

import { MoreHorizontal, Eye, Calendar, Clock, Star, Pin } from 'lucide-react';
import Image from 'next/image';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { Blog } from '@/types/entities';

interface BlogCardProps {
  blog: Blog;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BlogCard({ blog, onEdit, onDelete }: BlogCardProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      published: 'default',
      draft: 'secondary',
      archived: 'destructive',
      scheduled: 'outline',
    };

    return (
      <Badge variant={variants[status] || 'outline'} className="text-xs">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {getStatusBadge(blog.status)}
              {blog.isFeatured && (
                <Badge variant="outline" className="text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              {blog.isTopPick && (
                <Badge variant="outline" className="text-xs">
                  <Pin className="w-3 h-3 mr-1" />
                  Top Pick
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {blog.title}
            </h3>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(blog._id)}>View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(blog._id)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(blog._id)} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="relative aspect-video mb-3 rounded-md overflow-hidden bg-muted">
            <Image
              src={blog.featuredImage.url || '/placeholder.jpg'}
              alt={blog.featuredImage.alt || blog.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Summary */}
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{blog.summary}</p>

        {/* Categories and Tags */}
        <div className="space-y-2">
          {blog.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {blog.categories.slice(0, 3).map((category: any) => (
                <Badge
                  key={category._id}
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: category.color,
                    color: category.color,
                  }}
                >
                  {category.name}
                </Badge>
              ))}
              {blog.categories.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{blog.categories.length - 3}
                </Badge>
              )}
            </div>
          )}

          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {blog.tags.slice(0, 3).map((tag: any) => (
                <Badge
                  key={tag._id}
                  variant="secondary"
                  className="text-xs"
                  style={{
                    backgroundColor: tag.color + '20',
                    color: tag.color,
                  }}
                >
                  #{tag.name}
                </Badge>
              ))}
              {blog.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{blog.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Series Info */}
        {blog.series && (
          <div className="mt-3 p-2 bg-muted rounded-md">
            <div className="text-xs text-muted-foreground">Part of series</div>
            <div className="text-sm font-medium">
              {
                // @ts-ignore
                blog.series.seriesId?.title
              }{' '}
              - Part {blog.series.order}
            </div>
          </div>
        )}

        {/* Difficulty */}
        {blog.difficulty && (
          <div className="mt-3">
            <Badge
              variant="outline"
              className={`text-xs ${
                blog.difficulty === 'beginner'
                  ? 'border-green-500 text-green-700'
                  : blog.difficulty === 'intermediate'
                    ? 'border-yellow-500 text-yellow-700'
                    : 'border-red-500 text-red-700'
              }`}
            >
              {blog.difficulty.charAt(0).toUpperCase() + blog.difficulty.slice(1)}
            </Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {blog.viewCount}
            </div>
            {blog.readTime > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {blog.readTime} min
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {blog.publishedAt ? formatDate(blog.publishedAt) : formatDate(blog.createdAt)}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
