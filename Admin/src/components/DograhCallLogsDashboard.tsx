import { useEffect, useState, useCallback } from 'react';
import {
  Phone, CheckCircle, AlertCircle, DollarSign, Clock,
  ChevronLeft, ChevronRight, Trash2, X, Loader2,
  ExternalLink, Mic, FileText, Search, ChevronDown, ChevronUp,
  RefreshCw
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CostInfo {
  total_cost?: number;
  currency?: string;
  [key: string]: unknown;
}

interface DograhCallLog {
  _id: string;
  workflow_run_id: number;
  workflow_run_name: string;
  workflow_name: string;
  call_time: string;
  status: 'completed' | 'failed' | 'unknown';
  initial_context: Record<string, unknown>;
  gathered_context: Record<string, unknown>;
  cost_info: CostInfo;
  annotations: Record<string, unknown>;
  recording_url: string | null;
  transcript_url: string | null;
  campaign_id: number | null;
  createdAt: string;
}

interface Stats {
  totalCalls: number;
  completedCalls: number;
  failedCalls: number;
  totalCost: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function StatusBadge({ status }: { status: DograhCallLog['status'] }) {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle size={11} /> Completed
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
        <AlertCircle size={11} /> Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
      <Clock size={11} /> Unknown
    </span>
  );
}

// ── Detail Drawer ─────────────────────────────────────────────────────────────

function DetailDrawer({ log, onClose }: { log: DograhCallLog; onClose: () => void }) {
  const [section, setSection] = useState<'context' | 'cost' | 'qa'>('context');

  const phone = (log.initial_context?.phone || log.initial_context?.phone_number || '—') as string;
  const customerName = (log.initial_context?.customer_name || log.initial_context?.name || '—') as string;
  const outcome = (log.gathered_context?.resolution || log.gathered_context?.outcome || log.gathered_context?.mapped_call_disposition || log.gathered_context?.call_disposition || '—') as string;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* backdrop */}
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* panel */}
      <div className="relative w-full max-w-xl bg-white shadow-2xl flex flex-col h-full overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 bg-white shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">{log.workflow_run_name || 'Call Detail'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Run ID #{log.workflow_run_id} · {formatDate(log.call_time)}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Quick info strip */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 shrink-0">
          <div className="px-4 py-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Customer</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{customerName}</p>
          </div>
          <div className="px-4 py-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Phone</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5 font-mono">{phone}</p>
          </div>
          <div className="px-4 py-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Outcome</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{outcome}</p>
          </div>
        </div>

        {/* Recording & Transcript buttons */}
        {(log.recording_url || log.transcript_url) && (
          <div className="flex gap-2 px-6 py-3 border-b border-gray-100 shrink-0">
            {log.recording_url && (
              <a
                href={log.recording_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors"
              >
                <Mic size={13} /> Listen to Recording <ExternalLink size={11} />
              </a>
            )}
            {log.transcript_url && (
              <a
                href={log.transcript_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 border border-violet-200 rounded-lg text-xs font-medium hover:bg-violet-100 transition-colors"
              >
                <FileText size={13} /> View Transcript <ExternalLink size={11} />
              </a>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-100 shrink-0 px-6">
          {(['context', 'cost', 'qa'] as const).map(t => (
            <button
              key={t}
              onClick={() => setSection(t)}
              className={`py-2.5 px-3 text-xs font-semibold capitalize mr-1 border-b-2 transition-colors ${
                section === t ? 'border-wine text-wine' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'context' ? 'Call Context' : t === 'cost' ? 'Cost Breakdown' : 'QA Annotations'}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {section === 'context' && (
            <>
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Initial Context (sent to agent)</h4>
                <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700 overflow-auto whitespace-pre-wrap font-mono">
                  {JSON.stringify(log.initial_context, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Gathered Context (collected by agent)</h4>
                <pre className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-gray-700 overflow-auto whitespace-pre-wrap font-mono">
                  {JSON.stringify(log.gathered_context, null, 2)}
                </pre>
              </div>
            </>
          )}

          {section === 'cost' && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Cost Breakdown</h4>
              {Object.keys(log.cost_info).length === 0 ? (
                <p className="text-sm text-gray-400">No cost data available for this run.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(log.cost_info)
                    .filter(([k, v]) => typeof v !== 'object' || v === null)
                    .map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center py-2 border-b border-gray-100 text-sm">
                      <span className="text-gray-600 capitalize">{k.replace(/_/g, ' ')}</span>
                      <span className="font-semibold text-gray-900">
                        {k.includes('cost') && typeof v === 'number' ? `₹${(v * 94.38).toFixed(4)}` : String(v)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === 'qa' && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">QA Annotations</h4>
              {Object.keys(log.annotations).length === 0 ? (
                <p className="text-sm text-gray-400">No QA annotations for this run.</p>
              ) : (
                <pre className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-gray-700 overflow-auto whitespace-pre-wrap font-mono">
                  {JSON.stringify(log.annotations, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>

        {/* Status footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 shrink-0 flex items-center justify-between">
          <StatusBadge status={log.status} />
          <p className="text-xs text-gray-400">Workflow: {log.workflow_name || '—'}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function DograhCallLogsDashboard() {
  const API = import.meta.env.VITE_API_URL || '';

  const [logs, setLogs] = useState<DograhCallLog[]>([]);
  const [stats, setStats] = useState<Stats>({ totalCalls: 0, completedCalls: 0, failedCalls: 0, totalCost: '0' });
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 15, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // Detail drawer
  const [selectedLog, setSelectedLog] = useState<DograhCallLog | null>(null);

  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Expanded rows for quick preview
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const toggleRow = (id: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const fetchLogs = useCallback(async (page = 1, showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true); else setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(rowsPerPage),
      });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`${API}/api/dograh-call-logs?${params}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
        setPagination(data.pagination);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch Dograh call logs', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [API, statusFilter, dateFrom, dateTo, search, rowsPerPage]);

  useEffect(() => { fetchLogs(1); }, [statusFilter, dateFrom, dateTo, rowsPerPage]);

  // Search with debounce
  useEffect(() => {
    const t = setTimeout(() => fetchLogs(1), 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleDeleteLog = async (runId: number) => {
    setDeletingId(runId);
    try {
      const res = await fetch(`${API}/api/dograh-call-logs/${runId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Log deleted.', 'success');
        fetchLogs(pagination.page, true);
      } else {
        showToast(data.error || 'Failed to delete.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  // ── Stat Cards ──────────────────────────────────────────────────────────────
  const statCards = [
    {
      label: 'Total Calls',
      value: stats.totalCalls,
      icon: Phone,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: 'Completed',
      value: stats.completedCalls,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'Failed / No Answer',
      value: stats.failedCalls,
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-100',
    },
    {
      label: 'Total AI Call Cost (INR)',
      value: `₹${(Number(stats.totalCost) * 94.38).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-100',
    },
  ];

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

      {/* Detail Drawer */}
      {selectedLog && (
        <DetailDrawer log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <Phone className="text-wine" /> Voice Agent Logs
            </h1>
            <p className="text-gray-500 mt-2">View all AI voice-agent call results, outcomes, and costs.</p>
          </div>
          <button
            onClick={() => fetchLogs(pagination.page, true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 active:scale-95 transition-all shadow-sm disabled:opacity-60"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(stat => (
          <div key={stat.label} className={`bg-white rounded-xl border ${stat.border} shadow-sm p-5`}>
            <div className={`${stat.bg} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{loading ? '—' : stat.value}</h3>
            <p className="text-gray-500 font-medium text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine bg-white text-sm text-gray-700"
          />
        </div>

        <div className="w-px h-8 bg-gray-200 hidden sm:block" />

        {/* Date from */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500 font-medium whitespace-nowrap">From:</label>
          <input
            type="date" value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine bg-white text-sm text-gray-700"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500 font-medium whitespace-nowrap">To:</label>
          <input
            type="date" value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine bg-white text-sm text-gray-700"
          />
        </div>

        <div className="w-px h-8 bg-gray-200 hidden sm:block" />

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine bg-white text-sm text-gray-700 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 w-8" />
                <th className="px-4 py-3">Run Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Outcome</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Call Time</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-6 w-6 border-2 border-wine border-t-transparent rounded-full animate-spin" />
                      Loading call logs...
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Phone size={28} className="text-gray-300" />
                      <p className="font-medium">No call logs found.</p>
                      <p className="text-xs">Dograh will send data here after each completed call.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map(log => {
                  const phone = (log.initial_context?.phone || log.initial_context?.phone_number || '—') as string;
                  const outcome = (log.gathered_context?.resolution || log.gathered_context?.outcome || log.gathered_context?.mapped_call_disposition || log.gathered_context?.call_disposition || '—') as string;
                  const cost = log.cost_info?.total_cost;
                  const isExpanded = expandedRows.has(log.workflow_run_id);

                  return (
                    <>
                      <tr
                        key={log._id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedLog(log)}
                      >
                        {/* Expand toggle */}
                        <td className="px-4 py-3.5" onClick={e => { e.stopPropagation(); toggleRow(log.workflow_run_id); }}>
                          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-gray-900">
                          <span className="block truncate max-w-[180px]">{log.workflow_run_name || `Run #${log.workflow_run_id}`}</span>
                          <span className="text-[11px] text-gray-400 font-mono">#{log.workflow_run_id}</span>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-gray-600">{phone}</td>
                        <td className="px-4 py-3.5 text-gray-600 truncate max-w-[140px]">{outcome}</td>
                        <td className="px-4 py-3.5"><StatusBadge status={log.status} /></td>
                        <td className="px-4 py-3.5 text-gray-600 text-xs font-mono">
                          {cost !== undefined ? `₹${(Number(cost) * 94.38).toFixed(2)}` : '—'}
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">{formatDate(log.call_time)}</td>
                        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            {log.recording_url && (
                              <a href={log.recording_url} target="_blank" rel="noreferrer"
                                className="p-1.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Listen to recording">
                                <Mic size={15} />
                              </a>
                            )}
                            {log.transcript_url && (
                              <a href={log.transcript_url} target="_blank" rel="noreferrer"
                                className="p-1.5 text-violet-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                                title="View transcript">
                                <FileText size={15} />
                              </a>
                            )}
                            {confirmDeleteId === log.workflow_run_id ? (
                              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                <button
                                  onClick={() => handleDeleteLog(log.workflow_run_id)}
                                  disabled={deletingId === log.workflow_run_id}
                                  className="px-2 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 disabled:opacity-60 flex items-center gap-1"
                                >
                                  {deletingId === log.workflow_run_id ? <Loader2 size={11} className="animate-spin" /> : null}
                                  Yes
                                </button>
                                <button onClick={() => setConfirmDeleteId(null)}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-gray-200">
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteId(log.workflow_run_id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete log">
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded quick-view row */}
                      {isExpanded && (
                        <tr key={`${log._id}-expanded`} className="bg-slate-50">
                          <td colSpan={8} className="px-6 py-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                              <div>
                                <p className="font-semibold text-gray-500 uppercase tracking-wider mb-1">Gathered Context</p>
                                <pre className="bg-white border border-gray-200 rounded-lg p-2 text-gray-700 overflow-auto whitespace-pre-wrap font-mono text-[11px] max-h-32">
                                  {JSON.stringify(log.gathered_context, null, 2)}
                                </pre>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-500 uppercase tracking-wider mb-1">Initial Context</p>
                                <pre className="bg-white border border-gray-200 rounded-lg p-2 text-gray-700 overflow-auto whitespace-pre-wrap font-mono text-[11px] max-h-32">
                                  {JSON.stringify(log.initial_context, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && logs.length > 0 && (
          <div className="bg-white border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900 mx-1">{(pagination.page - 1) * pagination.limit + 1}</span> to
              <span className="font-medium text-gray-900 mx-1">{Math.min(pagination.page * pagination.limit, pagination.total)}</span>
              of <span className="font-medium text-gray-900 mx-1">{pagination.total}</span> results
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500">Rows:</label>
                <select
                  value={rowsPerPage}
                  onChange={e => setRowsPerPage(Number(e.target.value))}
                  className="border border-gray-200 rounded-md text-sm py-1 pl-2 pr-6 focus:outline-none focus:ring-1 focus:ring-wine focus:border-wine"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => fetchLogs(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm text-gray-700 px-2">Page {pagination.page} of {pagination.totalPages}</span>
                <button
                  onClick={() => fetchLogs(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
