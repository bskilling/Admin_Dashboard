"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/utils/AuthUser";
import { useAuthMutation } from "@/redux/features/auth/authApi";

interface ProtectedProps {
  children: React.ReactNode;
}

interface LoginResponse {
  isLog: boolean;
}

export default function Protected({ children }: ProtectedProps) {
  const router = useRouter();
  const [auth, { isSuccess, data, error }] = useAuthMutation();

  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("/"); // Redirect to login page if token is not present
          return;
        }

        const response = await auth({ token });

        if ("data" in response && !response?.data?.isLog) {
          router.push("/dashboard/learning/trainings");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.push("/");
      }
    };

    isAuthenticated();
  }, [router, auth]);

  if (isSuccess && data?.isLog) {
    return <>{children}</>;
  }
}
