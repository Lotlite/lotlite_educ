import { useEffect, useState } from 'react';
import { Users, MousePointerClick, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

interface Lead {
  _id: string;
  fullName: string;
  source: string;
  callyzerStatus: string;
  createdAt: string;
}

export default function OverviewDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Compute Real Metrics
  const totalLeads = leads.length;
  const sentLeads = leads.filter(l => l.callyzerStatus === 'sent').length;
  const failedLeads = leads.filter(l => l.callyzerStatus === 'failed').length;
  const successRate = totalLeads > 0 ? Math.round((sentLeads / totalLeads) * 100) : 0;

  // Compute Top Source
  const sources = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const sortedSources = Object.entries(sources).sort((a, b) => b[1] - a[1]);
  const topSource = sortedSources.length > 0 ? sortedSources[0][0] : 'N/A';

  const stats = [
    {
      label: 'Total Leads Captured',
      value: totalLeads.toString(),
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      label: 'Callyzer Success Rate',
      value: `${successRate}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      label: 'Top Lead Source',
      value: topSource,
      icon: MousePointerClick,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      label: 'Failed API Syncs',
      value: failedLeads.toString(),
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-100'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen p-8 max-w-7xl mx-auto flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-wine border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          System Overview
        </h1>
        <p className="text-muted mt-2">Real-time metrics based on your actual database leads.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1 truncate" title={stat.value}>{stat.value}</h3>
            <p className="text-gray-500 font-medium text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Source Breakdown Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MousePointerClick className="w-5 h-5 text-gray-400"/> Leads by Source
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider pb-2 border-b border-gray-100">
              <span>Source Name</span>
              <span className="text-right">Total Leads</span>
            </div>
            {sortedSources.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No data available.</p>
            )}
            {sortedSources.map(([sourceName, count], i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium truncate pr-4">{sourceName}</span>
                <span className="text-gray-900 font-semibold bg-gray-100 px-2 py-1 rounded-md">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sync Status Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-gray-400"/> API Sync Status
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider pb-2 border-b border-gray-100">
              <span>Status</span>
              <span className="text-right">Count</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-emerald-600 font-medium flex items-center gap-1.5"><CheckCircle className="w-4 h-4"/> Sent to Callyzer</span>
              <span className="text-gray-900 font-semibold bg-gray-100 px-2 py-1 rounded-md">{sentLeads}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-red-600 font-medium flex items-center gap-1.5"><AlertCircle className="w-4 h-4"/> Failed to Sync</span>
              <span className="text-gray-900 font-semibold bg-gray-100 px-2 py-1 rounded-md">{failedLeads}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-amber-600 font-medium flex items-center gap-1.5"><Users className="w-4 h-4"/> Pending / Unknown</span>
              <span className="text-gray-900 font-semibold bg-gray-100 px-2 py-1 rounded-md">{totalLeads - sentLeads - failedLeads}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
