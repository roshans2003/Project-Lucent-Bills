import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { LiquidBackground } from './components/common/LiquidBackground';
import { ContractorDashboard } from './components/dashboard/ContractorDashboard';
import { ClientDashboard } from './components/dashboard/ClientDashboard';
import { ProjectsListView } from './components/projects/ProjectsListView';
import { ProjectDetailView } from './components/projects/ProjectDetailView';
import { BillsListView } from './components/bills/BillsListView';
import { BillDetailView } from './components/bills/BillDetailView';
import { PaymentsListView } from './components/payments/PaymentsListView';
import { ClientsListView } from './components/clients/ClientsListView';
import { ParticularsLibraryView } from './components/particulars/ParticularsLibraryView';
import { MessagesHubView } from './components/messages/MessagesHubView';
import { ReportsView } from './components/reports/ReportsView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { SettingsView } from './components/settings/SettingsView';
import { LandingPageView } from './components/landing/LandingPageView';

const AppContent: React.FC = () => {
  const { currentView, currentViewId, role } = useApp();

  // If on public landing page
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen flex flex-col relative text-slate-900">
        <LiquidBackground />
        <Navbar />
        <LandingPageView />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative font-sans antialiased text-slate-900">
      {/* Ambient Liquid Glass Refraction Backdrop */}
      <LiquidBackground />

      {/* Top Navbar */}
      <Navbar />

      {/* Main SaaS Shell: Sidebar + Content viewport */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentView === 'dashboard' && (
            role === 'CONTRACTOR' ? <ContractorDashboard /> : <ClientDashboard />
          )}

          {currentView === 'projects' && <ProjectsListView />}

          {currentView === 'project-detail' && currentViewId && (
            <ProjectDetailView projectId={currentViewId} />
          )}

          {currentView === 'bills' && <BillsListView />}

          {currentView === 'bill-detail' && currentViewId && (
            <BillDetailView billId={currentViewId} />
          )}

          {currentView === 'payments' && <PaymentsListView />}

          {currentView === 'clients' && <ClientsListView />}

          {currentView === 'particulars' && <ParticularsLibraryView />}

          {currentView === 'messages' && <MessagesHubView />}

          {currentView === 'reports' && <ReportsView />}

          {currentView === 'notifications' && <NotificationsView />}

          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
