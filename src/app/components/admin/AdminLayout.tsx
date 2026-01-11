import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { Navigate } from "react-router-dom";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-0 overflow-x-hidden">
        <div className="p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

