import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Save, Check, User, Trash2, Plus, Upload, X, ExternalLink, Globe, Mail } from 'lucide-react';

interface AuthorProfile {
  _id?: string;
  name: string;
  designation: string;
  bio: string;
  avatar: string;
  email: string;
  linkedin: string;
  twitter: string;
  website: string;
}

const emptyProfile: AuthorProfile = {
  name: '',
  designation: '',
  bio: '',
  avatar: '',
  email: '',
  linkedin: '',
  twitter: '',
  website: '',
};

const AuthorManagement = () => {
  const [authors, setAuthors] = useState<AuthorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<AuthorProfile>(emptyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const fetchAuthors = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/author/all`);
      const data = await res.json();
      setAuthors(data);
    } catch (err) {
      console.error('Error fetching authors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEditingAuthor(prev => ({ ...prev, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!editingAuthor.name.trim()) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/author/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAuthor),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setIsEditing(false);
        setEditingAuthor(emptyProfile);
        fetchAuthors();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving author:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (author: AuthorProfile) => {
    setEditingAuthor({ ...author });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this author profile?')) return;
    await fetch(`${import.meta.env.VITE_API_URL || ''}/api/author/${id}`, { method: 'DELETE' });
    fetchAuthors();
  };

  const handleNew = () => {
    setEditingAuthor(emptyProfile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditingAuthor(emptyProfile);
    setIsEditing(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm">Manage blog writer profiles. The active profile will display across all blog articles.</p>
        {!isEditing && (
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2 bg-wine text-white rounded-lg hover:bg-wine/90 font-semibold text-sm transition-colors cursor-pointer"
          >
            <Plus size={16} /> New Author
          </button>
        )}
      </div>

      {/* Editor Form */}
      {isEditing && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h2 className="text-lg font-bold text-gray-900">
              {editingAuthor._id ? 'Edit Author Profile' : 'New Author Profile'}
            </h2>
            <button onClick={handleCancel} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:border-wine transition-colors"
                onClick={() => avatarInputRef.current?.click()}
              >
                {editingAuthor.avatar ? (
                  <img src={editingAuthor.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Upload size={24} />
                    <span className="text-xs font-medium">Upload Photo</span>
                  </div>
                )}
              </div>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              {editingAuthor.avatar && (
                <button
                  onClick={() => setEditingAuthor(prev => ({ ...prev, avatar: '' }))}
                  className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer"
                >
                  Remove photo
                </button>
              )}
              <p className="text-xs text-gray-400 text-center">Click to upload profile photo</p>
            </div>

            {/* Details Fields */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={editingAuthor.name}
                    onChange={e => setEditingAuthor(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-wine outline-none bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Designation</label>
                  <input
                    type="text"
                    value={editingAuthor.designation}
                    onChange={e => setEditingAuthor(p => ({ ...p, designation: e.target.value }))}
                    placeholder="e.g. PropTech Analyst & Writer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-wine outline-none bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Bio</label>
                <textarea
                  value={editingAuthor.bio}
                  onChange={e => setEditingAuthor(p => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  placeholder="A short bio about the author..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-wine outline-none bg-gray-50 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
                  <input
                    type="email"
                    value={editingAuthor.email}
                    onChange={e => setEditingAuthor(p => ({ ...p, email: e.target.value }))}
                    placeholder="author@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-wine outline-none bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Website</label>
                  <input
                    type="url"
                    value={editingAuthor.website}
                    onChange={e => setEditingAuthor(p => ({ ...p, website: e.target.value }))}
                    placeholder="https://yoursite.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-wine outline-none bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">LinkedIn URL</label>
                  <input
                    type="url"
                    value={editingAuthor.linkedin}
                    onChange={e => setEditingAuthor(p => ({ ...p, linkedin: e.target.value }))}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-wine outline-none bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Twitter / X URL</label>
                  <input
                    type="url"
                    value={editingAuthor.twitter}
                    onChange={e => setEditingAuthor(p => ({ ...p, twitter: e.target.value }))}
                    placeholder="https://x.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-wine outline-none bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button onClick={handleCancel} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium cursor-pointer">Cancel</button>
            <button
              onClick={handleSave}
              disabled={isSaving || !editingAuthor.name.trim()}
              className={`flex items-center gap-2 px-5 py-2 text-sm rounded-lg font-semibold text-white transition-colors cursor-pointer ${saveSuccess ? 'bg-green-600' : 'bg-wine hover:bg-wine/90'} disabled:opacity-50`}
            >
              {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : saveSuccess ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Profile</>}
            </button>
          </div>
        </div>
      )}

      {/* Author List */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">All Author Profiles</h2>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-wine" size={32} /></div>
        ) : authors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {authors.map(author => (
              <div key={author._id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 shadow-sm">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {author.avatar ? (
                    <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} className="text-gray-400" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm">{author.name}</h3>
                  {author.designation && <p className="text-xs text-wine font-medium mt-0.5">{author.designation}</p>}
                  {author.bio && <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{author.bio}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    {author.linkedin && <a href={author.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800" title="LinkedIn"><ExternalLink size={14} /></a>}
                    {author.twitter && <a href={author.twitter} target="_blank" rel="noreferrer" className="text-sky-500 hover:text-sky-700" title="Twitter/X"><ExternalLink size={14} /></a>}
                    {author.website && <a href={author.website} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-700" title="Website"><Globe size={14} /></a>}
                    {author.email && <a href={`mailto:${author.email}`} className="text-gray-500 hover:text-gray-700" title="Email"><Mail size={14} /></a>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleEdit(author)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Save size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(author._id!)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
            <User size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium">No author profiles yet. Create one above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorManagement;
