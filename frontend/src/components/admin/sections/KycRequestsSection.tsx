"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export default function KycRequestsSection() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const { data: kycRequests, isLoading } = useQuery({
    queryKey: ["admin", "kyc-requests"],
    queryFn: () => adminApi.getAllKycRequests(),
  });

  const requests = kycRequests || [];

  const filteredRequests = requests.filter(
    (req) =>
      req.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      req.mobileNumber.includes(search)
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "default";
      case "IN_REVIEW":
        return "secondary";
      case "PENDING":
        return "outline";
      case "REJECTED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const inReviewCount = requests.filter((r) => r.status === "IN_REVIEW").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("admin.sidebar.kycRequests")}</h2>
        <div className="flex gap-2">
          <Badge variant="outline">{pendingCount} pending</Badge>
          <Badge variant="secondary">{inReviewCount} in review</Badge>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by email or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* KYC Requests Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{req.user?.email || "—"}</p>
                        <p className="text-xs text-muted-foreground">{req.user?.id?.slice(0, 8)}...</p>
                      </div>
                    </TableCell>
                    <TableCell>{req.mobileNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{req.mode}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(req.status)}>
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{req.assignedTeamMember?.name || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No KYC requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
