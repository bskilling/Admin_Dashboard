"use client";

// import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense, useMemo } from "react";
import { Toaster } from "../components/ui/sonner";
import { usePathname, useSearchParams } from "next/navigation";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SessionProvider } from "next-auth/react";
import Protected from "@/hooks/useProtected";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSidebar = useMemo(() => {
    const previewMode = searchParams.get("preview") === "true";
    const siginPage = pathname === "/auth/signin";
    if (siginPage) return false;
    const path = pathname?.split("/");
    console.log(path);
    if (path?.includes("draft")) return false;
    return !previewMode;
  }, [searchParams, pathname]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <NextTopLoader />
          <>
            {isSidebar ? (
              <>
                <SidebarProvider>
                  <AppSidebar />
                  <main className="w-full">
                    <SidebarTrigger />
                    <div className="flex h-screen w-full">
                      <div className="h-screen overflow-y-auto w-full relative ">
                        {children}
                      </div>
                    </div>
                  </main>
                </SidebarProvider>
              </>
            ) : (
              <div className="h-screen overflow-y-auto w-full relative ">
                {children}
              </div>
            )}
          </>
          <Toaster richColors position="top-right" />
          {/* <Toaster position="top-center" reverseOrder={false} /> */}
        </QueryClientProvider>
      </SessionProvider>
    </Suspense>
  );
}
