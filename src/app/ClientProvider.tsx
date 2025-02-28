"use client";

// import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "./Provider"; // Your existing provider file
import Sidebar from "../components/global/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense, useMemo } from "react";
import { Toaster } from "../components/ui/sonner";
import { usePathname, useSearchParams } from "next/navigation";
import Protected from "./hooks/useProtected";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSidebar = useMemo(() => {
    const previewMode = searchParams.get("preview") === "true";
    const path = pathname?.split("/");
    console.log(path);
    if (path?.includes("draft")) return false;
    return !previewMode;
  }, [searchParams, pathname]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QueryClientProvider client={queryClient}>
        <Providers>
          <NextTopLoader />
          <>
            {isSidebar ? (
              <>
                <div className="flex h-screen w-full">
                  <Sidebar />{" "}
                  <div className="h-screen overflow-y-auto w-full relative ">
                    {children}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-screen overflow-y-auto w-full relative ">
                {children}
              </div>
            )}
          </>
          <Toaster richColors position="top-right" />
          {/* <Toaster position="top-center" reverseOrder={false} /> */}
        </Providers>
      </QueryClientProvider>
    </Suspense>
  );
}
