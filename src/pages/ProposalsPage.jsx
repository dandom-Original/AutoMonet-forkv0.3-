import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiFilter, FiRefreshCw, FiEdit, FiTrash2, FiSend, FiCheckCircle, FiXCircle, FiMessageSquare, FiClipboard } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getProposals, updateProposalStatus, deleteProposal } from '../api/proposals';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const ProposalsPage = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    sortBy: 'created_at',
    sortDirection: 'desc',
    page: 1
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: proposalsData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['proposals', filters],
    queryFn: () => getProposals(filters),
    keepPreviousData: true
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ proposalId, status, responseDetails }) => updateProposalStatus(proposalId, status, responseDetails),
    onSuccess: () => {
      queryClient.invalidateQueries(['proposals']);
      queryClient.invalidateQueries(['jobs']);
    }
  });

  const deleteProposalMutation = useMutation({
    mutationFn: (proposalId) => deleteProposal(proposalId),
    onSuccess: () => {
      queryClient.invalidateQueries(['proposals']);
    }
  });

  const handleStatusChange = (proposalId, newStatus, responseDetails = null) => {
    updateStatusMutation.mutate({ proposalId, status: newStatus, responseDetails });
  };

  const copyProposalToClipboard = (content) => {
    navigator.clipboard.writeText(content)
      .then(() => alert('Proposal kopiert!'))
      .catch(() => alert('Fehler beim Kopieren.'));
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      type: '',
      sortBy: 'created_at',
      sortDirection: 'desc',
      page: 1
    });
    setIsFilterOpen(false);
  };

  return (
    <ErrorBoundary>
      <div className="container-desktop space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Proposals</h1>
          <div className="flex space-x-2">
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="btn-glass flex items-center gap-2">
              <FiFilter /> Filter
            </button>
            <button onClick={() => refetch()} className={`btn-glass flex items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isLoading}>
              <FiRefreshCw className={isLoading ? 'animate-spin' : ''} /> Aktualisieren
            </button>
          </div>
        </div>

        {isFilterOpen && (
          <div className="glass-card p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Status</label>
                <select value={filters.status} onChange={e => setFilters(prev => ({ ...prev, status: e.target.value, page:1 }))} className="input-field">
                  <option value="">Alle</option>
                  <option value="draft">Entwurf</option>
                  <option value="submitted">Eingereicht</option>
                  <option value="responded">Antwort erhalten</option>
                  <option value="negotiating">Verhandlung</option>
                  <option value="accepted">Angenommen</option>
                  <option value="rejected">Abgelehnt</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Typ</label>
                <select value={filters.type} onChange={e => setFilters(prev => ({ ...prev, type: e.target.value, page:1 }))} className="input-field">
                  <option value="">Alle</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="minimal">Minimal</option>
                  <option value="follow_up">Follow-Up</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Sortierung</label>
                <div className="flex space-x-2">
                  <select value={filters.sortBy} onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value }))} className="input-field flex-grow">
                    <option value="created_at">Erstellt</option>
                    <option value="updated_at">Aktualisiert</option>
                    <option value="submitted_at">Eingereicht</option>
                  </select>
                  <select value={filters.sortDirection} onChange={e => setFilters(prev => ({ ...prev, sortDirection: e.target.value }))} className="input-field w-24">
                    <option value="desc">Absteigend</option>
                    <option value="asc">Aufsteigend</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={resetFilters} className="btn-glass">Zurücksetzen</button>
            </div>
          </div>
        )}

        {isLoading ? (
          <LoadingSkeleton type="proposals" />
        ) : isError ? (
          <div className="glass-card p-6 text-center text-red-400">Fehler: {error?.message}</div>
        ) : !proposalsData?.proposals?.length ? (
          <div className="glass-card p-8 text-center">
            <p className="mb-2">Keine Proposals gefunden.</p>
            <button onClick={resetFilters} className="btn-glass">Filter zurücksetzen</button>
          </div>
        ) : (
          <div className="space-y-4">
            {proposalsData.proposals.map(proposal => (
              <div key={proposal.id} className="glass-card p-4 border-l-4 transition-all"
                style={{
                  borderLeftColor:
                    proposal.status === 'submitted' ? '#3b82f6' :
                    proposal.status === 'accepted' ? '#22c55e' :
                    proposal.status === 'rejected' ? '#ef4444' :
                    proposal.status === 'negotiating' ? '#8b5cf6' :
                    proposal.status === 'responded' ? '#f59e0b' :
                    'transparent'
                }}>
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg">{proposal.job.title}</h3>
                  <div className="text-right">
                    <span className="bg-slate-700 text-sm px-2 py-1 rounded">{proposal.job.platform}</span>
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        proposal.status === 'draft' ? 'bg-gray-700 text-gray-300' :
                        proposal.status === 'submitted' ? 'bg-blue-900/50 text-blue-300' :
                        proposal.status === 'responded' ? 'bg-amber-900/50 text-amber-300' :
                        proposal.status === 'negotiating' ? 'bg-purple-900/50 text-purple-300' :
                        proposal.status === 'accepted' ? 'bg-green-900/50 text-green-300' :
                        proposal.status === 'rejected' ? 'bg-red-900/50 text-red-300' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {proposal.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-gray-300 line-clamp-2">{proposal.content.substring(0, 200)}{proposal.content.length > 200 ? '...' : ''}</div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <span>Erstellt: {new Date(proposal.created_at).toLocaleDateString()}</span>
                    {proposal.metadata?.model_used && (
                      <span className="text-xs bg-blue-900/20 text-blue-300 px-2 py-0.5 rounded">{proposal.metadata.model_used.split('/').pop().split(':')[0]}</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => copyProposalToClipboard(proposal.content)} className="p-2 text-blue-400 hover:text-blue-300 hover:bg-slate-700/30 rounded" title="Kopieren"><FiClipboard /></button>
                    {proposal.status === 'draft' && (
                      <>
                        <Link to={`/proposals/edit/${proposal.id}`} className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-slate-700/30 rounded" title="Bearbeiten"><FiEdit /></Link>
                        <button onClick={() => handleStatusChange(proposal.id, 'submitted')} className="p-2 text-green-400 hover:text-green-300 hover:bg-slate-700/30 rounded" title="Einreichen"><FiSend /></button>
                        <button onClick={() => { if(confirm('Löschen?')) deleteProposalMutation.mutate(proposal.id); }} className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-700/30 rounded" title="Löschen"><FiTrash2 /></button>
                      </>
                    )}
                    {proposal.status === 'submitted' && (
                      <>
                        <button onClick={() => handleStatusChange(proposal.id, 'accepted')} className="p-2 text-green-400 hover:text-green-300 hover:bg-slate-700/30 rounded" title="Angenommen"><FiCheckCircle /></button>
                        <button onClick={() => handleStatusChange(proposal.id, 'rejected')} className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-700/30 rounded" title="Abgelehnt"><FiXCircle /></button>
                        <button onClick={() => {
                          const response = prompt('Kundenantwort:');
                          if(response) handleStatusChange(proposal.id, 'responded', response);
                        }} className="p-2 text-blue-400 hover:text-blue-300 hover:bg-slate-700/30 rounded" title="Antwort hinzufügen"><FiMessageSquare /></button>
                      </>
                    )}
                  </div>
                </div>

                {proposal.client_response && (
                  <div className="mt-3 p-3 bg-slate-700/30 rounded border-l-2 border-blue-500">
                    <div className="text-xs text-blue-400 mb-1">Kundenantwort:</div>
                    <div className="text-gray-300 text-sm">{proposal.client_response}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ProposalsPage;
