import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, UploadCloud, Loader2, FileText, Users, Plus, Trash2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function WebsiteDataDashboard() {
  const [activeTab, setActiveTab] = useState<'certificates' | 'brochures' | 'instructors' | 'mentors'>('certificates');

  const [data, setData] = useState<Record<string, string>>({
    bba_certificate_url: '',
    mba_certificate_url: '',
    bca_certificate_url: '',
    mca_certificate_url: '',
    bba_brochure_url: '',
    mba_brochure_url: '',
    bca_brochure_url: '',
    mca_brochure_url: ''
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [instructors, setInstructors] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [industryMentors, setIndustryMentors] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingBBA, setUploadingBBA] = useState(false);
  const [uploadingMBA, setUploadingMBA] = useState(false);
  const [uploadingBCA, setUploadingBCA] = useState(false);
  const [uploadingMCA, setUploadingMCA] = useState(false);
  const [uploadingBBABrochure, setUploadingBBABrochure] = useState(false);
  const [uploadingMBABrochure, setUploadingMBABrochure] = useState(false);
  const [uploadingBCABrochure, setUploadingBCABrochure] = useState(false);
  const [uploadingMCABrochure, setUploadingMCABrochure] = useState(false);

  const [uploadingInstructorImage, setUploadingInstructorImage] = useState<number | null>(null);
  const [uploadingMentorImage, setUploadingMentorImage] = useState<number | null>(null);

  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchWebsiteData = async () => {
    try {
      const [certRes, instRes, mentorRes] = await Promise.all([
        fetch(`${API_BASE}/api/website-data/certificates`),
        fetch(`${API_BASE}/api/website-data/instructors`),
        fetch(`${API_BASE}/api/website-data/industryMentors`)
      ]);

      if (certRes.ok) {
        const json = await certRes.json();
        if (json.data) {
          setData(prev => ({ ...prev, ...json.data }));
        }
      }

      if (instRes.ok) {
        const json = await instRes.json();
        if (json.data && Array.isArray(json.data)) {
          setInstructors(json.data);
        }
      }

      if (mentorRes.ok) {
        const json = await mentorRes.json();
        if (json.data && Array.isArray(json.data)) {
          setIndustryMentors(json.data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch website data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWebsiteData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      // Save based on active tab
      let endpoint = '';
      let payload = {};

      if (activeTab === 'certificates' || activeTab === 'brochures') {
        endpoint = `${API_BASE}/api/website-data/certificates`;
        payload = { data };
      } else if (activeTab === 'instructors') {
        endpoint = `${API_BASE}/api/website-data/instructors`;
        payload = { data: instructors };
      } else if (activeTab === 'mentors') {
        endpoint = `${API_BASE}/api/website-data/industryMentors`;
        payload = { data: industryMentors };
      }

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setMessage({ text: 'Data saved successfully!', type: 'success' });
      } else {
        setMessage({ text: 'Failed to save data.', type: 'error' });
      }
    } catch (e) {
      console.error(e);
      setMessage({ text: 'Error saving data.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const setUploadState =
      field === 'bba_certificate_url' ? setUploadingBBA :
        field === 'mba_certificate_url' ? setUploadingMBA :
          field === 'bca_certificate_url' ? setUploadingBCA :
            field === 'mca_certificate_url' ? setUploadingMCA :
              field === 'bba_brochure_url' ? setUploadingBBABrochure :
                field === 'mba_brochure_url' ? setUploadingMBABrochure :
                  field === 'bca_brochure_url' ? setUploadingBCABrochure : setUploadingMCABrochure;

    setUploadState(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const result = await res.json();
        if (result.url) {
          setData(prev => ({ ...prev, [field]: result.url }));
          setMessage({ text: 'File uploaded! Remember to click Save Changes.', type: 'success' });
        }
      } else {
        setMessage({ text: 'Failed to upload file.', type: 'error' });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setMessage({ text: 'Error uploading file.', type: 'error' });
    } finally {
      setUploadState(false);
    }
  };

  const handleInstructorFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setUploadingInstructorImage(index);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const result = await res.json();
        if (result.url) {
          const newInstructors = [...instructors];
          newInstructors[index].imageUrl = result.url;
          setInstructors(newInstructors);
          setMessage({ text: 'Image uploaded! Remember to click Save Changes.', type: 'success' });
        }
      } else {
        setMessage({ text: 'Failed to upload image.', type: 'error' });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setMessage({ text: 'Error uploading image.', type: 'error' });
    } finally {
      setUploadingInstructorImage(null);
    }
  };

  const handleMentorFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setUploadingMentorImage(index);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const result = await res.json();
        if (result.url) {
          const newMentors = [...industryMentors];
          newMentors[index].imageUrl = result.url;
          setIndustryMentors(newMentors);
          setMessage({ text: 'Image uploaded! Remember to click Save Changes.', type: 'success' });
        }
      } else {
        setMessage({ text: 'Failed to upload image.', type: 'error' });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setMessage({ text: 'Error uploading image.', type: 'error' });
    } finally {
      setUploadingMentorImage(null);
    }
  };

  const addInstructor = () => {
    setInstructors([...instructors, {
      name: '',
      course: '',
      title: '',
      bio: '',
      tags: [],
      imageUrl: '',
      linkedinUrl: ''
    }]);
  };

  const removeInstructor = (index: number) => {
    const newInst = [...instructors];
    newInst.splice(index, 1);
    setInstructors(newInst);
  };

  const updateInstructor = (index: number, field: string, value: string | string[]) => {
    const newInst = [...instructors];
    newInst[index][field] = value;
    setInstructors(newInst);
  };

  const addMentor = () => {
    setIndustryMentors([...industryMentors, {
      name: '',
      role: '',
      company: '',
      bio: '',
      tags: [],
      imageUrl: ''
    }]);
  };

  const removeMentor = (index: number) => {
    const newMentors = [...industryMentors];
    newMentors.splice(index, 1);
    setIndustryMentors(newMentors);
  };

  const updateMentor = (index: number, field: string, value: string | string[]) => {
    const newMentors = [...industryMentors];
    newMentors[index][field] = value;
    setIndustryMentors(newMentors);
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-wine w-8 h-8" /></div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto w-full">
      {/* Page Header with Tabs */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Website Data Management
          </h1>
        </div>
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${activeTab === 'certificates'
              ? 'border-wine text-wine'
              : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
          >
            <ImageIcon size={16} /> Certificate Mockups
          </button>
          <button
            onClick={() => setActiveTab('brochures')}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${activeTab === 'brochures'
              ? 'border-wine text-wine'
              : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
          >
            <FileText size={16} /> Program Brochures
          </button>
          <button
            onClick={() => setActiveTab('instructors')}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${activeTab === 'instructors'
              ? 'border-wine text-wine'
              : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
          >
            <Users size={16} /> Instructors
          </button>
          <button
            onClick={() => setActiveTab('mentors')}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${activeTab === 'mentors'
              ? 'border-wine text-wine'
              : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
          >
            <Users size={16} /> Our Founders
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg text-sm font-medium mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Certificates Tab */}
      {activeTab === 'certificates' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon size={20} className="text-wine" />
              Certificate Mockups
            </h3>
            <p className="text-sm text-gray-500 mt-1">Upload the certificate images displayed on the program detail pages.</p>
          </div>

          <div className="p-6 space-y-8">
            {/* BBA Certificate */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">BBA Certificate Mockup</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {data.bba_certificate_url ? (
                  <div className="w-48 h-32 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shrink-0">
                    <img src={data.bba_certificate_url} alt="BBA Certificate" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-48 h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0 text-gray-400">
                    <ImageIcon size={32} />
                  </div>
                )}

                <div className="flex-1 w-full space-y-3">
                  <input
                    type="text"
                    value={data.bba_certificate_url}
                    onChange={(e) => setData({ ...data, bba_certificate_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-wine focus:border-transparent outline-none"
                  />

                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'bba_certificate_url')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingBBA}
                    />
                    <button
                      disabled={uploadingBBA}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      {uploadingBBA ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                      {uploadingBBA ? 'Uploading...' : 'Upload Image'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8"></div>

            {/* MBA Certificate */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">MBA Certificate Mockup</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {data.mba_certificate_url ? (
                  <div className="w-48 h-32 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shrink-0">
                    <img src={data.mba_certificate_url} alt="MBA Certificate" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-48 h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0 text-gray-400">
                    <ImageIcon size={32} />
                  </div>
                )}

                <div className="flex-1 w-full space-y-3">
                  <input
                    type="text"
                    value={data.mba_certificate_url}
                    onChange={(e) => setData({ ...data, mba_certificate_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-wine focus:border-transparent outline-none"
                  />

                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'mba_certificate_url')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingMBA}
                    />
                    <button
                      disabled={uploadingMBA}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      {uploadingMBA ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                      {uploadingMBA ? 'Uploading...' : 'Upload Image'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8"></div>

            {/* BCA Certificate */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">BCA Certificate Mockup</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {data.bca_certificate_url ? (
                  <div className="w-48 h-32 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shrink-0">
                    <img src={data.bca_certificate_url} alt="BCA Certificate" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-48 h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0 text-gray-400">
                    <ImageIcon size={32} />
                  </div>
                )}

                <div className="flex-1 w-full space-y-3">
                  <input
                    type="text"
                    value={data.bca_certificate_url || ''}
                    onChange={(e) => setData({ ...data, bca_certificate_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-wine focus:border-transparent outline-none"
                  />

                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'bca_certificate_url')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingBCA}
                    />
                    <button
                      disabled={uploadingBCA}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      {uploadingBCA ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                      {uploadingBCA ? 'Uploading...' : 'Upload Image'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8"></div>

            {/* MCA Certificate */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">MCA Certificate Mockup</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {data.mca_certificate_url ? (
                  <div className="w-48 h-32 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shrink-0">
                    <img src={data.mca_certificate_url} alt="MCA Certificate" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-48 h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0 text-gray-400">
                    <ImageIcon size={32} />
                  </div>
                )}

                <div className="flex-1 w-full space-y-3">
                  <input
                    type="text"
                    value={data.mca_certificate_url || ''}
                    onChange={(e) => setData({ ...data, mca_certificate_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-wine focus:border-transparent outline-none"
                  />

                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'mca_certificate_url')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingMCA}
                    />
                    <button
                      disabled={uploadingMCA}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      {uploadingMCA ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                      {uploadingMCA ? 'Uploading...' : 'Upload Image'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-wine hover:bg-red-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Brochures Tab */}
      {activeTab === 'brochures' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText size={20} className="text-wine" />
              Program Brochures
            </h3>
            <p className="text-sm text-gray-500 mt-1">Upload the PDF brochures for the academic programs.</p>
          </div>

          <div className="p-6 space-y-8">
            {/* BBA Brochure */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">BBA Brochure (PDF)</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1 w-full space-y-3">
                  <input
                    type="text"
                    value={data.bba_brochure_url || ''}
                    onChange={(e) => setData({ ...data, bba_brochure_url: e.target.value })}
                    placeholder="https://... (.pdf)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-wine focus:border-transparent outline-none"
                  />

                  <div className="relative inline-block w-full sm:w-auto">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => handleFileUpload(e, 'bba_brochure_url')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingBBABrochure}
                    />
                    <button
                      disabled={uploadingBBABrochure}
                      className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      {uploadingBBABrochure ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                      {uploadingBBABrochure ? 'Uploading...' : 'Upload PDF'}
                    </button>
                  </div>
                  {data.bba_brochure_url && <a href={data.bba_brochure_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline block">View uploaded BBA brochure</a>}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8"></div>

            {/* MBA Brochure */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">MBA Brochure (PDF)</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1 w-full space-y-3">
                  <input
                    type="text"
                    value={data.mba_brochure_url || ''}
                    onChange={(e) => setData({ ...data, mba_brochure_url: e.target.value })}
                    placeholder="https://... (.pdf)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-wine focus:border-transparent outline-none"
                  />

                  <div className="relative inline-block w-full sm:w-auto">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => handleFileUpload(e, 'mba_brochure_url')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingMBABrochure}
                    />
                    <button
                      disabled={uploadingMBABrochure}
                      className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      {uploadingMBABrochure ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                      {uploadingMBABrochure ? 'Uploading...' : 'Upload PDF'}
                    </button>
                  </div>
                  {data.mba_brochure_url && <a href={data.mba_brochure_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline block">View uploaded MBA brochure</a>}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8"></div>

            {/* BCA Brochure */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">BCA Brochure (PDF)</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1 w-full space-y-3">
                  <input
                    type="text"
                    value={data.bca_brochure_url || ''}
                    onChange={(e) => setData({ ...data, bca_brochure_url: e.target.value })}
                    placeholder="https://... (.pdf)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-wine focus:border-transparent outline-none"
                  />

                  <div className="relative inline-block w-full sm:w-auto">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => handleFileUpload(e, 'bca_brochure_url')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingBCABrochure}
                    />
                    <button
                      disabled={uploadingBCABrochure}
                      className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      {uploadingBCABrochure ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                      {uploadingBCABrochure ? 'Uploading...' : 'Upload PDF'}
                    </button>
                  </div>
                  {data.bca_brochure_url && <a href={data.bca_brochure_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline block">View uploaded BCA brochure</a>}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8"></div>

            {/* MCA Brochure */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">MCA Brochure (PDF)</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1 w-full space-y-3">
                  <input
                    type="text"
                    value={data.mca_brochure_url || ''}
                    onChange={(e) => setData({ ...data, mca_brochure_url: e.target.value })}
                    placeholder="https://... (.pdf)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-wine focus:border-transparent outline-none"
                  />

                  <div className="relative inline-block w-full sm:w-auto">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => handleFileUpload(e, 'mca_brochure_url')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingMCABrochure}
                    />
                    <button
                      disabled={uploadingMCABrochure}
                      className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      {uploadingMCABrochure ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                      {uploadingMCABrochure ? 'Uploading...' : 'Upload PDF'}
                    </button>
                  </div>
                  {data.mca_brochure_url && <a href={data.mca_brochure_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline block">View uploaded MCA brochure</a>}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-wine hover:bg-red-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Instructors Tab */}
      {activeTab === 'instructors' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users size={20} className="text-wine" />
                Instructors
              </h3>
              <p className="text-sm text-gray-500 mt-1">Manage the renowned faculty displayed on the homepage.</p>
            </div>
            <button
              onClick={addInstructor}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg text-sm transition-colors"
            >
              <Plus size={16} /> Add Instructor
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
            {instructors.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>No instructors added yet. Click "Add Instructor" to start.</p>
              </div>
            ) : (
              instructors.map((inst, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 relative">
                  <button
                    onClick={() => removeInstructor(idx)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove Instructor"
                  >
                    <Trash2 size={18} />
                  </button>
                  <h4 className="font-bold text-sm text-gray-700 mb-4 uppercase tracking-widest">Instructor {idx + 1}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={inst.name || ''}
                        onChange={(e) => updateInstructor(idx, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="e.g. Anil Bassamboo"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Course (Red Header)</label>
                      <input
                        type="text"
                        value={inst.course || ''}
                        onChange={(e) => updateInstructor(idx, 'course', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="e.g. REAL ESTATE OPERATIONS"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-600 mb-1">Title & Company</label>
                    <input
                      type="text"
                      value={inst.title || ''}
                      onChange={(e) => updateInstructor(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="e.g. PROFESSOR OF DECISION SCIENCES..."
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-600 mb-1">Bio / Overview</label>
                    <textarea
                      value={inst.bio || ''}
                      onChange={(e) => updateInstructor(idx, 'bio', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[80px]"
                      placeholder="Enter a short bio or quote about the instructor..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Tags (Comma separated)</label>
                      <input
                        type="text"
                        value={inst.tags ? inst.tags.join(', ') : ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const newTags = val.split(',').map(t => t.trim()).filter(Boolean);
                          updateInstructor(idx, 'tags', newTags);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="e.g. KELLOGG, STANFORD"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">LinkedIn Profile URL</label>
                      <input
                        type="text"
                        value={inst.linkedinUrl || ''}
                        onChange={(e) => updateInstructor(idx, 'linkedinUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">Instructor Photo</label>
                      <div className="flex items-center gap-3">
                        {inst.imageUrl ? (
                          <img src={inst.imageUrl} alt="Instructor" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400"><ImageIcon size={20} /></div>
                        )}
                        <div className="flex-1 relative">
                          <input
                            type="file" accept="image/*"
                            onChange={(e) => handleInstructorFileUpload(e, idx)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <button disabled={uploadingInstructorImage === idx} className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
                            {uploadingInstructorImage === idx ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                            Upload Photo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-wine hover:bg-red-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Mentors Tab */}
      {activeTab === 'mentors' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users size={20} className="text-wine" />
                Industry Mentors
              </h3>
              <p className="text-sm text-gray-500 mt-1">Manage the Industry Mentors displayed on the landing page.</p>
            </div>
            <button
              onClick={addMentor}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg text-sm transition-colors"
            >
              <Plus size={16} /> Add Mentor
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
            {industryMentors.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>No mentors added yet. Click "Add Mentor" to start.</p>
              </div>
            ) : (
              industryMentors.map((mentor, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 relative">
                  <button
                    onClick={() => removeMentor(idx)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove Mentor"
                  >
                    <Trash2 size={18} />
                  </button>
                  <h4 className="font-bold text-sm text-gray-700 mb-4 uppercase tracking-widest">Mentor {idx + 1}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={mentor.name || ''}
                        onChange={(e) => updateMentor(idx, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="e.g. Vikram Aatrey"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Role</label>
                      <input
                        type="text"
                        value={mentor.role || ''}
                        onChange={(e) => updateMentor(idx, 'role', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="e.g. PropTiger Founder"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Company</label>
                      <input
                        type="text"
                        value={mentor.company || ''}
                        onChange={(e) => updateMentor(idx, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="e.g. IIT Bombay"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Bio Preview</label>
                      <input
                        type="text"
                        value={mentor.bio || ''}
                        onChange={(e) => updateMentor(idx, 'bio', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="e.g. Ex–Magicbricks"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-600 mb-1">Tags (Comma separated)</label>
                    <input
                      type="text"
                      value={mentor.tags ? mentor.tags.join(', ') : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const newTags = val.split(',').map(t => t.trim()).filter(Boolean);
                        updateMentor(idx, 'tags', newTags);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="e.g. Entrepreneur, IIT"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">Mentor Photo</label>
                      <div className="flex items-center gap-3">
                        {mentor.imageUrl ? (
                          <img src={mentor.imageUrl} alt="Mentor" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400"><ImageIcon size={20} /></div>
                        )}
                        <div className="flex-1 relative">
                          <input
                            type="file" accept="image/*"
                            onChange={(e) => handleMentorFileUpload(e, idx)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <button disabled={uploadingMentorImage === idx} className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
                            {uploadingMentorImage === idx ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                            Upload Photo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-wine hover:bg-red-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
