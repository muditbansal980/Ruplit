"use client";

import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, UserPlus, FileCheck, CreditCard, Shield } from "lucide-react";

const getActivityIcon = (type: string) => {
  switch (type) {
    case "signup":
      return UserPlus;
    case "kyc_submitted":
    case "kyc_accepted":
    case "kyc_verified":
    case "kyc_rejected":
      return FileCheck;
    case "expense_created":
      return CreditCard;
    case "team_member_added":
      return Shield;
    default:
      return Activity;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "signup":
      return "text-blue-500 bg-blue-50";
    case "kyc_submitted":
      return "text-yellow-500 bg-yellow-50";
    case "kyc_accepted":
      return "text-green-500 bg-green-50";
    case "kyc_verified":
      return "text-green-600 bg-green-50";
    case "kyc_rejected":
      return "text-red-500 bg-red-50";
    case "expense_created":
      return "text-purple-500 bg-purple-50";
    case "team_member_added":
      return "text-indigo-500 bg-indigo-50";
    default:
      return "text-gray-500 bg-gray-50";
  }
};

export default function ActivityLogSection() {
  const { t } = useTranslation();

  const { data: activities, isLoading } = useQuery({
    queryKey: ["admin", "activities"],
    queryFn: () => adminApi.getActivities(50),
  });

  const activityList = activities || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("admin.sidebar.activityLog")}</h2>
        <Badge variant="secondary">{activityList.length} events</Badge>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </div>
              ))}
            </div>
          ) : activityList.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No activity recorded yet</p>
          ) : (
            <div className="space-y-4">
              {activityList.map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                const colorClass = getActivityColor(activity.type);
                return (
                  <div key={activity.id} className="flex gap-4">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${colorClass}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      {index < activityList.length - 1 && (
                        <div className="w-px flex-1 bg-border" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {activity.actorRole}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {activity.details
                          ? typeof activity.details === "string"
                            ? activity.details
                            : JSON.stringify(activity.details)
                          : "No details"}
                      </p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {activity.type.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
