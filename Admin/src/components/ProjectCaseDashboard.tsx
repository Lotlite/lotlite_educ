import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Briefcase } from 'lucide-react';

interface ProjectCase {
  _id: string;
  founder: string;
  company: string;
  problem: string;
  tag: string;
  solution: string;
}

export default function ProjectCaseDashboard() {
  const API_BASE = import.meta.env.VITE_API_URL || '';

  const [cases, setCases] = useState<ProjectCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<ProjectCase | null>(null);

  const [formData, setFormData] = useState({
    founder: '',
    company: '',
    problem: '',
    tag: '',
    solution: ''
  });

  const fetchCases = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/project-cases`);
      const data = await res.json();
      setCases(data);
    } catch (error) {
      console.error('Error fetching project cases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleOpenModal = (projCase?: ProjectCase) => {
    if (projCase) {
      setEditingCase(projCase);
      setFormData({
        founder: projCase.founder,
        company: projCase.company,
        problem: projCase.problem,
        tag: projCase.tag,
        solution: projCase.solution
      });
    } else {
      setEditingCase(null);
      setFormData({
        founder: '',
        company: '',
        problem: '',
        tag: '',
        solution: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCase(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCase 
        ? `${API_BASE}/api/project-cases/${editingCase._id}`
        : `${API_BASE}/api/project-cases`;
      
      const method = editingCase ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        fetchCases();
        handleCloseModal();
      } else {
        alert('Failed to save project case');
      }
    } catch (error) {
      console.error('Error saving project case:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        const res = await fetch(`${API_BASE}/api/project-cases/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          fetchCases();
        }
      } catch (error) {
        console.error('Error deleting project case:', error);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="text-wine" />
            Student Case Projects
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage Applied Strategy Codes and Case Studies.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-wine hover:bg-wine/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add New Case
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((projCase) => (
            <div key={projCase._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-wine uppercase tracking-wider bg-wine/10 px-2 py-1 rounded-full">
                    {projCase.tag}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(projCase)} className="text-gray-400 hover:text-wine transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(projCase._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-2">{projCase.company}</h3>
                <p className="text-sm font-medium text-gray-600 mb-4">Founder: {projCase.founder}</p>
                <div className="text-xs text-gray-500 mb-4 flex-1">
                  <strong>Problem:</strong> {projCase.problem.substring(0, 80)}...
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <h3 className="text-lg font-bold text-gray-900">
                {editingCase ? 'Edit Case Project' : 'Add New Case Project'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Founder Name</label>
                  <input
                    type="text"
                    required
                    value={formData.founder}
                    onChange={(e) => setFormData({...formData, founder: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-wine focus:border-wine outline-none"
                    placeholder="e.g. Utkarsh Gupta"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-wine focus:border-wine outline-none"
                    placeholder="e.g. Cosmos Realty"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tag (Applied Strategy Code)</label>
                <input
                  type="text"
                  required
                  value={formData.tag}
                  onChange={(e) => setFormData({...formData, tag: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-wine focus:border-wine outline-none"
                  placeholder="e.g. Brand Strategy"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Problem Statement</label>
                <textarea
                  required
                  rows={3}
                  value={formData.problem}
                  onChange={(e) => setFormData({...formData, problem: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-wine focus:border-wine outline-none resize-none"
                  placeholder="Describe the problem..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Solution / Action Taken</label>
                <textarea
                  required
                  rows={4}
                  value={formData.solution}
                  onChange={(e) => setFormData({...formData, solution: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-wine focus:border-wine outline-none resize-none"
                  placeholder="Describe the solution..."
                />
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-wine hover:bg-wine/90 rounded-lg transition-colors"
                >
                  {editingCase ? 'Save Changes' : 'Create Case Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
