"use client";

import { usePathname } from "next/navigation";
import {
  Calendar,
  CircuitBoard,
  Home,
  Inbox,
  Search,
  Settings,
  Slack,
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

// Menu items.
const items = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Leads", url: "/dashboard/leads", icon: Inbox },
  { title: "Emi-leads", url: "/dashboard/emi-leads", icon: Inbox },
  { title: "Migration", url: "/dashboard/migration", icon: Inbox },
  { title: "Categories", url: "/dashboard/categories?type=b2c", icon: Slack },
  { title: "Skills", url: "/dashboard/skills", icon: CircuitBoard },
  { title: "Tools", url: "/dashboard/tools", icon: CircuitBoard },
  // { title: "Courses", url: "/dashboard/new-courses", icon: Calendar },
  // { title: "Trainings", url: "/dashboard/learning/trainings", icon: Search },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className=" bg-[#f5f5f5] text-[#222] min-h-screen shadow-xl border-r border-gray-300 px-5 py-6">
      <SidebarContent>
        {/* Sidebar Header */}
        <div className="p-5 text-2xl font-extrabold text-center uppercase bg-gradient-to-r from-[#444] to-[#222] text-white rounded-lg shadow-md tracking-wider">
          Dashboard
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[#444] text-sm uppercase font-semibold px-3 mt-6 tracking-wide">
            Quick Access
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-3 mt-2">
              {items.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title} className="rounded-lg">
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center gap-4 px-5 py-3 rounded-lg text-lg font-semibold transition-all duration-200 
                          ${
                            isActive
                              ? "bg-gradient-to-r from-[#222] to-[#444] text-white shadow-lg scale-105"
                              : "text-[#222] hover:bg-[#ddd] hover:text-[#111] transition-all"
                          }`}
                      >
                        <item.icon
                          className={`h-6 w-6 ${
                            isActive ? "text-white" : "text-[#555]"
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
      </SidebarContent>
    </Sidebar>
  );
}
