"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSidebar, type AdminSection } from "@/hooks/useSidebar";
import RoleRoute from "@/routes/RoleRoute";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import OverviewSection from "@/components/admin/sections/OverviewSection";
import UsersSection from "@/components/admin/sections/UsersSection";
import TransactionsSection from "@/components/admin/sections/TransactionsSection";
import AddMemberSection from "@/components/admin/sections/AddMemberSection";
import KycRequestsSection from "@/components/admin/sections/KycRequestsSection";
import TeamStatsSection from "@/components/admin/sections/TeamStatsSection";
import ActivityLogSection from "@/components/admin/sections/ActivityLogSection";
import { cn } from "@/lib/utils";

function AdminDashboardContent() {
  const { t } = useTranslation();
  const { isOpen } = useSidebar();
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />;
      case "users":
        return <UsersSection />;
      case "transactions":
        return <TransactionsSection />;
      case "add-member":
        return <AddMemberSection />;
      case "kyc-requests":
        return <KycRequestsSection />;
      case "team-stats":
        return <TeamStatsSection />;
      case "activity-log":
        return <ActivityLogSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <AdminNavbar />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 p-6 transition-all duration-300",
            isOpen ? "ml-0" : "ml-0"
          )}
        >
          <div className="mx-auto max-w-7xl">{renderSection()}</div>
        </main>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <RoleRoute allowedRoles={["ADMIN"]}>
      <AdminDashboardContent />
    </RoleRoute>
  );
}
