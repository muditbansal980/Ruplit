"use client";

import { useTranslation } from "react-i18next";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import {
  Users,
  CreditCard,
  UserPlus,
  FileCheck,
  BarChart3,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export type AdminSection =
  | "overview"
  | "users"
  | "transactions"
  | "add-member"
  | "kyc-requests"
  | "team-stats"
  | "activity-log";

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

const menuItems: { id: AdminSection; icon: React.ElementType; labelKey: string }[] = [
  { id: "overview", icon: BarChart3, labelKey: "admin.sidebar.overview" },
  { id: "users", icon: Users, labelKey: "admin.sidebar.users" },
  { id: "transactions", icon: CreditCard, labelKey: "admin.sidebar.transactions" },
  { id: "add-member", icon: UserPlus, labelKey: "admin.sidebar.addMember" },
  { id: "kyc-requests", icon: FileCheck, labelKey: "admin.sidebar.kycRequests" },
  { id: "team-stats", icon: BarChart3, labelKey: "admin.sidebar.teamStats" },
  { id: "activity-log", icon: Activity, labelKey: "admin.sidebar.activityLog" },
];

export default function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const { t } = useTranslation();
  const { isOpen, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "sticky top-14 z-30 flex h-[calc(100vh-3.5rem)] flex-col border-r bg-background transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  title={!isOpen ? t(item.labelKey) : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {isOpen && <span className="truncate">{t(item.labelKey)}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Toggle Button */}
      <div className="border-t p-2">
        <button
          onClick={toggle}
          className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {isOpen ? (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span className="ml-2">Collapse</span>
            </>
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
