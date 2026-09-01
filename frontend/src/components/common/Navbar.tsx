"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogOut, Settings } from "lucide-react";

export default function Navbar() {
  const { t } = useTranslation();
  const router = useRouter();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* App Name - Left */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">{t("app.name")}</span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Settings Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/settings")}
          >
            <Settings className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">{t("settings.title")}</span>
          </Button>

          {/* Logout Button */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant="outline" size="sm">Open</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("common.logoutConfirmTitle")}</DialogTitle>
                <DialogDescription>
                  {t("common.logoutConfirmMessage")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  {t("common.confirm")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
}
