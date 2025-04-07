import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSettings, updateSettings } from '../api/settings.js';
import { FiSave, FiRefreshCw } from 'react-icons/fi';

const SettingsPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
    onSuccess: (data) => setFormData(data)
  });

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      alert('Gespeichert!');
      queryClient.invalidateQueries(['settings']);
    },
    onError: (e) => alert('Fehler: ' + e.message)
  });

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading || !formData) return <div className="flex justify-center py-20"><FiRefreshCw className="animate-spin h-8 w-8 text-blue-500" /></div>;
  if (error) return <div className="text-red-500">Fehler: {error.message}</div>;

  return (
    <div className="container-desktop space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Einstellungen</h1>
        <button onClick={handleSubmit} className="btn-glass flex items-center gap-2" disabled={mutation.isLoading}>
          {mutation.isLoading ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
          Speichern
        </button>
      </div>

      <div className="glass-card p-4">
        <div className="flex border-b border-slate-700 mb-4 overflow-x-auto">
          {['profile','jobPreferences','aiSettings','platformSettings','systemSettings'].map(tab => (
            <button key={tab}
              className={`px-4 py-2 whitespace-nowrap transition-all ${
                activeTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'profile' && (
            <div className="glass-card p-4 space-y-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input type="text" value={formData.profile.name} onChange={e => handleChange('profile','name',e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input type="email" value={formData.profile.email} onChange={e => handleChange('profile','email',e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm mb-1">Skill Level</label>
                <select value={formData.profile.skillLevel} onChange={e => handleChange('profile','skillLevel',e.target.value)} className="input-field">
                  <option>beginner</option><option>intermediate</option><option>expert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Hourly Rate</label>
                <input type="number" value={formData.profile.hourlyRate} onChange={e => handleChange('profile','hourlyRate',parseFloat(e.target.value))} className="input-field" />
              </div>
            </div>
          )}

          {activeTab === 'jobPreferences' && (
            <div className="glass-card p-4 space-y-4">
              <div>
                <label className="block text-sm mb-1">Min Budget</label>
                <input type="number" value={formData.jobPreferences.minBudget} onChange={e => handleChange('jobPreferences','minBudget',parseFloat(e.target.value))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm mb-1">Max Budget</label>
                <input type="number" value={formData.jobPreferences.maxBudget} onChange={e => handleChange('jobPreferences','maxBudget',parseFloat(e.target.value))} className="input-field" />
              </div>
            </div>
          )}

          {activeTab === 'aiSettings' && (
            <div className="glass-card p-4 space-y-4">
              <div>
                <label className="block text-sm mb-1">Proposal Style</label>
                <select value={formData.aiSettings.proposalStyle} onChange={e => handleChange('aiSettings','proposalStyle',e.target.value)} className="input-field">
                  <option>professional</option><option>conversational</option><option>technical</option><option>persuasive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Max Token Budget</label>
                <input type="number" value={formData.aiSettings.maxTokenBudget} onChange={e => handleChange('aiSettings','maxTokenBudget',parseInt(e.target.value))} className="input-field" />
              </div>
            </div>
          )}

          {activeTab === 'platformSettings' && (
            <div className="glass-card p-4 space-y-4">
              <div>
                <label className="block text-sm mb-1">Proposals per Day</label>
                <input type="number" value={formData.platformSettings.proposalsPerDay} onChange={e => handleChange('platformSettings','proposalsPerDay',parseInt(e.target.value))} className="input-field" />
              </div>
            </div>
          )}

          {activeTab === 'systemSettings' && (
            <div className="glass-card p-4 space-y-4">
              <div>
                <label className="block text-sm mb-1">Run Interval (min)</label>
                <input type="number" value={formData.systemSettings.runInterval} onChange={e => handleChange('systemSettings','runInterval',parseInt(e.target.value))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm mb-1">Notification Email</label>
                <input type="email" value={formData.systemSettings.notificationEmail} onChange={e => handleChange('systemSettings','notificationEmail',e.target.value)} className="input-field" />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
