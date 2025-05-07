// src/components/admin/AdminStatusToggle.tsx
import { useState } from "react";
import { IAdminUser } from "@/models/AdminUser";

export default function AdminStatusToggle({
  admin,
  onUpdate,
}: {
  admin: IAdminUser;
  onUpdate: (updatedAdmin: IAdminUser) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const toggleStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${admin._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !admin.isActive }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedAdmin = await response.json();
      onUpdate(updatedAdmin);
    } catch (error) {
      console.error("Error updating admin status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleStatus}
      disabled={isLoading}
      className={`px-3 py-1 rounded-md text-sm font-medium ${
        admin.isActive
          ? "bg-green-100 text-green-800 hover:bg-green-200"
          : "bg-red-100 text-red-800 hover:bg-red-200"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {admin.isActive ? "Active" : "Inactive"}
    </button>
  );
}
