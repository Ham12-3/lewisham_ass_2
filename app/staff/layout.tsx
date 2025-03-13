"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if already on the login page
    if (pathname === "/staff/login") {
      return;
    }

    if (!loading && (!user || !user.staff)) {
      toast.error("Access denied", {
        description: "You don't have permission to access staff pages.",
      });

      // Redirect to staff login with the return URL
      const returnUrl = encodeURIComponent(pathname || "/staff");
      router.push(`/staff/login?redirectTo=${returnUrl}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // If on login page, show the login page regardless of auth status
  if (pathname === "/staff/login") {
    return <>{children}</>;
  }

  // For other staff pages, don't render if not staff
  if (!user || !user.staff) {
    return null; // Don't render anything, will redirect
  }

  return <>{children}</>;
}
