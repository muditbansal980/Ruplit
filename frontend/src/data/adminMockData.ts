// Mock data for admin portal — will be replaced with API calls later

export interface MockUser {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  kycStatus: "PENDING" | "IN_REVIEW" | "VERIFIED" | "REJECTED";
  role: "USER" | "TEAM" | "ADMIN";
  createdAt: string;
}

export interface MockTransaction {
  id: string;
  lenderName: string;
  borrowerName: string;
  amount: number;
  description: string;
  createdAt: string;
  emailSent: boolean;
}

export interface MockTeamMember {
  id: string;
  name: string;
  email: string;
  role: "TEAM" | "ADMIN";
  accepted: number;
  completed: number;
  rejected: number;
  createdAt: string;
}

export interface MockKycRequest {
  id: string;
  userName: string;
  mobileNumber: string;
  email: string;
  mode: "ASSISTED" | "SELF";
  status: "PENDING" | "IN_REVIEW" | "VERIFIED" | "REJECTED";
  assignedTo: string | null;
  createdAt: string;
}

export interface MockActivity {
  id: string;
  type: string;
  actorName: string;
  actorRole: "USER" | "TEAM" | "ADMIN";
  details: string;
  createdAt: string;
}

// ── Mock Users ──────────────────────────────────────────
export const mockUsers: MockUser[] = [
  {
    id: "u1",
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    mobileNumber: "9876543210",
    kycStatus: "VERIFIED",
    role: "USER",
    createdAt: "2026-08-15T10:30:00Z",
  },
  {
    id: "u2",
    name: "Priya Patel",
    email: "priya@gmail.com",
    mobileNumber: "9876543211",
    kycStatus: "IN_REVIEW",
    role: "USER",
    createdAt: "2026-08-16T11:45:00Z",
  },
  {
    id: "u3",
    name: "Amit Kumar",
    email: "amit@gmail.com",
    mobileNumber: "9876543212",
    kycStatus: "PENDING",
    role: "USER",
    createdAt: "2026-08-17T09:00:00Z",
  },
  {
    id: "u4",
    name: "Sneha Gupta",
    email: "sneha@gmail.com",
    mobileNumber: "9876543213",
    kycStatus: "REJECTED",
    role: "USER",
    createdAt: "2026-08-18T14:20:00Z",
  },
  {
    id: "u5",
    name: "Vikram Singh",
    email: "vikram@gmail.com",
    mobileNumber: "9876543214",
    kycStatus: "VERIFIED",
    role: "USER",
    createdAt: "2026-08-19T08:15:00Z",
  },
  {
    id: "u6",
    name: "Anjali Reddy",
    email: "anjali@gmail.com",
    mobileNumber: "9876543215",
    kycStatus: "PENDING",
    role: "USER",
    createdAt: "2026-08-20T16:00:00Z",
  },
];

// ── Mock Transactions ───────────────────────────────────
export const mockTransactions: MockTransaction[] = [
  {
    id: "t1",
    lenderName: "Rahul Sharma",
    borrowerName: "Priya Patel",
    amount: 2500,
    description: "Dinner at restaurant",
    createdAt: "2026-08-25T18:30:00Z",
    emailSent: true,
  },
  {
    id: "t2",
    lenderName: "Amit Kumar",
    borrowerName: "Vikram Singh",
    amount: 5000,
    description: "Movie tickets",
    createdAt: "2026-08-26T12:00:00Z",
    emailSent: true,
  },
  {
    id: "t3",
    lenderName: "Sneha Gupta",
    borrowerName: "Rahul Sharma",
    amount: 1200,
    description: "Groceries",
    createdAt: "2026-08-27T09:45:00Z",
    emailSent: false,
  },
  {
    id: "t4",
    lenderName: "Priya Patel",
    borrowerName: "Anjali Reddy",
    amount: 8000,
    description: "Rent share",
    createdAt: "2026-08-28T11:20:00Z",
    emailSent: true,
  },
  {
    id: "t5",
    lenderName: "Vikram Singh",
    borrowerName: "Amit Kumar",
    amount: 350,
    description: "Auto fare",
    createdAt: "2026-08-29T15:10:00Z",
    emailSent: true,
  },
];

// ── Mock Team Members ───────────────────────────────────
export const mockTeamMembers: MockTeamMember[] = [
  {
    id: "tm1",
    name: "Agent Ravi",
    email: "ravi@banksahayak.com",
    role: "TEAM",
    accepted: 12,
    completed: 10,
    rejected: 2,
    createdAt: "2026-08-10T10:00:00Z",
  },
  {
    id: "tm2",
    name: "Agent Meena",
    email: "meena@banksahayak.com",
    role: "TEAM",
    accepted: 8,
    completed: 7,
    rejected: 1,
    createdAt: "2026-08-12T11:00:00Z",
  },
  {
    id: "tm3",
    name: "Agent Suresh",
    email: "suresh@banksahayak.com",
    role: "TEAM",
    accepted: 15,
    completed: 14,
    rejected: 1,
    createdAt: "2026-08-14T09:30:00Z",
  },
];

// ── Mock KYC Requests ───────────────────────────────────
export const mockKycRequests: MockKycRequest[] = [
  {
    id: "k1",
    userName: "Rahul Sharma",
    mobileNumber: "9876543210",
    email: "rahul@gmail.com",
    mode: "SELF",
    status: "VERIFIED",
    assignedTo: null,
    createdAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "k2",
    userName: "Priya Patel",
    mobileNumber: "9876543211",
    email: "priya@gmail.com",
    mode: "ASSISTED",
    status: "IN_REVIEW",
    assignedTo: "Agent Ravi",
    createdAt: "2026-08-22T14:30:00Z",
  },
  {
    id: "k3",
    userName: "Amit Kumar",
    mobileNumber: "9876543212",
    email: "amit@gmail.com",
    mode: "SELF",
    status: "PENDING",
    assignedTo: null,
    createdAt: "2026-08-24T09:15:00Z",
  },
  {
    id: "k4",
    userName: "Sneha Gupta",
    mobileNumber: "9876543213",
    email: "sneha@gmail.com",
    mode: "ASSISTED",
    status: "REJECTED",
    assignedTo: "Agent Meena",
    createdAt: "2026-08-25T16:45:00Z",
  },
  {
    id: "k5",
    userName: "Vikram Singh",
    mobileNumber: "9876543214",
    email: "vikram@gmail.com",
    mode: "SELF",
    status: "PENDING",
    assignedTo: null,
    createdAt: "2026-08-26T11:00:00Z",
  },
];

// ── Mock Activity Log ───────────────────────────────────
export const mockActivities: MockActivity[] = [
  {
    id: "a1",
    type: "signup",
    actorName: "Rahul Sharma",
    actorRole: "USER",
    details: "New user registered via mobile number",
    createdAt: "2026-08-15T10:30:00Z",
  },
  {
    id: "a2",
    type: "kyc_submitted",
    actorName: "Priya Patel",
    actorRole: "USER",
    details: "KYC request submitted in ASSISTED mode",
    createdAt: "2026-08-22T14:30:00Z",
  },
  {
    id: "a3",
    type: "kyc_accepted",
    actorName: "Agent Ravi",
    actorRole: "TEAM",
    details: "Accepted KYC request for Priya Patel",
    createdAt: "2026-08-22T15:00:00Z",
  },
  {
    id: "a4",
    type: "expense_created",
    actorName: "Rahul Sharma",
    actorRole: "USER",
    details: "Created expense of ₹2,500 with Priya Patel",
    createdAt: "2026-08-25T18:30:00Z",
  },
  {
    id: "a5",
    type: "kyc_verified",
    actorName: "Agent Suresh",
    actorRole: "TEAM",
    details: "Verified KYC for Rahul Sharma",
    createdAt: "2026-08-20T12:00:00Z",
  },
  {
    id: "a6",
    type: "kyc_rejected",
    actorName: "Agent Meena",
    actorRole: "TEAM",
    details: "Rejected KYC for Sneha Gupta — unclear Aadhar photo",
    createdAt: "2026-08-25T17:00:00Z",
  },
  {
    id: "a7",
    type: "team_member_added",
    actorName: "System Admin",
    actorRole: "ADMIN",
    details: "Added new team member: Agent Suresh",
    createdAt: "2026-08-14T09:30:00Z",
  },
];
