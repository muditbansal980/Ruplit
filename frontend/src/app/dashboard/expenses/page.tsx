"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFriends, useAddFriend, useAddExpense } from "@/hooks/useExpenses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, UserPlus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { toast } from "sonner";
import { useRegisterPage } from "@/hooks/useRegisterPage";
import { useRegisterField } from "@/hooks/useRegisterField";

const friendSchema = z.object({
  phoneNumber: z.string().min(10, "Enter a valid phone number"),
});

const expenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
});

function ExpensesContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: friends, isLoading } = useFriends();
  const addFriend = useAddFriend();
  const addExpense = useAddExpense();
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  useRegisterPage({
    route: "/dashboard/expenses",
    title: "Expense Record",
    description:
      "A page for recording money lent to or borrowed from friends. The user can add friends by phone number, then log an expense (amount and description) against a selected friend. Use this page when the user wants to track loans, lending, borrowing, or money given to someone.",
  });

  // Register form fields so the agent can highlight/fill them.
  const phoneFieldRef = useRegisterField({ id: "friend-phone", label: "Friend's phone number", type: "tel", required: true });
  const amountFieldRef = useRegisterField({ id: "amount", label: "Amount", type: "number", required: true });
  const descriptionFieldRef = useRegisterField({ id: "description", label: "Description", type: "text", required: true });

  const friendForm = useForm<z.infer<typeof friendSchema>>({
    resolver: zodResolver(friendSchema),
  });

  const expenseForm = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
  });

  const onAddFriend = async (data: z.infer<typeof friendSchema>) => {
    await addFriend.mutateAsync(data.phoneNumber);
    friendForm.reset();
  };

  const onAddExpense = async (data: z.infer<typeof expenseSchema>) => {
    if (!selectedFriend) {
      toast.error("Please select a friend first");
      return;
    }
    await addExpense.mutateAsync({
      friendId: selectedFriend,
      amount: data.amount,
      description: data.description,
    });
    expenseForm.reset();
    setSelectedFriend(null);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">{t("expenses.title")}</h1>
        </div>

        <Tabs defaultValue="friends">
          <TabsList className="mb-4">
            <TabsTrigger value="friends">{t("expenses.friends")}</TabsTrigger>
            <TabsTrigger value="add">{t("expenses.addExpense")}</TabsTrigger>
          </TabsList>

          {/* Friends List */}
          <TabsContent value="friends">
            <Card>
              <CardHeader>
                <CardTitle>{t("expenses.friends")}</CardTitle>
                <CardDescription>{t("expenses.noFriends")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Friend Form */}
                <form onSubmit={friendForm.handleSubmit(onAddFriend)} className="flex gap-2">
                  <Input
                    placeholder={t("expenses.friendPhone")}
                    {...friendForm.register("phoneNumber")}
                    ref={(node) => {
                      phoneFieldRef(node);
                      const { ref: rhfRef } = friendForm.register("phoneNumber");
                      if (typeof rhfRef === "function") rhfRef(node);
                    }}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={addFriend.isPending}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {t("expenses.addFriend")}
                  </Button>
                </form>

                {friendForm.formState.errors.phoneNumber && (
                  <p className="text-sm text-red-500">
                    {friendForm.formState.errors.phoneNumber.message}
                  </p>
                )}

                {/* Friends List */}
                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : friends && friends.length > 0 ? (
                  <div className="space-y-2">
                    {friends.map((friend) => (
                      <div
                        key={friend.id}
                        className={`flex items-center justify-between rounded-lg border p-3 ${
                          selectedFriend === friend.friendId
                            ? "border-zinc-800 bg-zinc-50 dark:border-zinc-300 dark:bg-zinc-800"
                            : ""
                        }`}
                      >
                        <div>
                          <p className="font-medium">{friend.friend.mobileNumber}</p>
                          <p className="text-sm text-zinc-500">{friend.friend.email}</p>
                        </div>
                        <Button
                          variant={selectedFriend === friend.friendId ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            setSelectedFriend(
                              selectedFriend === friend.friendId ? null : friend.friendId
                            )
                          }
                        >
                          {selectedFriend === friend.friendId ? "Selected" : "Select"}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-zinc-500">{t("expenses.noFriends")}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Expense */}
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>{t("expenses.addExpense")}</CardTitle>
                <CardDescription>
                  {selectedFriend
                    ? `Lending to: ${friends?.find((f) => f.friendId === selectedFriend)?.friend.mobileNumber}`
                    : "Select a friend first from the Friends tab"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={expenseForm.handleSubmit(onAddExpense)} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t("expenses.amount")}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...expenseForm.register("amount")}
                      ref={(node) => {
                        amountFieldRef(node);
                        const { ref: rhfRef } = expenseForm.register("amount");
                        if (typeof rhfRef === "function") rhfRef(node);
                      }}
                    />
                    {expenseForm.formState.errors.amount && (
                      <p className="text-sm text-red-500">
                        {expenseForm.formState.errors.amount.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>{t("expenses.description")}</Label>
                    <Input
                      placeholder="What was this expense for?"
                      {...expenseForm.register("description")}
                      ref={(node) => {
                        descriptionFieldRef(node);
                        const { ref: rhfRef } = expenseForm.register("description");
                        if (typeof rhfRef === "function") rhfRef(node);
                      }}
                    />
                    {expenseForm.formState.errors.description && (
                      <p className="text-sm text-red-500">
                        {expenseForm.formState.errors.description.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!selectedFriend || addExpense.isPending}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t("expenses.addExpense")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

export default function ExpensesPage() {
  return (
    <ProtectedRoute requiredRole="USER">
      <ExpensesContent />
    </ProtectedRoute>
  );
}
