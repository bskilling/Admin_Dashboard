"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log(session, status);
    if (status === "unauthenticated") {
      router.push("/auth/signin"); // Redirect if not logged in
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!session) return null; // Prevents rendering until session is confirmed

  return <>{children}</>;
}
