"use client";

import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, CreditCard, FileCheck, Activity } from "lucide-react";

export default function OverviewSection() {
  const { t } = useTranslation();

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["admin", "users-overview"],
    queryFn: () => adminApi.getUsers({ limit: 1000 }),
  });

  const { data: kycRequests, isLoading: loadingKyc } = useQuery({
    queryKey: ["admin", "kyc-requests"],
    queryFn: () => adminApi.getAllKycRequests(),
  });

  const { data: teamStats, isLoading: loadingTeam } = useQuery({
    queryKey: ["admin", "team-stats"],
    queryFn: () => adminApi.getTeamStats(),
  });

  const totalUsers = usersData?.pagination?.total || 0;
  const users = usersData?.users || [];
  const verifiedUsers = users.filter((u) => u.kycStatus === "VERIFIED").length;
  const totalExpenses = users.reduce(
    (sum, u) => sum + (u._count?.lentExpenses || 0) + (u._count?.borrowedExpenses || 0),
    0
  );
  const totalTeamMembers = teamStats?.length || 0;
  const kycList = kycRequests || [];
  const pendingKyc = kycList.filter((r) => r.status === "PENDING").length;
  const inReviewKyc = kycList.filter((r) => r.status === "IN_REVIEW").length;

  const isLoading = loadingUsers || loadingKyc || loadingTeam;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      description: `${verifiedUsers} verified`,
      color: "text-blue-600",
    },
    {
      title: "Expenses",
      value: totalExpenses,
      icon: CreditCard,
      description: "Lent + Borrowed",
      color: "text-green-600",
    },
    {
      title: "Team Members",
      value: totalTeamMembers,
      icon: Users,
      description: "Active agents",
      color: "text-purple-600",
    },
    {
      title: "Pending KYC",
      value: pendingKyc,
      icon: FileCheck,
      description: `${inReviewKyc} in review`,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t("admin.sidebar.overview")}</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-20 mt-1" />
                </CardContent>
              </Card>
            ))
          : stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Recent Activity Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quick Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">KYC Verified</span>
              <Badge variant="default">{verifiedUsers}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">KYC Pending</span>
              <Badge variant="secondary">{pendingKyc}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Team Members</span>
              <Badge variant="outline">{totalTeamMembers}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
