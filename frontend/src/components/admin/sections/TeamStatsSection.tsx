"use client";

import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, TrendingUp } from "lucide-react";

export default function TeamStatsSection() {
  const { t } = useTranslation();

  const { data: teamStats, isLoading } = useQuery({
    queryKey: ["admin", "team-stats"],
    queryFn: () => adminApi.getTeamStats(),
  });

  const members = teamStats || [];

  const totalAccepted = members.reduce((sum, m) => sum + m.accepted, 0);
  const totalCompleted = members.reduce((sum, m) => sum + m.completed, 0);
  const completionRate = totalAccepted > 0 ? ((totalCompleted / totalAccepted) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("admin.sidebar.teamStats")}</h2>
        <Badge variant="secondary">{members.length} active</Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Accepted
            </CardTitle>
            <BarChart3 className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAccepted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCompleted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : members.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No team members found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Accepted</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Rejected</TableHead>
                  <TableHead>Success Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => {
                  const successRate =
                    member.accepted > 0
                      ? ((member.completed / member.accepted) * 100).toFixed(0)
                      : "0";
                  return (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.accepted}</TableCell>
                      <TableCell>{member.completed}</TableCell>
                      <TableCell>{member.rejected}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            Number(successRate) >= 80
                              ? "default"
                              : Number(successRate) >= 50
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {successRate}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
