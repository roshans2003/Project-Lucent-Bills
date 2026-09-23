import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building, CreditCard, User, ShieldCheck, RefreshCw, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    organization,
    updateOrganization,
    currentUser,
    role,
    setRole,
    resetData,
  } = useApp();

  const [orgName, setOrgName] = useState(organization.name);
  const [gstin, setGstin] = useState(organization.gstin || '');
  const [address, setAddress] = useState(organization.address || '');
  const [email, setEmail] = useState(organization.email || '');
  const [phone, setPhone] = useState(organization.phone || '');

  // Bank details
  const [bankName, setBankName] = useState(organization.bankDetails?.bankName || 'HDFC Bank');
  const [accountName, setAccountName] = useState(organization.bankDetails?.accountName || 'Vertex BuildWorks LLP');
  const [accountNumber, setAccountNumber] = useState(organization.bankDetails?.accountNumber || '50200049281729');
  const [ifsc, setIfsc] = useState(organization.bankDetails?.ifsc || 'HDFC0001234');
  const [upiId, setUpiId] = useState(organization.bankDetails?.upiId || 'vertexbuildworks@icici');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrganization({
      name: orgName,
      gstin,
      address,
      email,
      phone,
      bankDetails: {
        bankName,
        accountName,
        accountNumber,
        ifsc,
        upiId,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Workspace Settings</h2>
        <p className="text-xs text-slate-500">
          Configure business profile, tax registration, and payment settlement destinations
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organization Information */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="h-4 w-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">Organization & Tax Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company / Contractor Name
              </label>
              <input
                type="text"
                required
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GSTIN / Tax ID
              </label>
              <input
                type="text"
                value={gstin}
                onChange={e => setGstin(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Registered Address
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
            />
          </div>
        </div>

        {/* Bank & External Payment Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CreditCard className="h-4 w-4 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Direct Payment Instructions</h3>
              <p className="text-[11px] text-slate-500">
                Printed on your bills and shown to clients during external payment submission
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Account Beneficiary Name</label>
              <input
                type="text"
                value={accountName}
                onChange={e => setAccountName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-semibold rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">IFSC Code</label>
              <input
                type="text"
                value={ifsc}
                onChange={e => setIfsc(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-semibold rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">UPI ID / VPA</label>
              <input
                type="text"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-semibold rounded-lg border border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Active Session & Persona */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="h-4 w-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">Current Session Persona</h3>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
              <div className="text-[11px] text-slate-500 font-mono">{currentUser.email}</div>
              <div className="text-[10px] text-slate-400 mt-1">
                Active Perspective: <strong>{role === 'CONTRACTOR' ? 'Contractor (Vertex BuildWorks)' : 'Client (Arun Kumar)'}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setRole(role === 'CONTRACTOR' ? 'CLIENT' : 'CONTRACTOR')}
              className="px-3.5 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-800 transition-colors"
            >
              Toggle to {role === 'CONTRACTOR' ? 'Client View' : 'Contractor View'}
            </button>
          </div>
        </div>

        {/* Footer save */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all demo state to fresh default dataset?')) {
                resetData();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Demo Database</span>
          </button>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                <Check className="h-3.5 w-3.5" /> Saved changes!
              </span>
            )}
            <button
              type="submit"
              className="px-6 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
            >
              Save Organization Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
