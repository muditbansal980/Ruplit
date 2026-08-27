"use client";

import { useTranslation } from "react-i18next";
import {
  useKycRequests,
  useAcceptKycRequest,
  useRejectKycRequest,
  useVerifyKycRequest,
} from "@/hooks/useKyc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X, Upload } from "lucide-react";
import RoleRoute from "@/routes/RoleRoute";
import { useSocket } from "@/hooks/useSocket";

function TeamDashboardContent() {
  const { t } = useTranslation();
  const socket = useSocket();

  const { data: liveRequests, isLoading: loadingLive } = useKycRequests("live");
  const { data: myAccepted, isLoading: loadingMine } = useKycRequests("mine");
  const { data: reviewQueue, isLoading: loadingReview } = useKycRequests("review-queue");

  const acceptRequest = useAcceptKycRequest();
  const rejectRequest = useRejectKycRequest();
  const verifyRequest = useVerifyKycRequest();

  const renderRequestCard = (
    request: any,
    actions?: { accept?: boolean; reject?: boolean; verify?: boolean }
  ) => (
    <Card key={request.id} className="mb-3">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium">{request.mobileNumber}</p>
            {request.user?.email && (
              <p className="text-sm text-zinc-500">{request.user.email}</p>
            )}
            <div className="mt-2 flex gap-2">
              <Badge variant="outline">{request.mode}</Badge>
              <Badge
                variant={
                  request.status === "PENDING"
                    ? "secondary"
                    : request.status === "VERIFIED"
                    ? "default"
                    : "destructive"
                }
              >
                {request.status}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2">
            {actions?.accept && (
              <Button
                size="sm"
                onClick={() => acceptRequest.mutateAsync(request.id)}
                disabled={acceptRequest.isPending}
              >
                <Check className="mr-1 h-4 w-4" />
                {t("team.accept")}
              </Button>
            )}
            {actions?.verify && (
              <Button
                size="sm"
                onClick={() => verifyRequest.mutateAsync(request.id)}
                disabled={verifyRequest.isPending}
              >
                <Upload className="mr-1 h-4 w-4" />
                {t("team.verify")}
              </Button>
            )}
            {actions?.reject && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => rejectRequest.mutateAsync(request.id)}
                disabled={rejectRequest.isPending}
              >
                <X className="mr-1 h-4 w-4" />
                {t("team.reject")}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSkeletons = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  );

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">{t("team.title")}</h1>

        <Tabs defaultValue="live">
          <TabsList className="mb-4">
            <TabsTrigger value="live">
              {t("team.liveRequests")} ({liveRequests?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="mine">
              {t("team.myAccepted")} ({myAccepted?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="review">
              {t("team.reviewQueue")} ({reviewQueue?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Live Requests */}
          <TabsContent value="live">
            {loadingLive ? (
              renderSkeletons()
            ) : liveRequests && liveRequests.length > 0 ? (
              liveRequests.map((req) =>
                renderRequestCard(req, { accept: true, reject: true })
              )
            ) : (
              <p className="text-center text-zinc-500">{t("team.noRequests")}</p>
            )}
          </TabsContent>

          {/* My Accepted */}
          <TabsContent value="mine">
            {loadingMine ? (
              renderSkeletons()
            ) : myAccepted && myAccepted.length > 0 ? (
              myAccepted.map((req) =>
                renderRequestCard(req, { verify: true, reject: true })
              )
            ) : (
              <p className="text-center text-zinc-500">{t("team.noRequests")}</p>
            )}
          </TabsContent>

          {/* Review Queue */}
          <TabsContent value="review">
            {loadingReview ? (
              renderSkeletons()
            ) : reviewQueue && reviewQueue.length > 0 ? (
              reviewQueue.map((req) =>
                renderRequestCard(req, { verify: true, reject: true })
              )
            ) : (
              <p className="text-center text-zinc-500">{t("team.noRequests")}</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

export default function TeamPage() {
  return (
    <RoleRoute allowedRoles={["TEAM"]}>
      <TeamDashboardContent />
    </RoleRoute>
  );
}
