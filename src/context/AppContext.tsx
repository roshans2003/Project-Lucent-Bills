import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  User,
  UserRole,
  Organization,
  Project,
  Bill,
  PaymentRecord,
  ParticularTemplate,
  Message,
  Notification,
  ActivityLog,
  ProjectFile,
  PaymentMethod,
  BillStatus,
} from '../types';
import {
  DEMO_CONTRACTOR,
  DEMO_CLIENT,
  DEMO_ORGANIZATION,
  INITIAL_PROJECTS,
  INITIAL_BILLS,
  INITIAL_PAYMENTS,
  INITIAL_PARTICULARS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITIES,
  INITIAL_FILES,
  loadFromStorage,
  saveToStorage,
  STORAGE_KEYS,
  resetToDemoData,
} from '../utils/storage';

export interface FinancialSummary {
  contractValue: number;
  totalBilled: number;
  verifiedPaid: number;
  outstanding: number;
  remainingContractValue: number;
  verificationPendingAmount: number;
  billedPercentage: number;
  paidPercentage: number;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: User;
  organization: Organization;
  updateOrganization: (updates: Partial<Organization>) => void;
  currentView: string;
  currentViewId: string | null;
  setCurrentView: (view: string) => void;
  selectedBillId: string | null;
  setSelectedBillId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  navigateTo: (view: string, id?: string) => void;

  projects: Project[];
  bills: Bill[];
  payments: PaymentRecord[];
  particulars: ParticularTemplate[];
  messages: Message[];
  notifications: Notification[];
  activities: ActivityLog[];
  files: ProjectFile[];

  // Actions
  createBill: (billData: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => Bill;
  updateBill: (id: string, updates: Partial<Bill>) => void;
  submitBill: (id: string) => void;
  approveBill: (id: string) => void;
  requestClarification: (id: string, text: string) => void;
  submitPayment: (data: {
    billId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    paymentDate: string;
    referenceNumber: string;
    proofUrl?: string;
    proofFileName?: string;
    notes?: string;
  }) => void;
  verifyPayment: (paymentId: string, feedback?: string) => void;
  rejectPayment: (paymentId: string, reason: string, requestCorrection?: boolean) => void;

  createProject: (data: Omit<Project, 'id'>) => Project;
  addParticular: (data: Omit<ParticularTemplate, 'id'>) => ParticularTemplate;
  updateParticular: (id: string, data: Partial<ParticularTemplate>) => void;
  deleteParticular: (id: string) => void;

  sendMessage: (
    dataOrProjectId: string | { projectId: string; text?: string; content?: string; billId?: string; billNumber?: string; attachmentUrl?: string; attachmentName?: string },
    textParam?: string,
    billReferenceParam?: string,
    attachmentUrlParam?: string,
    attachmentNameParam?: string
  ) => void;
  markMessagesAsRead: (projectId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  uploadProjectFile: (fileData: Omit<ProjectFile, 'id' | 'uploadedAt'>) => void;
  resetData: () => void;

  // Analytics Helpers
  getFinancialSummary: (projectId?: string) => FinancialSummary;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => loadFromStorage(STORAGE_KEYS.USER_ROLE, 'CONTRACTOR'));
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>(() => loadFromStorage(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS));
  const [bills, setBills] = useState<Bill[]>(() => loadFromStorage(STORAGE_KEYS.BILLS, INITIAL_BILLS));
  const [payments, setPayments] = useState<PaymentRecord[]>(() => loadFromStorage(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS));
  const [particulars, setParticulars] = useState<ParticularTemplate[]>(() => loadFromStorage(STORAGE_KEYS.PARTICULARS, INITIAL_PARTICULARS));
  const [messages, setMessages] = useState<Message[]>(() => loadFromStorage(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS));
  const [activities, setActivities] = useState<ActivityLog[]>(() => loadFromStorage(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES));
  const [files, setFiles] = useState<ProjectFile[]>(() => loadFromStorage(STORAGE_KEYS.FILES, INITIAL_FILES));
  const [organization, setOrganization] = useState<Organization>(() => loadFromStorage(STORAGE_KEYS.ORGANIZATION, DEMO_ORGANIZATION));

  // Sync state to local storage
  useEffect(() => { saveToStorage(STORAGE_KEYS.USER_ROLE, role); }, [role]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.ORGANIZATION, organization); }, [organization]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.PROJECTS, projects); }, [projects]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.BILLS, bills); }, [bills]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.PAYMENTS, payments); }, [payments]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.PARTICULARS, particulars); }, [particulars]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.MESSAGES, messages); }, [messages]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications); }, [notifications]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.ACTIVITIES, activities); }, [activities]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.FILES, files); }, [files]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const updateOrganization = (updates: Partial<Organization>) => {
    setOrganization(prev => ({ ...prev, ...updates }));
  };

  const currentUser = role === 'CONTRACTOR' ? DEMO_CONTRACTOR : DEMO_CLIENT;
  const currentViewId = currentView === 'bill-detail' ? selectedBillId : (currentView === 'project-detail' ? selectedProjectId : null);

  const navigateTo = (view: string, id?: string) => {
    setCurrentView(view);
    if (view === 'bill-detail' && id) {
      setSelectedBillId(id);
    } else if (view === 'project-detail' && id) {
      setSelectedProjectId(id);
    } else if (view === 'bills') {
      if (id) setSelectedBillId(id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to append activity log
  const logActivity = (entry: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      ...entry,
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [newLog, ...prev]);
  };

  // Helper to push notification
  const pushNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Bill Actions
  const createBill = (billData: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newBill: Bill = {
      ...billData,
      id: `bill_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setBills(prev => [newBill, ...prev]);

    logActivity({
      projectId: newBill.projectId,
      projectTitle: newBill.projectTitle,
      billId: newBill.id,
      billNumber: newBill.billNumber,
      title: 'Bill created',
      description: `${currentUser.name} created ${newBill.billNumber} (${newBill.status})`,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      amount: newBill.totalAmount,
      type: 'BILL_CREATED',
    });

    if (newBill.status === 'SUBMITTED') {
      pushNotification({
        title: 'New Bill Received',
        message: `${organization.name} sent Bill #${newBill.billNumber} for ₹${newBill.totalAmount.toLocaleString('en-IN')}`,
        type: 'BILL',
        targetView: 'bill-detail',
        targetId: newBill.id,
      });
    }

    return newBill;
  };

  const updateBill = (id: string, updates: Partial<Bill>) => {
    setBills(prev =>
      prev.map(b => (b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b))
    );
  };

  const submitBill = (id: string) => {
    const bill = bills.find(b => b.id === id);
    if (!bill) return;

    updateBill(id, { status: 'SUBMITTED' });

    logActivity({
      projectId: bill.projectId,
      projectTitle: bill.projectTitle,
      billId: bill.id,
      billNumber: bill.billNumber,
      title: 'Bill submitted',
      description: `${currentUser.name} submitted Bill #${bill.billNumber} to client`,
      actorName: currentUser.name,
      actorRole: 'CONTRACTOR',
      amount: bill.totalAmount,
      type: 'BILL_SUBMITTED',
    });

    pushNotification({
      title: 'Bill Received for Review',
      message: `Bill #${bill.billNumber} (₹${bill.totalAmount.toLocaleString('en-IN')}) is ready for your review and approval.`,
      type: 'BILL',
      targetView: 'bill-detail',
      targetId: bill.id,
    });
  };

  const approveBill = (id: string) => {
    const bill = bills.find(b => b.id === id);
    if (!bill) return;

    updateBill(id, { status: 'PAYMENT_PENDING' });

    logActivity({
      projectId: bill.projectId,
      projectTitle: bill.projectTitle,
      billId: bill.id,
      billNumber: bill.billNumber,
      title: 'Bill approved',
      description: `${currentUser.name} reviewed and approved Bill #${bill.billNumber}. Status changed to Payment Pending.`,
      actorName: currentUser.name,
      actorRole: 'CLIENT',
      amount: bill.totalAmount,
      type: 'BILL_APPROVED',
    });

    pushNotification({
      title: 'Bill Approved by Client',
      message: `Client ${currentUser.name} approved Bill #${bill.billNumber}. External payment is pending.`,
      type: 'BILL',
      targetView: 'bill-detail',
      targetId: bill.id,
    });
  };

  const requestClarification = (id: string, text: string) => {
    const bill = bills.find(b => b.id === id);
    if (!bill) return;

    updateBill(id, { clarificationRequest: text });

    // Send a message in the project thread
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      projectId: bill.projectId,
      senderId: currentUser.id,
      senderName: `${currentUser.name} (${currentUser.role === 'CONTRACTOR' ? 'Contractor' : 'Client'})`,
      senderRole: currentUser.role,
      text: `[Clarification requested on Bill #${bill.billNumber}]: ${text}`,
      content: `[Clarification requested on Bill #${bill.billNumber}]: ${text}`,
      billId: bill.id,
      billReference: bill.id,
      billNumber: bill.billNumber,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages(prev => [...prev, newMsg]);

    logActivity({
      projectId: bill.projectId,
      projectTitle: bill.projectTitle,
      billId: bill.id,
      billNumber: bill.billNumber,
      title: 'Clarification requested',
      description: `${currentUser.name} requested clarification for Bill #${bill.billNumber}: "${text}"`,
      actorName: currentUser.name,
      actorRole: 'CLIENT',
      type: 'CLARIFICATION_REQUESTED',
    });

    pushNotification({
      title: 'Clarification Requested on Bill',
      message: `${currentUser.name} asked for clarification regarding Bill #${bill.billNumber}`,
      type: 'MESSAGE',
      targetView: 'messages',
      targetId: bill.projectId,
    });
  };

  // Payment Submissions ("I've Paid")
  const submitPayment = (data: {
    billId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    paymentDate: string;
    referenceNumber: string;
    proofUrl?: string;
    proofFileName?: string;
    notes?: string;
  }) => {
    const bill = bills.find(b => b.id === data.billId);
    if (!bill) return;

    const newPayment: PaymentRecord = {
      id: `pay_${Date.now()}`,
      billId: bill.id,
      billNumber: bill.billNumber,
      projectId: bill.projectId,
      projectTitle: bill.projectTitle,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      paymentDate: data.paymentDate,
      referenceNumber: data.referenceNumber,
      proofUrl: data.proofUrl || '/src/assets/images/payment_proof_receipt_1790153469451.jpg',
      proofFileName: data.proofFileName || 'payment_proof_slip.jpg',
      notes: data.notes,
      status: 'PENDING',
      submittedBy: `${currentUser.name} (Client)`,
      submittedAt: new Date().toISOString(),
    };

    setPayments(prev => [newPayment, ...prev.filter(p => p.billId !== bill.id)]);

    // Update bill status to PAYMENT_SUBMITTED (verification pending)
    updateBill(bill.id, { status: 'PAYMENT_SUBMITTED', rejectionReason: undefined });

    logActivity({
      projectId: bill.projectId,
      projectTitle: bill.projectTitle,
      billId: bill.id,
      billNumber: bill.billNumber,
      title: 'Payment submitted',
      description: `${currentUser.name} submitted payment proof of ₹${data.amount.toLocaleString('en-IN')} via ${data.paymentMethod} (Ref: ${data.referenceNumber})`,
      actorName: currentUser.name,
      actorRole: 'CLIENT',
      amount: data.amount,
      type: 'PAYMENT_SUBMITTED',
    });

    pushNotification({
      title: 'Payment Verification Request',
      message: `${currentUser.name} submitted payment for Bill #${bill.billNumber} (₹${data.amount.toLocaleString('en-IN')} via ${data.paymentMethod}). Please verify.`,
      type: 'PAYMENT',
      targetView: 'payments',
      targetId: newPayment.id,
    });
  };

  // Payment Verification by Contractor
  const verifyPayment = (paymentId: string, feedback?: string) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    const now = new Date().toISOString();

    setPayments(prev =>
      prev.map(p =>
        p.id === paymentId
          ? {
              ...p,
              status: 'VERIFIED',
              verifiedAt: now,
              verifiedBy: `${currentUser.name} (Contractor)`,
              contractorFeedback: feedback,
            }
          : p
      )
    );

    // Update bill status to PAID_VERIFIED
    updateBill(payment.billId, { status: 'PAID_VERIFIED' });

    logActivity({
      projectId: payment.projectId,
      projectTitle: payment.projectTitle,
      billId: payment.billId,
      billNumber: payment.billNumber,
      title: 'Payment verified',
      description: `${currentUser.name} verified payment of ₹${payment.amount.toLocaleString('en-IN')}. Bill #${payment.billNumber} marked PAID & VERIFIED.`,
      actorName: currentUser.name,
      actorRole: 'CONTRACTOR',
      amount: payment.amount,
      type: 'PAYMENT_VERIFIED',
    });

    pushNotification({
      title: 'Payment Verified & Marked Paid',
      message: `Your payment of ₹${payment.amount.toLocaleString('en-IN')} for Bill #${payment.billNumber} was verified.`,
      type: 'PAYMENT',
      targetView: 'bill-detail',
      targetId: payment.billId,
    });
  };

  const rejectPayment = (paymentId: string, reason: string, requestCorrection: boolean = false) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    const newStatus = requestCorrection ? 'CORRECTION_REQUESTED' : 'REJECTED';
    setPayments(prev =>
      prev.map(p =>
        p.id === paymentId
          ? {
              ...p,
              status: newStatus,
              contractorFeedback: reason,
            }
          : p
      )
    );

    updateBill(payment.billId, {
      status: 'PAYMENT_REJECTED',
      rejectionReason: reason,
    });

    logActivity({
      projectId: payment.projectId,
      projectTitle: payment.projectTitle,
      billId: payment.billId,
      billNumber: payment.billNumber,
      title: requestCorrection ? 'Payment correction requested' : 'Payment submission rejected',
      description: `${currentUser.name}: ${reason}`,
      actorName: currentUser.name,
      actorRole: 'CONTRACTOR',
      amount: payment.amount,
      type: 'PAYMENT_REJECTED',
    });

    pushNotification({
      title: requestCorrection ? 'Payment Correction Requested' : 'Payment Submission Rejected',
      message: `Issue with payment submission for Bill #${payment.billNumber}: ${reason}`,
      type: 'PAYMENT',
      targetView: 'bill-detail',
      targetId: payment.billId,
    });
  };

  // Projects
  const createProject = (data: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...data,
      id: `prj_${Date.now()}`,
    };
    setProjects(prev => [newProject, ...prev]);

    logActivity({
      projectId: newProject.id,
      projectTitle: newProject.title,
      title: 'Project initialized',
      description: `${currentUser.name} created new project "${newProject.title}" with contract value ₹${newProject.contractValue.toLocaleString('en-IN')}`,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      amount: newProject.contractValue,
      type: 'PROJECT_CREATED',
    });

    return newProject;
  };

  // Particulars
  const addParticular = (data: Omit<ParticularTemplate, 'id'>) => {
    const item: ParticularTemplate = {
      ...data,
      id: `part_${Date.now()}`,
    };
    setParticulars(prev => [item, ...prev]);
    return item;
  };

  const updateParticular = (id: string, data: Partial<ParticularTemplate>) => {
    setParticulars(prev => prev.map(p => (p.id === id ? { ...p, ...data } : p)));
  };

  const deleteParticular = (id: string) => {
    setParticulars(prev => prev.filter(p => p.id !== id));
  };

  // Messaging
  const sendMessage = (
    dataOrProjectId: string | { projectId: string; text?: string; content?: string; billId?: string; billNumber?: string; attachmentUrl?: string; attachmentName?: string },
    textParam?: string,
    billReferenceParam?: string,
    attachmentUrlParam?: string,
    attachmentNameParam?: string
  ) => {
    let pId: string;
    let msgText: string;
    let bRef: string | undefined;
    let bNum: string | undefined;
    let attUrl: string | undefined;
    let attName: string | undefined;

    if (typeof dataOrProjectId === 'object') {
      pId = dataOrProjectId.projectId;
      msgText = dataOrProjectId.content || dataOrProjectId.text || '';
      bRef = dataOrProjectId.billId;
      bNum = dataOrProjectId.billNumber;
      attUrl = dataOrProjectId.attachmentUrl;
      attName = dataOrProjectId.attachmentName;
    } else {
      pId = dataOrProjectId;
      msgText = textParam || '';
      bRef = billReferenceParam;
      attUrl = attachmentUrlParam;
      attName = attachmentNameParam;
    }

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      projectId: pId,
      senderId: currentUser.id,
      senderName: `${currentUser.name} (${currentUser.role === 'CONTRACTOR' ? 'Contractor' : 'Client'})`,
      senderRole: currentUser.role,
      text: msgText,
      content: msgText,
      billId: bRef,
      billReference: bRef,
      billNumber: bNum,
      attachmentUrl: attUrl,
      attachmentName: attName,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages(prev => [...prev, newMsg]);

    const targetProject = projects.find(p => p.id === pId);
    logActivity({
      projectId: pId,
      projectTitle: targetProject?.title,
      billId: bRef,
      billNumber: bNum,
      title: bNum ? `Message tagged on Bill #${bNum}` : 'Project message posted',
      description: `${currentUser.name}: "${msgText.length > 70 ? msgText.substring(0, 70) + '...' : msgText}"`,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      user: currentUser.name,
      type: 'MESSAGE_SENT',
    });

    pushNotification({
      title: `New message from ${currentUser.name}`,
      message: msgText.length > 60 ? `${msgText.substring(0, 60)}...` : msgText,
      type: 'MESSAGE',
      targetView: 'messages',
      targetId: pId,
    });
  };

  const markMessagesAsRead = (projectId: string) => {
    setMessages(prev =>
      prev.map(m => (m.projectId === projectId && m.senderRole !== role ? { ...m, read: true } : m))
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const uploadProjectFile = (fileData: Omit<ProjectFile, 'id' | 'uploadedAt'>) => {
    const newFile: ProjectFile = {
      ...fileData,
      id: `file_${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setFiles(prev => [newFile, ...prev]);
  };

  const resetData = () => {
    const reset = resetToDemoData();
    setProjects(reset.projects);
    setBills(reset.bills);
    setPayments(reset.payments);
    setParticulars(reset.particulars);
    setMessages(reset.messages);
    setNotifications(reset.notifications);
    setActivities(reset.activities);
    setFiles(reset.files);
    setOrganization(DEMO_ORGANIZATION);
    setRoleState('CONTRACTOR');
  };

  // Dynamic Financial Calculations
  const getFinancialSummary = (projectId?: string): FinancialSummary => {
    const filteredProjects = projectId ? projects.filter(p => p.id === projectId) : projects;
    const contractValue = filteredProjects.reduce((sum, p) => sum + p.contractValue, 0);

    const relevantBills = projectId ? bills.filter(b => b.projectId === projectId) : bills;
    // Billed includes all bills that are not in DRAFT or REJECTED status (active financial commitments)
    const totalBilled = relevantBills
      .filter(b => b.status !== 'DRAFT' && b.status !== 'REJECTED')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    // Verified payments only
    const relevantPayments = projectId ? payments.filter(p => p.projectId === projectId) : payments;
    const verifiedPaid = relevantPayments
      .filter(p => p.status === 'VERIFIED')
      .reduce((sum, p) => sum + p.amount, 0);

    const verificationPendingAmount = relevantPayments
      .filter(p => p.status === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0);

    // Outstanding = Total Billed − Verified Payments
    const outstanding = Math.max(0, totalBilled - verifiedPaid);

    // Remaining Contract Value = Contract Value − Verified Payments
    const remainingContractValue = Math.max(0, contractValue - verifiedPaid);

    const billedPercentage = contractValue > 0 ? Math.min(100, (totalBilled / contractValue) * 100) : 0;
    const paidPercentage = contractValue > 0 ? Math.min(100, (verifiedPaid / contractValue) * 100) : 0;

    return {
      contractValue,
      totalBilled,
      verifiedPaid,
      outstanding,
      remainingContractValue,
      verificationPendingAmount,
      billedPercentage,
      paidPercentage,
    };
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        organization,
        updateOrganization,
        currentView,
        currentViewId,
        setCurrentView,
        selectedBillId,
        setSelectedBillId,
        selectedProjectId,
        setSelectedProjectId,
        navigateTo,

        projects,
        bills,
        payments,
        particulars,
        messages,
        notifications,
        activities,
        files,

        createBill,
        updateBill,
        submitBill,
        approveBill,
        requestClarification,
        submitPayment,
        verifyPayment,
        rejectPayment,

        createProject,
        addParticular,
        updateParticular,
        deleteParticular,

        sendMessage,
        markMessagesAsRead,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        clearAllNotifications,
        uploadProjectFile,
        resetData,

        getFinancialSummary,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
