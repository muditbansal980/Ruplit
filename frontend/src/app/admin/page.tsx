"use client";

import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import RoleRoute from "@/routes/RoleRoute";

function AdminDashboardContent() {
  const { t } = useTranslation();

  const { data: activities, isLoading: loadingActivities } = useQuery({
    queryKey: ["admin", "activities"],
    queryFn: () => adminApi.getActivities(),
  });

  const { data: teamStats, isLoading: loadingStats } = useQuery({
    queryKey: ["admin", "team-stats"],
    queryFn: adminApi.getTeamStats,
  });

  const { data: allRequests, isLoading: loadingRequests } = useQuery({
    queryKey: ["admin", "kyc-requests"],
    queryFn: adminApi.getAllKycRequests,
  });

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">{t("admin.title")}</h1>

        <Tabs defaultValue="activities">
          <TabsList className="mb-4">
            <TabsTrigger value="activities">{t("admin.activities")}</TabsTrigger>
            <TabsTrigger value="stats">{t("admin.teamStats")}</TabsTrigger>
            <TabsTrigger value="requests">{t("admin.allRequests")}</TabsTrigger>
          </TabsList>

          {/* Activity Feed */}
          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.activities")}</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingActivities ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : activities && activities.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Actor</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>
                            <Badge variant="outline">{activity.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{activity.actorRole}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {JSON.stringify(activity.details)}
                          </TableCell>
                          <TableCell className="text-zinc-500">
                            {new Date(activity.createdAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-zinc-500">{t("admin.noActivity")}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Stats */}
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.teamStats")}</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : teamStats && teamStats.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Accepted</TableHead>
                        <TableHead>Completed</TableHead>
                        <TableHead>Rejected</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamStats.map((stat) => (
                        <TableRow key={stat.id}>
                          <TableCell className="font-medium">{stat.name}</TableCell>
                          <TableCell>{stat.email}</TableCell>
                          <TableCell>{stat.accepted}</TableCell>
                          <TableCell>{stat.completed}</TableCell>
                          <TableCell>{stat.rejected}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-zinc-500">No team members</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All KYC Requests */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.allRequests")}</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingRequests ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : allRequests && allRequests.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mobile</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allRequests.map((req: any) => (
                        <TableRow key={req.id}>
                          <TableCell>{req.mobileNumber}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{req.mode}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                req.status === "VERIFIED"
                                  ? "default"
                                  : req.status === "REJECTED"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {req.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{req.assignedTeamMember?.name || "—"}</TableCell>
                          <TableCell className="text-zinc-500">
                            {new Date(req.createdAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-zinc-500">No requests</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <RoleRoute allowedRoles={["ADMIN"]}>
      <AdminDashboardContent />
    </RoleRoute>
  );
}
