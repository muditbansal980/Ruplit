"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { adminApi, type User } from "@/api/admin.api";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UsersSection() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", page, search],
    queryFn: () =>
      adminApi.getUsers({
        page,
        limit: 10,
        search: search || undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const { data: userDetail, isLoading: loadingDetail } = useQuery({
    queryKey: ["admin", "user", selectedUser?.id],
    queryFn: () => adminApi.getUserById(selectedUser!.id),
    enabled: !!selectedUser?.id && detailOpen,
  });

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setDetailOpen(true);
  };

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

  const users = data?.users || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("admin.sidebar.users")}</h2>
        <Badge variant="secondary">
          {pagination?.total || 0} users
        </Badge>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or mobile..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-10"
        />
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email / Mobile</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Expenses</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.email || "—"}</p>
                        <p className="text-sm text-muted-foreground">{user.mobileNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>{user.mobileNumber}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(user.kycStatus)}>
                        {user.kycStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {(user._count?.lentExpenses || 0) + (user._count?.borrowedExpenses || 0)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewUser(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* User Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {loadingDetail ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : userDetail ? (
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{userDetail.email || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium">{userDetail.mobileNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">KYC Status</p>
                  <Badge variant={getStatusVariant(userDetail.kycStatus)}>
                    {userDetail.kycStatus}
                  </Badge>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 rounded-lg bg-muted p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">₹{userDetail.stats.totalLent.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-muted-foreground">Total Lent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">₹{userDetail.stats.totalBorrowed.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-muted-foreground">Total Borrowed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{userDetail.stats.totalExpenses}</p>
                  <p className="text-xs text-muted-foreground">Expenses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{userDetail.stats.kycRequests}</p>
                  <p className="text-xs text-muted-foreground">KYC Requests</p>
                </div>
              </div>

              {/* Recent Expenses */}
              {userDetail.lentExpenses.length > 0 && (
                <div>
                  <p className="mb-2 font-medium">Recent Lent Expenses</p>
                  <div className="space-y-2">
                    {userDetail.lentExpenses.slice(0, 3).map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between rounded border p-2 text-sm">
                        <span>Lent to {expense.borrower.name}</span>
                        <span className="font-medium">₹{Number(expense.amount).toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
