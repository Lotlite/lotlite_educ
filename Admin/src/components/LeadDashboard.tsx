import { useEffect, useState } from 'react';
import { Users, Search, AlertCircle, CheckCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface Lead {
  _id: string;
  fullName: string;
  email?: string;
  phone: string;
  programCategory?: string;
  source: string;
  callyzerStatus: 'pending' | 'sent' | 'failed';
  createdAt: string;
}

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

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/leads`);
        const data = await res.json();
        if (data.success) {
          setLeads(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch leads', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  // Extract unique sources for the filter dropdown
  const uniqueSources = Array.from(new Set(leads.map(lead => lead.source))).filter(Boolean);

  // Reset to first page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFrom, dateTo, statusFilter, sourceFilter, rowsPerPage]);

  const filteredLeads = leads.filter(lead => {
    const leadDate = new Date(lead.createdAt);
    
    let matchesDate = true;
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      if (leadDate < from) matchesDate = false;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (leadDate > to) matchesDate = false;
    }

    const matchesStatus = statusFilter === 'all' || lead.callyzerStatus === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    
    return matchesDate && matchesStatus && matchesSource;
  });

  const totalPages = Math.ceil(filteredLeads.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Users className="text-wine" /> Leads Dashboard
          </h1>
          <p className="text-muted mt-2">Manage and monitor captured leads from all sources.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full flex-wrap items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-sm text-gray-500 font-medium whitespace-nowrap">From:</label>
            <input 
              type="date" 
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine bg-white text-sm text-gray-700 w-full sm:w-auto"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-sm text-gray-500 font-medium whitespace-nowrap">To:</label>
            <input 
              type="date" 
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine bg-white text-sm text-gray-700 w-full sm:w-auto"
            />
          </div>

          <div className="w-px h-8 bg-gray-200 hidden sm:block mx-2"></div>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine bg-white text-sm text-gray-700 w-full sm:w-auto cursor-pointer"
          >
            <option value="all">All Sources</option>
            {uniqueSources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine bg-white text-sm text-gray-700 w-full sm:w-auto cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="sent">Sent</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="animate-pulse flex flex-col items-center gap-3">
                      <div className="h-6 w-6 border-2 border-wine border-t-transparent rounded-full animate-spin"></div>
                      Loading leads...
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No leads found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{lead.fullName}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{lead.phone}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-[150px]">
                      {lead.programCategory || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {lead.callyzerStatus === 'sent' && <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle size={14}/> Sent</span>}
                      {lead.callyzerStatus === 'failed' && <span className="inline-flex items-center gap-1 text-red-600 text-xs font-medium"><AlertCircle size={14}/> Failed</span>}
                      {lead.callyzerStatus === 'pending' && <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-medium"><Clock size={14}/> Pending</span>}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 text-xs whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleString(undefined, { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
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
                  id="rowsPerPage"
                  value={rowsPerPage} 
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="border border-gray-200 rounded-md text-sm py-1 pl-2 pr-6 focus:outline-none focus:ring-1 focus:ring-wine focus:border-wine"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="text-sm text-gray-700 px-2">
                  Page {currentPage} of {totalPages}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
