import { useEffect, useState } from 'react';
import {
  Users, AlertCircle, CheckCircle, Clock,
  ChevronLeft, ChevronRight, Plus, Trash2, X, Loader2
} from 'lucide-react';

interface Lead {
  _id: string;
  fullName: string;
  email?: string;
  phone: string;
  programCategory?: string;
  programSpecialization?: string;
  source: string;
  callyzerStatus: 'pending' | 'sent' | 'failed';
  createdAt: string;
}

interface AddLeadForm {
  fullName: string;
  email: string;
  phone: string;
  programCategory: string;
  programSpecialization: string;
  source: string;
}

const EMPTY_FORM: AddLeadForm = {
  fullName: '',
  email: '',
  phone: '',
  programCategory: '',
  programSpecialization: '',
  source: 'Admin Panel',
};

export default function LeadDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Add Lead Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<AddLeadForm>(EMPTY_FORM);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const API = import.meta.env.VITE_API_URL || '';

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API}/api/leads`);
      const data = await res.json();
      if (data.success) setLeads(data.data);
    } catch (err) {
      console.error('Failed to fetch leads', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  // Extract unique sources for the filter dropdown
  const uniqueSources = Array.from(new Set(leads.map(l => l.source))).filter(Boolean);

  // Reset to first page when any filter changes
  useEffect(() => { setCurrentPage(1); }, [dateFrom, dateTo, statusFilter, sourceFilter, rowsPerPage]);

  const filteredLeads = leads.filter(lead => {
    const leadDate = new Date(lead.createdAt);
    let matchesDate = true;
    if (dateFrom) {
      const from = new Date(dateFrom); from.setHours(0, 0, 0, 0);
      if (leadDate < from) matchesDate = false;
    }
    if (dateTo) {
      const to = new Date(dateTo); to.setHours(23, 59, 59, 999);
      if (leadDate > to) matchesDate = false;
    }
    const matchesStatus = statusFilter === 'all' || lead.callyzerStatus === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    return matchesDate && matchesStatus && matchesSource;
  });

  const totalPages = Math.ceil(filteredLeads.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + rowsPerPage);

  // --- Add Lead ---
  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    if (!form.fullName.trim() || !form.phone.trim()) {
      setAddError('Full name and phone are required.');
      return;
    }
    setAddLoading(true);
    try {
      const res = await fetch(`${API}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Lead added successfully!', 'success');
        setShowAddModal(false);
        setForm(EMPTY_FORM);
        await fetchLeads();
      } else {
        setAddError(data.error || 'Failed to add lead.');
      }
    } catch {
      setAddError('Network error. Please try again.');
    } finally {
      setAddLoading(false);
    }
  };

  // --- Delete Lead ---
  const handleDeleteLead = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${API}/api/leads/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setLeads(prev => prev.filter(l => l._id !== id));
        showToast('Lead deleted.', 'success');
      } else {
        showToast(data.error || 'Failed to delete lead.', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all
            ${toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}
        >
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col gap-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <Users className="text-wine" /> Leads Dashboard
            </h1>
            <p className="text-gray-500 mt-2">Manage and monitor captured leads from all sources.</p>
          </div>
          <button
            onClick={() => { setShowAddModal(true); setAddError(''); setForm(EMPTY_FORM); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-wine text-white rounded-lg text-sm font-semibold hover:bg-wine/90 active:scale-95 transition-all shadow-sm"
            id="add-lead-btn"
          >
            <Plus size={18} /> Add Lead
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full flex-wrap items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-sm text-gray-500 font-medium whitespace-nowrap">From:</label>
            <input
              type="date" value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine bg-white text-sm text-gray-700 w-full sm:w-auto"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-sm text-gray-500 font-medium whitespace-nowrap">To:</label>
            <input
              type="date" value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine bg-white text-sm text-gray-700 w-full sm:w-auto"
            />
          </div>
          <div className="w-px h-8 bg-gray-200 hidden sm:block mx-2"></div>
          <select
            value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine bg-white text-sm text-gray-700 w-full sm:w-auto cursor-pointer"
          >
            <option value="all">All Sources</option>
            {uniqueSources.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine bg-white text-sm text-gray-700 w-full sm:w-auto cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="sent">Sent</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Program</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="animate-pulse flex flex-col items-center gap-3">
                      <div className="h-6 w-6 border-2 border-wine border-t-transparent rounded-full animate-spin"></div>
                      Loading leads...
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No leads found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedLeads.map(lead => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{lead.fullName}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{lead.phone}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-[150px]">{lead.programCategory || '-'}</td>
                    <td className="px-6 py-4">
                      {lead.callyzerStatus === 'sent' && <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle size={14} /> Sent</span>}
                      {lead.callyzerStatus === 'failed' && <span className="inline-flex items-center gap-1 text-red-600 text-xs font-medium"><AlertCircle size={14} /> Failed</span>}
                      {lead.callyzerStatus === 'pending' && <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-medium"><Clock size={14} /> Pending</span>}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 text-xs whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {confirmDeleteId === lead._id ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDeleteLead(lead._id)}
                            disabled={deletingId === lead._id}
                            className="px-2.5 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 disabled:opacity-60 flex items-center gap-1"
                          >
                            {deletingId === lead._id ? <Loader2 size={12} className="animate-spin" /> : null}
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(lead._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete lead"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && filteredLeads.length > 0 && (
          <div className="bg-white border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900 mx-1">{startIndex + 1}</span> to
              <span className="font-medium text-gray-900 mx-1">{Math.min(startIndex + rowsPerPage, filteredLeads.length)}</span>
              of <span className="font-medium text-gray-900 mx-1">{filteredLeads.length}</span> results
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="rowsPerPage" className="text-sm text-gray-500">Rows per page:</label>
                <select
                  id="rowsPerPage" value={rowsPerPage}
                  onChange={e => setRowsPerPage(Number(e.target.value))}
                  className="border border-gray-200 rounded-md text-sm py-1 pl-2 pr-6 focus:outline-none focus:ring-1 focus:ring-wine focus:border-wine"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft size={20} />
                </button>
                <div className="text-sm text-gray-700 px-2">Page {currentPage} of {totalPages}</div>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Add Lead Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Add New Lead</h2>
                <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to create a lead.</p>
              </div>
              <button onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddLead} className="px-6 py-5 space-y-4">
              {addError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle size={16} className="shrink-0" /> {addError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <input
                    id="lead-fullName"
                    type="text" placeholder="e.g. Rahul Sharma"
                    value={form.fullName}
                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone <span className="text-red-500">*</span></label>
                  <input
                    id="lead-phone"
                    type="tel" placeholder="e.g. 9876543210"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                  <input
                    id="lead-email"
                    type="email" placeholder="e.g. rahul@email.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Program Category</label>
                  <input
                    id="lead-programCategory"
                    type="text" placeholder="e.g. MBA"
                    value={form.programCategory}
                    onChange={e => setForm(f => ({ ...f, programCategory: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Specialization</label>
                  <input
                    id="lead-programSpecialization"
                    type="text" placeholder="e.g. Finance"
                    value={form.programSpecialization}
                    onChange={e => setForm(f => ({ ...f, programSpecialization: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Source</label>
                  <input
                    id="lead-source"
                    type="text" placeholder="e.g. Admin Panel"
                    value={form.source}
                    onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={addLoading}
                  id="submit-add-lead-btn"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-wine text-white text-sm font-semibold rounded-lg hover:bg-wine/90 disabled:opacity-60 active:scale-95 transition-all">
                  {addLoading && <Loader2 size={15} className="animate-spin" />}
                  {addLoading ? 'Adding...' : 'Add Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
