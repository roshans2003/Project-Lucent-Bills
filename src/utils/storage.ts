import {
  Project,
  Bill,
  PaymentRecord,
  ParticularTemplate,
  Message,
  Notification,
  ActivityLog,
  ProjectFile,
  User,
  Organization
} from '../types';

export const DEMO_CONTRACTOR: User = {
  id: 'usr_contractor_1',
  name: 'Rajesh Kumar',
  email: 'rajesh@vertexbuildworks.com',
  role: 'CONTRACTOR',
  phone: '+91 94432 10928',
  organizationName: 'Vertex BuildWorks',
  avatarUrl: '/src/assets/images/contractor_avatar_1790153481239.jpg'
};

export const DEMO_CLIENT: User = {
  id: 'usr_client_1',
  name: 'Arun Kumar',
  email: 'arun.kumar@gmail.com',
  role: 'CLIENT',
  phone: '+91 98421 88390',
  organizationName: 'Arun Residency & Properties',
  avatarUrl: '/src/assets/images/client_avatar_1790153492639.jpg'
};

export const DEMO_ORGANIZATION: Organization = {
  id: 'org_vertex_1',
  name: 'Vertex BuildWorks',
  ownerId: 'usr_contractor_1',
  gstin: '33AAECV9421A1Z8',
  pan: 'AAECV9421A',
  address: '142/B Avinashi Road, Civil Aerodrome Post, Coimbatore, Tamil Nadu 641014',
  bankDetails: {
    accountName: 'Vertex BuildWorks Private Limited',
    accountNumber: '50200049281729',
    ifsc: 'HDFC0001234',
    bankName: 'HDFC Bank, Avinashi Road Branch',
    upiId: 'vertexbuildworks@icici'
  }
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj_cbe_01',
    title: 'Modern Villa — Coimbatore',
    code: 'LB-PRJ-01',
    clientName: 'Arun Kumar',
    clientEmail: 'arun.kumar@gmail.com',
    clientPhone: '+91 98421 88390',
    location: 'Race Course Road, Coimbatore, Tamil Nadu',
    contractValue: 2500000,
    startDate: '2026-01-15',
    expectedEndDate: '2026-11-30',
    status: 'ACTIVE',
    description: 'Turnkey residential construction of 3,200 sq.ft contemporary dual-level villa including civil superstructure, electrical conduits, and bespoke interior framing.'
  },
  {
    id: 'prj_cbe_02',
    title: 'Commercial Studio — RS Puram',
    code: 'LB-PRJ-02',
    clientName: 'Dr. Priya Sundaram',
    clientEmail: 'priya.sundaram@clinic.org',
    clientPhone: '+91 98433 44551',
    location: 'Diwan Bahadur Road, RS Puram, Coimbatore',
    contractValue: 1850000,
    startDate: '2026-02-01',
    expectedEndDate: '2026-08-15',
    status: 'ACTIVE',
    description: 'Commercial interior architectural fitout, soundproof partitioning, specialized lighting grids, and reception lounge.'
  }
];

export const INITIAL_BILLS: Bill[] = [
  {
    id: 'bill_0042',
    billNumber: 'LB-2026-0042',
    projectId: 'prj_cbe_01',
    projectTitle: 'Modern Villa — Coimbatore',
    clientName: 'Arun Kumar',
    clientEmail: 'arun.kumar@gmail.com',
    billingPeriod: '12 Mar 2026 - 19 Mar 2026',
    issueDate: '2026-03-20',
    dueDate: '2026-03-27',
    items: [
      {
        id: 'item_42_1',
        particular: 'Cement (Ultratech 53 Grade)',
        category: 'Civil Materials',
        quantity: 50,
        unit: 'bags',
        rate: 420,
        amount: 21000,
        notes: 'Delivery slip #8821 verified at site'
      },
      {
        id: 'item_42_2',
        particular: 'M-Sand (Manufactured Sand)',
        category: 'Civil Materials',
        quantity: 3,
        unit: 'loads',
        rate: 5500,
        amount: 16500,
        notes: '3 tipper loads for plastering work'
      },
      {
        id: 'item_42_3',
        particular: 'Mason & Skilled Labour',
        category: 'Labour',
        quantity: 6,
        unit: 'days',
        rate: 900,
        amount: 5400,
        notes: 'Brick parapet wall leveling'
      }
    ],
    subtotal: 42900,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 42900,
    status: 'PAYMENT_SUBMITTED',
    notes: 'Material unloading slips and labour attendance log attached. Please transfer directly via UPI or IMPS.',
    attachments: ['/src/assets/images/hero_construction_modern_1790153455118.jpg'],
    createdAt: '2026-03-20T10:05:00.000Z',
    updatedAt: '2026-03-21T13:15:00.000Z'
  },
  {
    id: 'bill_0041',
    billNumber: 'LB-2026-0041',
    projectId: 'prj_cbe_01',
    projectTitle: 'Modern Villa — Coimbatore',
    clientName: 'Arun Kumar',
    clientEmail: 'arun.kumar@gmail.com',
    billingPeriod: '25 Feb 2026 - 05 Mar 2026',
    issueDate: '2026-03-06',
    dueDate: '2026-03-13',
    items: [
      {
        id: 'item_41_1',
        particular: 'TMT Reinforcement Steel 12mm/16mm',
        category: 'Steel',
        quantity: 4200,
        unit: 'kg',
        rate: 68,
        amount: 285600,
        notes: 'Tata Tiscon FE550D test certified'
      },
      {
        id: 'item_41_2',
        particular: 'Ready Mix Concrete (RMC) M25 Grade',
        category: 'Concrete',
        quantity: 22,
        unit: 'cu.m',
        rate: 4500,
        amount: 99000,
        notes: 'Pumping for plinth level beams'
      },
      {
        id: 'item_41_3',
        particular: 'Steel Binding & Shuttering Labour',
        category: 'Labour',
        quantity: 1,
        unit: 'lot',
        rate: 400,
        amount: 400,
        notes: 'Incidental binding charge'
      }
    ],
    subtotal: 385000,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 385000,
    status: 'PAID_VERIFIED',
    notes: 'Plinth level inspection completed and signed by civil structural consultant.',
    createdAt: '2026-03-06T09:30:00.000Z',
    updatedAt: '2026-03-09T14:40:00.000Z'
  },
  {
    id: 'bill_0040',
    billNumber: 'LB-2026-0040',
    projectId: 'prj_cbe_01',
    projectTitle: 'Modern Villa — Coimbatore',
    clientName: 'Arun Kumar',
    clientEmail: 'arun.kumar@gmail.com',
    billingPeriod: '10 Feb 2026 - 20 Feb 2026',
    issueDate: '2026-02-21',
    dueDate: '2026-02-28',
    items: [
      {
        id: 'item_40_1',
        particular: 'JCB Excavation & Earth Moving',
        category: 'Heavy Equipment',
        quantity: 42,
        unit: 'hours',
        rate: 1800,
        amount: 75600,
        notes: 'Column pit depth excavation to hard stratum'
      },
      {
        id: 'item_40_2',
        particular: 'Plain Cement Concrete (PCC 1:4:8)',
        category: 'Concrete',
        quantity: 18,
        unit: 'cu.m',
        rate: 3700,
        amount: 66600,
        notes: 'Bed concrete under column footings'
      },
      {
        id: 'item_40_3',
        particular: 'Anti-Termite Treatment (Chlorpyrifos 20% EC)',
        category: 'Treatment',
        quantity: 1,
        unit: 'lump sum',
        rate: 49900,
        amount: 49900,
        notes: 'Chemical spray certificate issued by PestControl Ltd'
      }
    ],
    subtotal: 192100,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 192100,
    status: 'PAID_VERIFIED',
    notes: 'Substructure foundations approved for RCC footing erection.',
    createdAt: '2026-02-21T11:00:00.000Z',
    updatedAt: '2026-02-24T16:20:00.000Z'
  },
  {
    id: 'bill_0039',
    billNumber: 'LB-2026-0039',
    projectId: 'prj_cbe_01',
    projectTitle: 'Modern Villa — Coimbatore',
    clientName: 'Arun Kumar',
    clientEmail: 'arun.kumar@gmail.com',
    billingPeriod: '01 Mar 2026 - 10 Mar 2026',
    issueDate: '2026-03-11',
    dueDate: '2026-03-25',
    items: [
      {
        id: 'item_39_1',
        particular: 'Red Clay Wire-Cut Bricks',
        category: 'Civil Materials',
        quantity: 20000,
        unit: 'nos',
        rate: 8.5,
        amount: 170000,
        notes: 'Chamber burnt first class wire cut bricks'
      },
      {
        id: 'item_39_2',
        particular: 'River Sand for Mortar',
        category: 'Civil Materials',
        quantity: 5,
        unit: 'loads',
        rate: 7200,
        amount: 36000,
        notes: 'Permit sand for ground floor internal partition walls'
      },
      {
        id: 'item_39_3',
        particular: 'Scaffolding & Props Rental',
        category: 'Equipment Rental',
        quantity: 14,
        unit: 'days',
        rate: 1000,
        amount: 14000,
        notes: 'Heavy duty steel tubular scaffolding'
      }
    ],
    subtotal: 220000,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 220000,
    status: 'PAYMENT_PENDING',
    notes: 'Client Arun Kumar approved this bill on 14 Mar. Pending external payment transfer.',
    createdAt: '2026-03-11T14:15:00.000Z',
    updatedAt: '2026-03-14T17:00:00.000Z'
  },
  {
    id: 'bill_0038',
    billNumber: 'LB-2026-0038',
    projectId: 'prj_cbe_01',
    projectTitle: 'Modern Villa — Coimbatore',
    clientName: 'Arun Kumar',
    clientEmail: 'arun.kumar@gmail.com',
    billingPeriod: '15 Mar 2026 - 21 Mar 2026',
    issueDate: '2026-03-22',
    dueDate: '2026-03-29',
    items: [
      {
        id: 'item_38_1',
        particular: 'Finolex FRLS Electrical Conduits & Junction Boxes',
        category: 'Electrical',
        quantity: 450,
        unit: 'metres',
        rate: 45,
        amount: 20250,
        notes: '25mm heavy gauge concealed pipes'
      },
      {
        id: 'item_38_2',
        particular: 'Ashirvad CPVC Pipes & Brass Fittings',
        category: 'Plumbing',
        quantity: 1,
        unit: 'lot',
        rate: 34750,
        amount: 34750,
        notes: 'Bath & kitchen hot/cold water supply rough-in'
      },
      {
        id: 'item_38_3',
        particular: 'Concealed Conduit Chasing Labour',
        category: 'Labour',
        quantity: 10,
        unit: 'days',
        rate: 1000,
        amount: 10000,
        notes: 'Wall grooving and pipe dressing'
      }
    ],
    subtotal: 65000,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 65000,
    status: 'SUBMITTED',
    notes: 'Submitted to client for review. Awaiting approval or clarification.',
    createdAt: '2026-03-22T08:45:00.000Z',
    updatedAt: '2026-03-22T08:45:00.000Z'
  },
  {
    id: 'bill_0043',
    billNumber: 'LB-2026-0043',
    projectId: 'prj_cbe_01',
    projectTitle: 'Modern Villa — Coimbatore',
    clientName: 'Arun Kumar',
    clientEmail: 'arun.kumar@gmail.com',
    billingPeriod: '22 Mar 2026 - 28 Mar 2026',
    issueDate: '2026-03-23',
    dueDate: '2026-03-31',
    items: [
      {
        id: 'item_43_1',
        particular: 'Plywood Centering Sheets & Steel Telescopic Props',
        category: 'Centering',
        quantity: 1,
        unit: 'lot',
        rate: 85000,
        amount: 85000,
        notes: 'First floor roof slab shuttering area 1,800 sq.ft'
      },
      {
        id: 'item_43_2',
        particular: 'Carpentry & Shuttering Crew Labour',
        category: 'Labour',
        quantity: 55,
        unit: 'mandays',
        rate: 1000,
        amount: 55000,
        notes: 'Includes prop leveling, oiling, and beam drops'
      }
    ],
    subtotal: 140000,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 140000,
    status: 'DRAFT',
    notes: 'Internal draft preparing for slab beam inspection.',
    createdAt: '2026-03-23T01:10:00.000Z',
    updatedAt: '2026-03-23T01:10:00.000Z'
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay_0042',
    billId: 'bill_0042',
    billNumber: 'LB-2026-0042',
    projectId: 'prj_cbe_01',
    projectTitle: 'Modern Villa — Coimbatore',
    amount: 42900,
    paymentMethod: 'UPI',
    paymentDate: '2026-03-21',
    referenceNumber: 'UPI/608291048291/IMPS',
    proofUrl: '/src/assets/images/payment_proof_receipt_1790153469451.jpg',
    proofFileName: 'GPay_Receipt_LB0042.jpg',
    notes: 'Paid ₹42,900 via Google Pay UPI to vertexbuildworks@icici. Attached transaction snapshot.',
    status: 'PENDING',
    submittedBy: 'Arun Kumar (Client)',
    submittedAt: '2026-03-21T13:15:00.000Z'
  },
  {
    id: 'pay_0041',
    billId: 'bill_0041',
    billNumber: 'LB-2026-0041',
    projectId: 'prj_cbe_01',
    projectTitle: 'Modern Villa — Coimbatore',
    amount: 385000,
    paymentMethod: 'Bank Transfer',
    paymentDate: '2026-03-08',
    referenceNumber: 'HDFC891230491823',
    proofUrl: '/src/assets/images/payment_proof_receipt_1790153469451.jpg',
    proofFileName: 'NEFT_Acknowledgement_0041.pdf',
    notes: 'Transferred from Arun Kumar savings account to Vertex BuildWorks HDFC.',
    status: 'VERIFIED',
    submittedBy: 'Arun Kumar (Client)',
    submittedAt: '2026-03-08T11:20:00.000Z',
    verifiedAt: '2026-03-09T14:40:00.000Z',
    verifiedBy: 'Rajesh Kumar (Contractor)'
  },
  {
    id: 'pay_0040',
    billId: 'bill_0040',
    billNumber: 'LB-2026-0040',
    projectId: 'prj_cbe_01',
    projectTitle: 'Modern Villa — Coimbatore',
    amount: 192100,
    paymentMethod: 'Cheque',
    paymentDate: '2026-02-23',
    referenceNumber: 'CHQ-401928-ICICI',
    proofUrl: '/src/assets/images/payment_proof_receipt_1790153469451.jpg',
    proofFileName: 'Cheque_Deposit_Slip_0040.jpg',
    notes: 'ICICI Bank crossed cheque deposited at branch.',
    status: 'VERIFIED',
    submittedBy: 'Arun Kumar (Client)',
    submittedAt: '2026-02-23T15:00:00.000Z',
    verifiedAt: '2026-02-24T16:20:00.000Z',
    verifiedBy: 'Rajesh Kumar (Contractor)'
  }
];

export const INITIAL_PARTICULARS: ParticularTemplate[] = [
  {
    id: 'part_1',
    name: 'Cement (Ultratech 53 Grade)',
    category: 'Civil Materials',
    description: 'High strength Portland Pozzolana Cement for structural RCC and columns',
    defaultUnit: 'bags',
    defaultRate: 420
  },
  {
    id: 'part_2',
    name: 'M-Sand (Manufactured Sand)',
    category: 'Civil Materials',
    description: 'Triple-washed manufactured sand with zero silt content for masonry and plaster',
    defaultUnit: 'loads',
    defaultRate: 5500
  },
  {
    id: 'part_3',
    name: 'River Sand (Govt Approved)',
    category: 'Civil Materials',
    description: 'Natural river sand for ceiling and fine face plastering',
    defaultUnit: 'loads',
    defaultRate: 7200
  },
  {
    id: 'part_4',
    name: 'TMT Reinforcement Steel 12mm',
    category: 'Steel',
    description: 'Primary structural ribbed rebar, grade Fe 550D earthquake resistant',
    defaultUnit: 'kg',
    defaultRate: 68
  },
  {
    id: 'part_5',
    name: 'Red Clay Wire-Cut Bricks',
    category: 'Civil Materials',
    description: 'Modular machine-cut red clay bricks, compressive strength > 7.5 N/mm2',
    defaultUnit: 'nos',
    defaultRate: 8.5
  },
  {
    id: 'part_6',
    name: 'Mason & Skilled Civil Labour',
    category: 'Labour',
    description: 'Head mason for alignment, plumb, and bricklaying daily shift',
    defaultUnit: 'days',
    defaultRate: 900
  },
  {
    id: 'part_7',
    name: 'Helper / Manual Labour',
    category: 'Labour',
    description: 'Site helper for material mixing, curing, and transport',
    defaultUnit: 'days',
    defaultRate: 650
  },
  {
    id: 'part_8',
    name: 'Concealed CPVC Piping (Ashirvad)',
    category: 'Plumbing',
    description: 'SDR 11 chlorinated polyvinyl chloride hot/cold plumbing line',
    defaultUnit: 'metres',
    defaultRate: 85
  },
  {
    id: 'part_9',
    name: 'Electrical Rigid PVC Conduits 25mm',
    category: 'Electrical',
    description: 'Fire retardant low smoke (FRLS) concealed wiring conduit',
    defaultUnit: 'metres',
    defaultRate: 45
  },
  {
    id: 'part_10',
    name: 'Asian Paints Apex Ultima Exterior',
    category: 'Painting',
    description: 'Anti-algal weather proof exterior emulsion with silicon technology',
    defaultUnit: 'litres',
    defaultRate: 380
  },
  {
    id: 'part_11',
    name: 'UI/UX Design & Prototyping',
    category: 'Digital / Agency',
    description: 'High-fidelity design sprint, wireframing, and interactive design system',
    defaultUnit: 'hours',
    defaultRate: 2500
  },
  {
    id: 'part_12',
    name: 'Structural Engineering Consultation',
    category: 'Consulting',
    description: 'Site inspection, load calculations, and structural vetting certificate',
    defaultUnit: 'visit',
    defaultRate: 5000
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    projectId: 'prj_cbe_01',
    senderId: 'usr_contractor_1',
    senderName: 'Rajesh Kumar (Contractor)',
    senderRole: 'CONTRACTOR',
    text: 'Hello Arun Sir, we have finished the ground floor plinth beams and column starter casting. Uploaded Bill #LB-2026-0041 for the steel and concrete.',
    content: 'Hello Arun Sir, we have finished the ground floor plinth beams and column starter casting. Uploaded Bill #LB-2026-0041 for the steel and concrete.',
    billId: 'bill_0041',
    billReference: 'bill_0041',
    billNumber: 'LB-2026-0041',
    timestamp: '2026-03-06T10:00:00.000Z',
    read: true
  },
  {
    id: 'msg_2',
    projectId: 'prj_cbe_01',
    senderId: 'usr_client_1',
    senderName: 'Arun Kumar (Client)',
    senderRole: 'CLIENT',
    text: 'Received Rajesh. Structural consultant inspected yesterday and approved. Initiating NEFT transfer for ₹3,85,000.',
    content: 'Received Rajesh. Structural consultant inspected yesterday and approved. Initiating NEFT transfer for ₹3,85,000.',
    billId: 'bill_0041',
    billReference: 'bill_0041',
    billNumber: 'LB-2026-0041',
    timestamp: '2026-03-08T11:15:00.000Z',
    read: true
  },
  {
    id: 'msg_3',
    projectId: 'prj_cbe_01',
    senderId: 'usr_client_1',
    senderName: 'Arun Kumar (Client)',
    senderRole: 'CLIENT',
    text: 'Can you provide the material weighbridge receipt for Bill #LB-2026-0042 (M-Sand)?',
    content: 'Can you provide the material weighbridge receipt for Bill #LB-2026-0042 (M-Sand)?',
    billId: 'bill_0042',
    billReference: 'bill_0042',
    billNumber: 'LB-2026-0042',
    timestamp: '2026-03-21T10:45:00.000Z',
    read: true
  },
  {
    id: 'msg_4',
    projectId: 'prj_cbe_01',
    senderId: 'usr_contractor_1',
    senderName: 'Rajesh Kumar (Contractor)',
    senderRole: 'CONTRACTOR',
    text: "Sure Arun Sir, I've attached the signed quarry delivery slip to the bill attachment section. All 3 loads are calibrated at 5.5 tons each.",
    content: "Sure Arun Sir, I've attached the signed quarry delivery slip to the bill attachment section. All 3 loads are calibrated at 5.5 tons each.",
    billId: 'bill_0042',
    billReference: 'bill_0042',
    billNumber: 'LB-2026-0042',
    timestamp: '2026-03-21T11:30:00.000Z',
    read: true
  },
  {
    id: 'msg_5',
    projectId: 'prj_cbe_01',
    senderId: 'usr_client_1',
    senderName: 'Arun Kumar (Client)',
    senderRole: 'CLIENT',
    text: "Perfect, verified! I have transferred ₹42,900 via UPI and submitted the verification request with transaction slip. Please verify once received.",
    content: "Perfect, verified! I have transferred ₹42,900 via UPI and submitted the verification request with transaction slip. Please verify once received.",
    billId: 'bill_0042',
    billReference: 'bill_0042',
    billNumber: 'LB-2026-0042',
    timestamp: '2026-03-21T13:20:00.000Z',
    read: false
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    title: 'Payment Verification Request',
    message: 'Arun Kumar submitted payment of ₹42,900 for Bill #LB-2026-0042 via UPI. Please verify.',
    type: 'PAYMENT',
    timestamp: '2026-03-21T13:15:00.000Z',
    read: false,
    targetView: 'payments',
    targetId: 'pay_0042'
  },
  {
    id: 'notif_2',
    title: 'Bill Approved by Client',
    message: 'Bill #LB-2026-0039 (₹2,20,000) was approved by client Arun Kumar.',
    type: 'BILL',
    timestamp: '2026-03-14T17:00:00.000Z',
    read: true,
    targetView: 'bills',
    targetId: 'bill_0039'
  },
  {
    id: 'notif_3',
    title: 'Payment Verified',
    message: 'Payment of ₹3,85,000 for Bill #LB-2026-0041 was verified and marked PAID.',
    type: 'PAYMENT',
    timestamp: '2026-03-09T14:40:00.000Z',
    read: true,
    targetView: 'bills',
    targetId: 'bill_0041'
  }
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act_1',
    projectId: 'prj_cbe_01',
    projectTitle: 'Modern Villa — Coimbatore',
    billId: 'bill_0042',
    billNumber: 'LB-2026-0042',
    title: 'Payment submitted',
    description: 'Arun Kumar submitted external payment proof of ₹42,900 via UPI (Ref: UPI/608291048291/IMPS)',
    actorName: 'Arun Kumar',
    actorRole: 'CLIENT',
    amount: 42900,
    timestamp: '2026-03-21T13:15:00.000Z',
    type: 'PAYMENT_SUBMITTED'
  },
  {
    id: 'act_2',
    projectId: 'prj_cbe_01',
    projectTitle: 'Modern Villa — Coimbatore',
    billId: 'bill_0042',
    billNumber: 'LB-2026-0042',
    title: 'Bill submitted',
    description: 'Rajesh Kumar submitted Bill #LB-2026-0042 for ₹42,900 to client',
    actorName: 'Rajesh Kumar',
    actorRole: 'CONTRACTOR',
    amount: 42900,
    timestamp: '2026-03-20T10:05:00.000Z',
    type: 'BILL_SUBMITTED'
  },
  {
    id: 'act_3',
    projectId: 'prj_cbe_01',
    projectTitle: 'Modern Villa — Coimbatore',
    billId: 'bill_0039',
    billNumber: 'LB-2026-0039',
    title: 'Bill approved',
    description: 'Arun Kumar reviewed and approved Bill #LB-2026-0039 for ₹2,20,000',
    actorName: 'Arun Kumar',
    actorRole: 'CLIENT',
    amount: 220000,
    timestamp: '2026-03-14T17:00:00.000Z',
    type: 'BILL_APPROVED'
  },
  {
    id: 'act_4',
    projectId: 'prj_cbe_01',
    projectTitle: 'Modern Villa — Coimbatore',
    billId: 'bill_0041',
    billNumber: 'LB-2026-0041',
    title: 'Payment verified',
    description: 'Rajesh Kumar verified bank transfer payment of ₹3,85,000. Bill marked PAID & VERIFIED.',
    actorName: 'Rajesh Kumar',
    actorRole: 'CONTRACTOR',
    amount: 385000,
    timestamp: '2026-03-09T14:40:00.000Z',
    type: 'PAYMENT_VERIFIED'
  },
  {
    id: 'act_5',
    projectId: 'prj_cbe_01',
    projectTitle: 'Modern Villa — Coimbatore',
    billId: 'bill_0041',
    billNumber: 'LB-2026-0041',
    title: 'Payment submitted',
    description: 'Arun Kumar submitted payment record of ₹3,85,000 via Bank Transfer (Ref: HDFC891230491823)',
    actorName: 'Arun Kumar',
    actorRole: 'CLIENT',
    amount: 385000,
    timestamp: '2026-03-08T11:20:00.000Z',
    type: 'PAYMENT_SUBMITTED'
  },
  {
    id: 'act_6',
    projectId: 'prj_cbe_01',
    projectTitle: 'Modern Villa — Coimbatore',
    billId: 'bill_0040',
    billNumber: 'LB-2026-0040',
    title: 'Payment verified',
    description: 'Rajesh Kumar verified cheque clearance of ₹1,92,100 (Ref: CHQ-401928-ICICI)',
    actorName: 'Rajesh Kumar',
    actorRole: 'CONTRACTOR',
    amount: 192100,
    timestamp: '2026-02-24T16:20:00.000Z',
    type: 'PAYMENT_VERIFIED'
  }
];

export const INITIAL_FILES: ProjectFile[] = [
  {
    id: 'file_1',
    projectId: 'prj_cbe_01',
    name: 'Architectural_Master_Plan_Villa_R3.pdf',
    size: '8.4 MB',
    uploadedBy: 'Rajesh Kumar',
    uploadedAt: '2026-01-16T09:00:00.000Z',
    category: 'Blueprint',
    url: '/src/assets/images/hero_construction_modern_1790153455118.jpg'
  },
  {
    id: 'file_2',
    projectId: 'prj_cbe_01',
    name: 'Signed_Civil_Contract_Agreement.pdf',
    size: '2.1 MB',
    uploadedBy: 'Rajesh Kumar',
    uploadedAt: '2026-01-18T14:30:00.000Z',
    category: 'Contract',
    url: '/src/assets/images/hero_construction_modern_1790153455118.jpg'
  },
  {
    id: 'file_3',
    projectId: 'prj_cbe_01',
    name: 'Soil_Bearing_Capacity_Test_Report.pdf',
    size: '3.6 MB',
    uploadedBy: 'Rajesh Kumar',
    uploadedAt: '2026-02-05T11:00:00.000Z',
    category: 'Report',
    url: '/src/assets/images/hero_construction_modern_1790153455118.jpg'
  },
  {
    id: 'file_4',
    projectId: 'prj_cbe_01',
    name: 'Structural_Steel_Test_Certificates_Batch1.pdf',
    size: '1.8 MB',
    uploadedBy: 'Rajesh Kumar',
    uploadedAt: '2026-03-02T16:15:00.000Z',
    category: 'Specification',
    url: '/src/assets/images/hero_construction_modern_1790153455118.jpg'
  }
];

const STORAGE_KEYS = {
  PROJECTS: 'lucent_projects_v1',
  BILLS: 'lucent_bills_v1',
  PAYMENTS: 'lucent_payments_v1',
  PARTICULARS: 'lucent_particulars_v1',
  MESSAGES: 'lucent_messages_v1',
  NOTIFICATIONS: 'lucent_notifications_v1',
  ACTIVITIES: 'lucent_activities_v1',
  FILES: 'lucent_files_v1',
  USER_ROLE: 'lucent_active_role_v1',
  ORGANIZATION: 'lucent_organization_v1',
};

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage save error:', err);
  }
}

export function resetToDemoData() {
  saveToStorage(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  saveToStorage(STORAGE_KEYS.BILLS, INITIAL_BILLS);
  saveToStorage(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
  saveToStorage(STORAGE_KEYS.PARTICULARS, INITIAL_PARTICULARS);
  saveToStorage(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  saveToStorage(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  saveToStorage(STORAGE_KEYS.FILES, INITIAL_FILES);
  return {
    projects: INITIAL_PROJECTS,
    bills: INITIAL_BILLS,
    payments: INITIAL_PAYMENTS,
    particulars: INITIAL_PARTICULARS,
    messages: INITIAL_MESSAGES,
    notifications: INITIAL_NOTIFICATIONS,
    activities: INITIAL_ACTIVITIES,
    files: INITIAL_FILES
  };
}

export { STORAGE_KEYS };
