export type UserRole = 'CONTRACTOR' | 'CLIENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  organizationName?: string;
}

export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  gstin?: string;
  pan?: string;
  address?: string;
  email?: string;
  phone?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    upiId: string;
  };
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  organizationName?: string;
  totalProjects: number;
}

export interface Project {
  id: string;
  title: string;
  code: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  location: string;
  contractValue: number;
  startDate: string;
  expectedEndDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  description: string;
}

export type BillStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_SUBMITTED'
  | 'PAID_VERIFIED'
  | 'REJECTED'
  | 'PAYMENT_REJECTED';

export interface BillItem {
  id: string;
  particular: string;
  category?: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  notes?: string;
}

export interface Bill {
  id: string;
  billNumber: string; // e.g. "LB-2026-0042"
  projectId: string;
  projectTitle: string;
  clientName: string;
  clientEmail: string;
  billingPeriod: string; // e.g. "10 Mar 2026 - 20 Mar 2026"
  issueDate: string;
  dueDate: string;
  items: BillItem[];
  subtotal: number;
  taxRate: number; // in percent e.g. 18 or 0
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: BillStatus;
  notes?: string;
  attachments?: string[];
  rejectionReason?: string;
  clarificationRequest?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'UPI' | 'Bank Transfer' | 'Cash' | 'Cheque' | 'Other';

export type PaymentVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'CORRECTION_REQUESTED';

export interface PaymentRecord {
  id: string;
  billId: string;
  billNumber: string;
  projectId: string;
  projectTitle: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  referenceNumber: string; // UTR or Cheque no or Cash receipt ID
  proofUrl?: string;
  proofFileName?: string;
  notes?: string;
  status: PaymentVerificationStatus;
  submittedBy: string;
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  contractorFeedback?: string;
}

export interface ParticularTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultUnit: string;
  defaultRate: number;
}

export interface Message {
  id: string;
  projectId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  content?: string;
  billId?: string;
  billReference?: string;
  billNumber?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  timestamp: string;
  read: boolean;
}

export type NotificationType = 'BILL' | 'PAYMENT' | 'MESSAGE' | 'PROJECT' | 'PAYMENT_VERIFIED' | 'PAYMENT_SUBMITTED';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  targetView?: string;
  targetId?: string;
}

export interface ActivityLog {
  id: string;
  projectId?: string;
  projectTitle?: string;
  billId?: string;
  billNumber?: string;
  title: string;
  description: string;
  actorName: string;
  actorRole: UserRole;
  user?: string;
  timestamp: string;
  amount?: number;
  type:
    | 'BILL_CREATED'
    | 'BILL_SUBMITTED'
    | 'BILL_APPROVED'
    | 'PAYMENT_SUBMITTED'
    | 'PAYMENT_VERIFIED'
    | 'PAYMENT_REJECTED'
    | 'CLARIFICATION_REQUESTED'
    | 'MESSAGE_SENT'
    | 'PROJECT_CREATED'
    | 'NOTE_ADDED';
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  category: 'Blueprint' | 'Contract' | 'Receipt' | 'Specification' | 'Report';
  url: string;
}
