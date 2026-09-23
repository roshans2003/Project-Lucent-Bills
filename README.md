# Lucent Bills

### Bills made clear. Payments made accountable.

Lucent Bills is a modern SaaS platform designed to bring **transparency, accountability, and better communication** to billing between contractors/service providers and their clients.

It provides a shared workspace where service providers can create and manage detailed bills, while clients can review bills, track project finances, submit external payment information, and request payment verification.

> **Lucent Bills does not process or hold payments.**
> Payments are made directly between the client and service provider using their preferred payment method.

---

## ✨ Overview

Managing project bills through WhatsApp messages, spreadsheets, screenshots, and scattered payment records can make it difficult for both parties to understand the actual financial status of a project.

Lucent Bills brings everything into one place.

### Service Provider

* Create and manage projects
* Add clients
* Generate detailed bills
* Create reusable bill particulars
* Track outstanding bills
* Receive payment submissions
* Verify external payments
* View financial analytics
* Communicate with clients
* Maintain an activity history

### Client

* View assigned projects
* Review detailed bills
* Approve bills
* Request clarification
* Submit payment information
* Upload payment proof
* Track payment verification
* View payment history
* Monitor outstanding amounts
* Communicate with service providers

---

# 🚀 Core Workflow

```text
Service Provider
       │
       ▼
  Create Project
       │
       ▼
    Create Bill
       │
       ▼
 Client Receives Bill
       │
       ▼
   Client Reviews
       │
       ▼
   Client Approves
       │
       ▼
Client Pays Externally
       │
       ▼
 Client Submits Payment
       │
       ▼
Contractor Verifies Payment
       │
       ▼
  PAID & VERIFIED
       │
       ▼
Both Dashboards Update
```

---

# 💡 Key Features

## 📋 Transparent Billing

Create detailed bills with:

* Particulars
* Quantity
* Unit
* Rate
* Amount
* Tax
* Discount
* Notes
* Billing period
* Due date
* Attachments

Bill totals are calculated automatically.

---

## ⚡ Quick Bill Generation

Service providers can maintain a reusable **Particular Library**.

For example:

```text
Cement
Steel
Bricks
Labour
M-Sand
Plumbing
Electrical
Painting
Transportation
```

Instead of repeatedly entering the same information, users can select a saved particular and quickly generate a new bill.

---

## 💳 External Payment Tracking

Lucent Bills intentionally does **not** process payments.

Clients can pay using:

* UPI
* Bank Transfer
* Cash
* Cheque
* Other methods

After making the payment externally, the client can submit:

* Payment amount
* Payment method
* Payment date
* Transaction/UTR number
* Payment notes
* Payment proof

---

## ✅ Payment Verification

After a client submits payment information, the contractor receives a verification request.

The contractor can:

* Verify payment
* Reject payment
* Request correction

Once verified:

```text
Payment Submitted
       ↓
Verification Pending
       ↓
Payment Verified
       ↓
PAID & VERIFIED
```

Both users' dashboards are updated automatically.

---

# 📊 Project Financial Dashboard

Lucent Bills provides a clear financial overview for every project.

Example:

```text
Contract Value       ₹25,00,000
Total Billed          ₹8,40,000
Verified Paid         ₹6,20,000
Outstanding            ₹2,20,000
Remaining Contract    ₹16,60,000
```

### Core calculations

```text
Outstanding
= Total Billed - Verified Payments
```

```text
Remaining Contract Value
= Contract Value - Verified Payments
```

Lucent Bills does not function as a wallet or payment processor.

---

# 📈 Analytics

The dashboard provides visual insights into project finances.

### Billing Analytics

Track:

* Weekly billing
* Monthly billing
* Project billing
* Category spending

### Payment Analytics

Track:

* Verified payments
* Pending payments
* Verification requests
* Outstanding amounts

### Project Progress

Visualize the relationship between:

```text
Contract Value
      ↓
Total Billed
      ↓
Verified Payments
      ↓
Remaining Value
```

---

# 💬 Project Messaging

Each project has its own communication space.

Clients and service providers can communicate about:

* Bills
* Payments
* Project updates
* Clarifications
* Documents

Messages can be associated with specific bills to keep discussions organized.

---

# 🕒 Activity Timeline

Lucent Bills maintains an activity history for important actions.

Example:

```text
✓ Payment verified
₹51,400
Today, 2:42 PM

✓ Payment submitted
₹51,400
Today, 1:15 PM

✓ Bill viewed
Today, 11:20 AM

✓ Bill submitted
Today, 10:05 AM

✓ Bill created
Yesterday, 4:20 PM
```

This creates a transparent record of project billing activity.

---

# 🔔 Notifications

Users can receive notifications for events such as:

* New bill received
* Bill approved
* Payment submitted
* Payment verified
* Payment rejected
* New message
* Bill updated
* Payment verification request
* Upcoming due dates

---

# 📑 Bill Status

Bills follow a structured lifecycle:

```text
DRAFT
  ↓
SUBMITTED
  ↓
APPROVED
  ↓
PAYMENT_PENDING
  ↓
PAYMENT_SUBMITTED
  ↓
PAID_VERIFIED
```

Additional states:

```text
REJECTED
PAYMENT_REJECTED
```

Clear status indicators make it easy for both parties to understand what needs attention.

---

# 🏗️ Use Cases

Lucent Bills can be used by different types of service businesses.

### 🏠 Construction

Track:

* Building materials
* Labour
* Electrical work
* Plumbing
* Transportation
* Weekly project bills

### 💻 Software Agencies

Track:

* Development
* UI/UX
* Hosting
* Maintenance
* Project milestones

### 🎨 Freelancers

Track:

* Design
* Development
* Consulting
* Revisions
* Maintenance

### 🎪 Event Companies

Track:

* Venue
* Decoration
* Catering
* Photography
* Transportation

### 🔧 Maintenance Businesses

Track:

* Service visits
* Materials
* Labour
* Recurring maintenance

---

# 🛠️ Tech Stack

The project is designed using a modern web application architecture.

### Frontend

* React / Next.js
* TypeScript
* Tailwind CSS
* Modern component-based UI
* Responsive design

### UI

* Modern SaaS dashboard
* Reusable components
* Lucide icons
* Data visualization
* Responsive layouts
* Interactive tables and forms

### Backend / Data

The application architecture is designed to support:

* Authentication
* Role-based access control
* Project management
* Bill management
* Payment verification
* Messaging
* Notifications
* Activity logging
* Multi-tenant data isolation

> Update this section with the exact backend/database technologies currently used in the repository.

---

# 🏛️ Application Architecture

High-level structure:

```text
                         Lucent Bills
                              │
              ┌───────────────┴───────────────┐
              │                               │
       Service Provider                     Client
              │                               │
              ▼                               ▼
          Projects                         Projects
              │                               │
              ▼                               ▼
            Bills                            Bills
              │                               │
              └───────────────┬───────────────┘
                              │
                       Payment Records
                              │
                              ▼
                       Verification
                              │
                              ▼
                       Activity Log
                              │
                              ▼
                         Analytics
```

---

# 👥 User Roles

## Service Provider

Can:

* Manage projects
* Manage clients
* Create bills
* Edit bills
* Manage particulars
* Submit bills
* Verify payments
* View analytics
* Send messages

## Client

Can:

* View projects
* View bills
* Approve bills
* Request clarification
* Submit payment records
* Upload payment proof
* View payment history
* Send messages

---

# 🔐 Security Principles

Lucent Bills is designed around strict data isolation.

Important security rules include:

* Authentication for protected areas
* Role-based authorization
* Organization-level data isolation
* Server-side validation
* Protected project access
* Protected bill access
* Payment verification authorization
* File upload validation
* Secure handling of user data
* Activity/audit logging

Clients should only be able to access projects they are associated with.

Service providers should only be able to access data belonging to their organization.

---

# 📱 Responsive Design

Lucent Bills is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

Important mobile workflows include:

* Dashboard
* Bill viewing
* Bill details
* Payment submission
* Payment verification
* Messaging
* Notifications

---

# 🎯 Product Goals

Lucent Bills aims to solve common problems in service-based billing:

### Problem

Bills are often managed through:

* WhatsApp
* Excel sheets
* Paper documents
* Screenshots
* Bank statements
* Manual calculations

This can lead to:

* Miscommunication
* Lost records
* Payment confusion
* Difficult tracking
* Lack of transparency

### Solution

Lucent Bills provides:

**One shared workspace for bills, payment records, verification, communication, and project financial visibility.**

---

# 🗺️ Roadmap

## Phase 1 — Core Platform

* [x] Authentication
* [x] Dashboard
* [x] Projects
* [x] Clients
* [x] Bill creation
* [x] Bill management
* [x] Particular library

## Phase 2 — Payment Transparency

* [x] External payment recording
* [x] Payment proof upload
* [x] Payment verification
* [x] Payment status tracking
* [x] Activity timeline

## Phase 3 — Collaboration

* [x] Project messaging
* [x] Notifications
* [ ] Email notifications
* [ ] Advanced file management

## Phase 4 — Analytics

* [x] Financial dashboard
* [x] Billing analytics
* [x] Payment analytics
* [ ] Advanced reporting
* [ ] PDF reports
* [ ] CSV export improvements

## Phase 5 — SaaS

* [ ] Subscription plans
* [ ] Organization management
* [ ] Team members
* [ ] Custom branding
* [ ] Advanced permissions
* [ ] Email integrations
* [ ] API access
* [ ] Mobile application

---

# 🧪 Demo

### Demo Service Provider

**Organization:** Vertex BuildWorks

**Project:** Modern Villa — Coimbatore

**Contract Value:** ₹25,00,000

The demo environment contains sample projects, bills, payment records, and different bill statuses for testing the complete workflow.

---

# ⚙️ Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/lucent-bills.git
cd lucent-bills
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create:

```text
.env.local
```

Add the required environment variables.

Example:

```env
DATABASE_URL=
AUTH_SECRET=
NEXT_PUBLIC_APP_URL=
STORAGE_URL=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
```

Only add variables that are actually required by the current implementation.

## 4. Run the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🧑‍💻 Development

Run linting:

```bash
npm run lint
```

Run the production build:

```bash
npm run build
```

Start production:

```bash
npm run start
```

If tests are configured:

```bash
npm test
```

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Make your changes
4. Test the application
5. Commit your changes

```bash
git commit -m "Add your feature"
```

6. Push the branch

```bash
git push origin feature/your-feature
```

7. Open a Pull Request

---

# 📄 License

This project is currently under development.

Add your preferred license before making the repository publicly available.

---

# 👨‍💻 Project

**Lucent Bills**

A SaaS concept focused on making service billing more transparent, verifiable, and easier to manage.

### Built with the goal of making financial communication simple:

> **Create. Clarify. Pay. Verify. Track.**

---

⭐ If you find Lucent Bills interesting, consider starring the repository and following the project as it evolves.
