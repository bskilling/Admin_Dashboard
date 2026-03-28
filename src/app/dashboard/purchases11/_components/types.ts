// types/purchase.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Course {
  _id: string;
  title: string;
  price: {
    amount: number;
    currency: string;
  };
  banner?: string;
  previewImage?: string;
  slug: string;
  description?: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
}

export type PurchaseStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface Purchase {
  _id: string;
  userId: string;
  courseId: string;
  orderId: string;
  amount: string;
  currency: string;
  status: PurchaseStatus;
  rawResponse?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  coupon?: string;
  userDetails?: User;
  courseDetails?: Course;
  couponDetails?: Coupon;
  agentDetails?: {
    name: string;
    profileImage?: string;
  };
}

export interface PurchaseFilters {
  page: number;
  limit: number;
  status: string;
  courseId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface StatusDistribution {
  SUCCESS: {
    count: number;
    totalAmount: number;
    percentage: number;
  };
  PENDING: {
    count: number;
    totalAmount: number;
    percentage: number;
  };
  FAILED: {
    count: number;
    totalAmount: number;
    percentage: number;
  };
}

export interface OverallStats {
  totalPurchases: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface MonthlyTrend {
  _id: {
    year: number;
    month: number;
  };
  count: number;
  revenue: number;
}

export interface TopCourse {
  _id: string;
  purchaseCount: number;
  revenue: number;
  courseDetails: {
    title: string;
    slug: string;
  };
}

export interface RecentActivity {
  _id: string;
  count: number;
  revenue: number;
}

export interface PurchaseStats {
  statusDistribution: StatusDistribution;
  overall: OverallStats;
  monthlyTrends: MonthlyTrend[];
  topCourses: TopCourse[];
  recentActivity: RecentActivity[];
}

export interface PurchaseResponse {
  success: boolean;
  data: {
    purchases: Purchase[];
    pagination: Pagination;
    stats: PurchaseStats;
    filters: Partial<PurchaseFilters>;
  };
}

export interface SinglePurchaseResponse {
  success: boolean;
  data: Purchase;
}

export interface AnalyticsResponse {
  success: boolean;
  data: PurchaseStats;
}
