"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/hooks/useSidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogOut, Menu, Users, LayoutDashboard, Settings } from "lucide-react";

export default function AdminNavbar() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { toggle } = useSidebar();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLogoutDialogOpen(false);
  };

  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "AD";
  };

  return (
    <>
      <nav className="sticky top-0 z-40 flex h-14 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex w-full items-center justify-between px-4">
          {/* Left: Hamburger + App Name */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="text-lg font-bold">{t("app.name")}</span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              — Admin Panel
            </span>
          </div>

          {/* Right: Shortcuts + Profile + Logout */}
          <div className="flex items-center gap-2">
            {/* Dashboard Shortcuts */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="hidden sm:flex"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              User Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/team")}
              className="hidden sm:flex"
            >
              <Users className="mr-2 h-4 w-4" />
              Team Panel
            </Button>

            {/* Settings Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/settings")}
            >
              <Settings className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">{t("settings.title")}</span>
            </Button>

            {/* Profile Avatar */}
            <Avatar size="sm">
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>

            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLogoutDialogOpen(true)}
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">{t("common.logout")}</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("common.logoutConfirmTitle")}</DialogTitle>
            <DialogDescription>
              {t("common.logoutConfirmMessage")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              {t("common.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
