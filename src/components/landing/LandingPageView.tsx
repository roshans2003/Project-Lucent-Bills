import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Receipt,
  CreditCard,
  Building,
  User,
  Layers,
  Sparkles,
  TrendingUp,
  FileCheck,
  HelpCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export const LandingPageView: React.FC = () => {
  const { navigateTo, setRole } = useApp();

  const handleLaunchContractor = () => {
    setRole('CONTRACTOR');
    navigateTo('dashboard');
  };

  const handleLaunchClient = () => {
    setRole('CLIENT');
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-screen text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Top Banner: Non-Custodial Trust Model */}
      <div className="glass-panel text-slate-700 text-xs py-2 px-4 text-center border-b border-white/60">
        <span className="font-bold text-slate-900">Non-Custodial Architecture:</span> Lucent Bills does{' '}
        <span className="text-amber-800 font-extrabold underline decoration-amber-500/60 underline-offset-2">
          NOT process, hold, or receive client funds
        </span>
        . All transactions occur directly between parties outside the platform.
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-white/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-slate-800 text-xs font-semibold shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.9)]"></span>
              </span>
              <span>Bill Transparency & External Payment Verification Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.1]">
              Bills made clear. <br />
              <span className="text-slate-500 font-bold">Payments made accountable.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Connecting contractors, service providers, and property owners with line-item bill transparency,
              external payment verification audit trails, and real-time remaining contract tracking.
            </p>

            {/* Launch Buttons for Both Personas */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleLaunchContractor}
                className="w-full sm:w-auto px-6 py-3.5 text-xs font-bold text-white glass-button-primary rounded-xl transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <Building className="h-4 w-4 text-indigo-200" />
                <span>Launch Contractor Workspace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={handleLaunchClient}
                className="w-full sm:w-auto px-6 py-3.5 text-xs font-bold text-slate-900 glass-button-secondary rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <User className="h-4 w-4 text-emerald-700" />
                <span>Launch Client Portal</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-3">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Pre-loaded Demo Data
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> 1-Click Persona Switch
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Full Audit Trail
              </span>
            </div>
          </div>

          {/* Hero Banner Visual */}
          <div className="mt-12 relative rounded-3xl overflow-hidden border border-white/80 shadow-[0_20px_50px_rgba(31,38,135,0.1)] bg-slate-950">
            <img
              src="/src/assets/images/lucent_bills_hero_banner_1790153443323.png"
              alt="Lucent Bills SaaS Dashboard Showcase"
              referrerPolicy="no-referrer"
              className="w-full object-cover max-h-[500px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6 md:p-8">
              <div className="text-white max-w-lg">
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold block mb-1">
                  Active Demonstration: Vertex BuildWorks
                </span>
                <p className="text-sm text-slate-200">
                  Modern Villa project · ₹25,00,000 Contract · Live bill line items, UTR verification, and client ledger.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Non-Custodial Workflow */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
            Clear Six-Step Accountability Loop
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            How Lucent Bills Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Zero ambiguity. Payments happen directly via your own bank or UPI; verification happens here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Detailed Itemized Billing',
              desc: 'Contractor creates bills specifying exact quantities, units, and rates from a reusable particulars library (cement, labour, steel, etc.).',
              icon: <Receipt className="h-5 w-5 text-slate-900" />,
            },
            {
              step: '02',
              title: 'Client Review & Approval',
              desc: 'Client receives the itemized bill, reviews line items, clarifies site particulars directly, or approves the bill for settlement.',
              icon: <FileCheck className="h-5 w-5 text-blue-600" />,
            },
            {
              step: '03',
              title: 'Direct External Payment',
              desc: 'Client pays the contractor directly through bank transfer (NEFT/RTGS/IMPS), UPI, or cheque. No payment gateway fees.',
              icon: <CreditCard className="h-5 w-5 text-emerald-600" />,
            },
            {
              step: '04',
              title: 'Payment Info Submission',
              desc: "Client clicks 'I've Paid', inputs the paid amount, payment method, bank UTR reference, and attaches the transaction slip.",
              icon: <Clock className="h-5 w-5 text-amber-600" />,
            },
            {
              step: '05',
              title: 'Contractor Verification',
              desc: 'Contractor checks their bank statement. With 1-click, contractor verifies receipt of funds or requests a correction.',
              icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
            },
            {
              step: '06',
              title: 'Reconciled Ledger & Balance',
              desc: 'Status turns to PAID & VERIFIED. Real-time Remaining Contract Value and Outstanding Due update instantly across all accounts.',
              icon: <TrendingUp className="h-5 w-5 text-slate-900" />,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl glass-panel-subtle flex items-center justify-center shadow-2xs">
                    {item.icon}
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400">{item.step}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison: Traditional Chaos vs Lucent Bills */}
      <section className="py-16 border-y border-white/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Why Contractors & Clients Rely on Lucent Bills
            </h2>
            <p className="text-xs text-slate-500">
              Ending payment disputes, lost WhatsApp receipts, and guesswork around remaining contract balances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="glass-panel rounded-3xl p-6 space-y-4 border border-rose-300/30 bg-rose-500/5">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <span>The Traditional Chaos</span>
              </div>
              <ul className="space-y-3 text-xs text-rose-950">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">✕</span>
                  <span>WhatsApp screenshots of UPI payments getting lost in endless chat histories.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">✕</span>
                  <span>Lump-sum bills with no transparent material particulars or unit-rate breakdowns.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">✕</span>
                  <span>"Did you receive my ₹45,000 transfer?" followed by days of delayed confirmation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">✕</span>
                  <span>No one knows how much balance is truly remaining on the total agreed contract.</span>
                </li>
              </ul>
            </div>

            {/* The Lucent Bills Way */}
            <div className="glass-panel rounded-3xl p-6 space-y-4 border border-emerald-400/30 bg-emerald-500/5">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>The Lucent Bills Standard</span>
              </div>
              <ul className="space-y-3 text-xs text-emerald-950">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>Immutable verification trail with bank UTR reference and receipt image viewer.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>Line-by-line itemized particulars (bags, loads, days) calculated automatically.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>Official 'PAID & VERIFIED' timestamp status confirmed directly by contractor.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>5-second financial clarity: Total Contract, Billed, Paid, and Remaining Value.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="py-20 text-center max-w-4xl mx-auto px-4">
        <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-xl border border-white/80">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
            Experience Lucent Bills Right Now
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto mb-8">
            The application comes fully pre-configured with active projects, line-item bills, and verification requests.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleLaunchContractor}
              className="px-6 py-3.5 text-xs font-bold text-white glass-button-primary rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Building className="h-4 w-4 text-indigo-200" />
              <span>Enter as Rajesh (Contractor)</span>
            </button>
            <button
              onClick={handleLaunchClient}
              className="px-6 py-3.5 text-xs font-bold text-slate-900 glass-button-secondary rounded-xl transition-all flex items-center gap-2 shadow-2xs"
            >
              <User className="h-4 w-4 text-emerald-600" />
              <span>Enter as Arun (Client)</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

