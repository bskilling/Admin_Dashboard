'use client';

import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Database,
  FolderKanban,
  Layers,
  FileText,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  Tags,
  BookOpen,
  List,
  CreditCard,
  Receipt,
  GraduationCap,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { RiCoupon2Fill } from 'react-icons/ri';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Agents', url: '/dashboard/agents', icon: Users },
  { title: 'Lead Management', url: '/dashboard/leads', icon: Users },
  { title: 'EMI Applications', url: '/dashboard/emi-leads', icon: Database },
  { title: 'Coupons', url: '/dashboard/coupons', icon: RiCoupon2Fill },
  { title: 'Courses', url: '/dashboard/categories?type=b2c', icon: FolderKanban },
  { title: 'Course Mapping', url: '/dashboard/course-mapping', icon: Layers },
];

const purchasesMenu = {
  title: 'Purchases',
  icon: CreditCard,
  baseUrl: '/dashboard/purchases',
  children: [
    { title: 'Overview', url: '/dashboard/purchases', icon: BarChart3 },
    { title: 'All Payments', url: '/dashboard/purchases/payments', icon: Receipt },
    { title: 'All Enrollments', url: '/dashboard/purchases/enrollments', icon: GraduationCap },
  ],
};

const blogMenuItem = {
  title: 'Blogs',
  url: '/admin/blogs',
  icon: BookOpen,
  children: [
    { title: 'All Blogs', url: '/admin/blogs', icon: List },
    { title: 'Create Blog', url: '/admin/blogs/create', icon: PlusCircle },
    { title: 'Drafts', url: '/admin/blogs/drafts', icon: FileText },
    { title: 'Published', url: '/admin/blogs/published', icon: BookOpen },
    { title: 'Series', url: '/admin/blogs/series', icon: Layers },
  ],
};

const categoryItems = [
  { title: 'All Categories', url: '/admin/categories', icon: List },
  { title: 'Create Category', url: '/admin/categories/create', icon: PlusCircle },
];

const tagItems = [
  { title: 'All Tags', url: '/admin/tags', icon: List },
  { title: 'Create Tag', url: '/admin/tags/create', icon: PlusCircle },
];

export function AppSidebar() {
  const pathname = usePathname();

  const [purchasesOpen, setPurchasesOpen] = useState(pathname?.startsWith('/dashboard/purchases'));
  const [blogMenuOpen, setBlogMenuOpen] = useState(pathname?.includes('/admin/blogs'));
  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(
    pathname?.includes('/admin/categories')
  );
  const [tagsMenuOpen, setTagsMenuOpen] = useState(pathname?.includes('/admin/tags'));

  return (
    <Sidebar className="bg-white min-h-screen border-r border-gray-100 shadow-sm">
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 px-6 py-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">bS</span>
            </div>
            <div className="ml-3">
              <h1 className="text-gray-900 text-lg font-semibold">bSkilling</h1>
              <p className="text-gray-600 text-xs">Admin Portal</p>
            </div>
          </div>
        </div>

        <SidebarContent className="flex-1 overflow-y-auto px-4 py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-600 text-xs font-medium uppercase px-2 mb-3">
              Main Navigation
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {menuItems.map(item => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className={`flex items-center px-3 py-2 rounded-md text-sm ${
                            isActive
                              ? 'text-indigo-700 bg-indigo-50 font-medium'
                              : 'text-gray-700 hover:text-indigo-700 hover:bg-gray-50'
                          }`}
                        >
                          <item.icon
                            className={`h-5 w-5 mr-3 ${isActive ? 'text-indigo-700' : 'text-gray-600'}`}
                          />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

                {/* ── Purchases dropdown ── */}
                <SidebarMenuItem>
                  <button
                    onClick={() => setPurchasesOpen(!purchasesOpen)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm ${
                      pathname?.startsWith('/dashboard/purchases')
                        ? 'text-indigo-700 bg-indigo-50 font-medium'
                        : 'text-gray-700 hover:text-indigo-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <CreditCard
                        className={`h-5 w-5 mr-3 ${pathname?.startsWith('/dashboard/purchases') ? 'text-indigo-700' : 'text-gray-600'}`}
                      />
                      <span>Purchases</span>
                    </div>
                    {purchasesOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  {purchasesOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      {purchasesMenu.children.map(child => {
                        const isActive = pathname === child.url;
                        return (
                          <Link
                            key={child.title}
                            href={child.url}
                            className={`flex items-center px-3 py-2 rounded-md text-sm ${
                              isActive
                                ? 'text-indigo-700 bg-indigo-50 font-medium'
                                : 'text-gray-600 hover:text-indigo-700 hover:bg-gray-50'
                            }`}
                          >
                            <child.icon className="h-4 w-4 mr-3" />
                            <span>{child.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </SidebarMenuItem>

                {/* ── Blogs dropdown ── */}
                <SidebarMenuItem>
                  <button
                    onClick={() => setBlogMenuOpen(!blogMenuOpen)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm ${
                      pathname?.includes('/admin/blogs')
                        ? 'text-indigo-700 bg-indigo-50 font-medium'
                        : 'text-gray-700 hover:text-indigo-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <BlogIcon
                        className={`h-5 w-5 mr-3 ${pathname?.includes('/admin/blogs') ? 'text-indigo-700' : 'text-gray-600'}`}
                      />
                      <span>Blogs</span>
                    </div>
                    {blogMenuOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  {blogMenuOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      {blogMenuItem.children.map(child => {
                        const isActive = pathname === child.url;
                        return (
                          <Link
                            key={child.title}
                            href={child.url}
                            className={`flex items-center px-3 py-2 rounded-md text-sm ${
                              isActive
                                ? 'text-indigo-700 bg-indigo-50 font-medium'
                                : 'text-gray-600 hover:text-indigo-700 hover:bg-gray-50'
                            }`}
                          >
                            <child.icon className="h-4 w-4 mr-3" />
                            <span>{child.title}</span>
                          </Link>
                        );
                      })}

                      {/* Categories */}
                      <div>
                        <button
                          onClick={() => setCategoriesMenuOpen(!categoriesMenuOpen)}
                          className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm ${
                            pathname?.includes('/admin/categories')
                              ? 'text-indigo-700 bg-indigo-50 font-medium'
                              : 'text-gray-600 hover:text-indigo-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <FolderKanban className="h-4 w-4 mr-3" />
                            <span>Categories</span>
                          </div>
                          {categoriesMenuOpen ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </button>
                        {categoriesMenuOpen && (
                          <div className="ml-6 mt-1 space-y-1">
                            {categoryItems.map(item => {
                              const isActive = pathname === item.url;
                              return (
                                <Link
                                  key={item.title}
                                  href={item.url}
                                  className={`flex items-center px-3 py-2 rounded-md text-xs ${isActive ? 'text-indigo-700 bg-indigo-50 font-medium' : 'text-gray-600 hover:text-indigo-700 hover:bg-gray-50'}`}
                                >
                                  <item.icon className="h-3 w-3 mr-2" />
                                  <span>{item.title}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      <div>
                        <button
                          onClick={() => setTagsMenuOpen(!tagsMenuOpen)}
                          className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm ${
                            pathname?.includes('/admin/tags')
                              ? 'text-indigo-700 bg-indigo-50 font-medium'
                              : 'text-gray-600 hover:text-indigo-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <Tags className="h-4 w-4 mr-3" />
                            <span>Tags</span>
                          </div>
                          {tagsMenuOpen ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </button>
                        {tagsMenuOpen && (
                          <div className="ml-6 mt-1 space-y-1">
                            {tagItems.map(item => {
                              const isActive = pathname === item.url;
                              return (
                                <Link
                                  key={item.title}
                                  href={item.url}
                                  className={`flex items-center px-3 py-2 rounded-md text-xs ${isActive ? 'text-indigo-700 bg-indigo-50 font-medium' : 'text-gray-600 hover:text-indigo-700 hover:bg-gray-50'}`}
                                >
                                  <item.icon className="h-3 w-3 mr-2" />
                                  <span>{item.title}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}

function BlogIcon({ className }: { className?: string }) {
  return <BookOpen className={className} />;
}
