"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Inbox,
  Database,
  ArrowUpDown,
  FolderKanban,
  Layers,
  Cpu,
  Wrench,
  Settings,
} from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Improved menu items with better naming and icon selection
const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Lead Management", url: "/dashboard/leads", icon: Users },
  { title: "Edmingle Users", url: "/dashboard/edmingle-users", icon: Inbox },
  { title: "EMI Applications", url: "/dashboard/emi-leads", icon: Database },
  { title: "Data Migration", url: "/dashboard/migration", icon: ArrowUpDown },
  {
    title: "Categories",
    url: "/dashboard/categories?type=b2c",
    icon: FolderKanban,
  },
  { title: "Course Mapping", url: "/dashboard/course-mapping", icon: Layers },
  { title: "Skill Library", url: "/dashboard/skills", icon: Cpu },
  { title: "Tool Repository", url: "/dashboard/tools", icon: Wrench },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="bg-white min-h-screen border-r border-gray-100 shadow-sm">
      <SidebarContent className="px-4 py-6">
        {/* Logo Header */}
        <div className="mb-8 px-2">
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

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 text-xs font-medium uppercase px-2 mb-3">
            Main Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center px-3 py-2 rounded-md text-sm ${
                          isActive
                            ? "text-indigo-700 bg-indigo-50 font-medium"
                            : "text-gray-700 hover:text-indigo-700 hover:bg-gray-50"
                        }`}
                      >
                        <item.icon
                          className={`h-5 w-5 mr-3 ${
                            isActive ? "text-indigo-700" : "text-gray-600"
                          }`}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-xs font-medium text-indigo-700">AD</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">Admin User</p>
                <p className="text-xs text-gray-600">admin@edmingle.com</p>
              </div>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
