import { useEffect, useState } from 'react';
import { MessageSquare, RefreshCw, Activity, Users, Search, FilterX } from 'lucide-react';

export default function ChatbotLogsDashboard() {
  const [chatLogs, setChatLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [leadStatus, setLeadStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchChatLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/chat/logs`);
      const data = await res.json();
      if (data.success) {
        setChatLogs(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch chat logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatLogs();
  }, []);

  const filteredLogs = chatLogs.filter(session => {
    const sessionDate = new Date(session.updatedAt || session.createdAt);

    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      if (sessionDate < from) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (sessionDate > to) return false;
    }

    if (leadStatus === 'converted' && !session.leadId) return false;
    if (leadStatus === 'none' && session.leadId) return false;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const idMatch = session.sessionId?.toLowerCase().includes(lowerQuery);
      const messagesMatch = session.messages?.some((msg: any) => msg.text?.toLowerCase().includes(lowerQuery));
      if (!idMatch && !messagesMatch) return false;
    }

    return true;
  });

  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setLeadStatus('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 relative">
      

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <MessageSquare className="text-wine" /> Chatbot Logs
          </h1>
          <p className="text-muted mt-2">Review all user conversations with the AI Assistant.</p>
        </div>
        <button
          onClick={fetchChatLogs}
          disabled={loading}
          className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-medium text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh Logs
        </button>
      </div>

      {/* Filter Controls */}
      <div className="mb-8 flex flex-col sm:flex-row gap-3 w-full flex-wrap items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 w-full sm:w-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by keyword or session ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine bg-white text-sm text-gray-700"
          />
        </div>

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

        <select
          value={leadStatus}
          onChange={(e) => setLeadStatus(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine bg-white text-sm text-gray-700 w-full sm:w-auto cursor-pointer"
        >
          <option value="all">All Sessions</option>
          <option value="converted">Converted to Lead</option>
          <option value="none">No Lead Data</option>
        </select>

        {(dateFrom || dateTo || leadStatus !== 'all' || searchQuery) && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5 w-full sm:w-auto"
            title="Clear Filters"
          >
            <FilterX size={16} /> Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-2 border-wine border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-500 font-medium">Loading session transcripts...</span>
          </div>
        </div>
      ) : chatLogs.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-xl shadow-sm">
          <MessageSquare size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">No chatbot logs found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-200 rounded-xl shadow-sm">
              <MessageSquare size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">No results match your filters.</p>
            </div>
          ) : (
            filteredLogs.map((session, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-hidden flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Session ID: <span className="text-gray-900 font-mono">{session.sessionId}</span></p>
                    {session.leadId && (
                      <p className="text-[10px] uppercase font-bold text-green-700 mt-2 bg-green-50 border border-green-200 inline-block px-2.5 py-1 rounded-md shadow-sm">
                        Converted Lead: {session.leadId.fullName || "Unknown"}
                      </p>
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-gray-500 font-medium uppercase tracking-wider bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    {new Date(session.updatedAt || session.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 space-y-4 max-h-[400px] overflow-y-auto">
                  {session.messages && session.messages.map((msg: any, j: number) => (
                    <div key={j} className={`flex gap-3 text-sm font-medium leading-relaxed ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.sender !== 'user' && (
                        <span className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-wine/10 text-wine border border-wine/20">
                          <Activity size={14} />
                        </span>
                      )}
                      <div className={`p-3.5 rounded-2xl max-w-[85%] shadow-sm ${msg.sender === 'user' ? 'bg-wine text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'}`}>
                        <span className="break-words whitespace-pre-wrap">{msg.text || (msg.isContactForm ? '[Callback Request Form Displayed]' : '')}</span>
                      </div>
                      {msg.sender === 'user' && (
                        <span className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-gray-200 text-gray-500 border border-gray-300">
                          <Users size={14} />
                        </span>
                      )}
                    </div>
                  ))}
                  {(!session.messages || session.messages.length === 0) && (
                    <p className="text-sm text-gray-400 italic text-center py-6">Session initialized but no messages recorded.</p>
                  )}
                </div>
              </div>
            )))}
        </div>
      )}
    </div>
  );
}
