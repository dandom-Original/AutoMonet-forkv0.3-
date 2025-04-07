import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchJobs } from '../api/jobs.js';
import { analyzeJob, generateProposal } from '../api/ai.js';
import { FiRefreshCw, FiFilter, FiSearch, FiArrowRight, FiCheck, FiX, FiStar, FiClock } from 'react-icons/fi';

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minMatchScore, setMinMatchScore] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState('');

  const { data: jobs, isLoading, error, refetch } = useQuery(['jobs'], fetchJobs);

  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = searchTerm === '' ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScore = job.matchScore >= minMatchScore;
    return matchesSearch && matchesScore;
  });

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setAnalysisResult(null);
    setGeneratedProposal('');
  };

  const handleAnalyzeJob = async () => {
    if (!selectedJob) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeJob(selectedJob);
      setAnalysisResult(result);
    } catch {
      setAnalysisResult({ error: 'Fehler bei der Analyse.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateProposal = async () => {
    if (!selectedJob) return;
    setIsGeneratingProposal(true);
    try {
      const userProfile = { name: 'AI Freelancer', specialties: ['React', 'JavaScript', 'Python', 'Data Science'] };
      const proposal = await generateProposal(selectedJob, userProfile);
      setGeneratedProposal(proposal);
    } catch {
      setGeneratedProposal('Fehler bei der Proposal-Generierung.');
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  return (
    <div className="container-desktop space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <button onClick={() => refetch()} className="btn-glass flex items-center gap-2" disabled={isLoading}>
          <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="glass-card p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Suche nach Titel oder Beschreibung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="w-full md:w-64">
            <div className="flex items-center gap-2 mb-1">
              <FiFilter className="text-gray-400" />
              <span className="text-sm text-gray-400">Min Match Score: {minMatchScore}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(parseInt(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <FiRefreshCw className="animate-spin h-8 w-8 text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-2">Fehler beim Laden: {error.message}</p>
            <button onClick={() => refetch()} className="btn-glass">Erneut versuchen</button>
          </div>
        ) : filteredJobs && filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className={`glass-card p-4 cursor-pointer transition-all duration-150 ${
                  selectedJob?.id === job.id ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-slate-500'
                }`}
                onClick={() => handleJobSelect(job)}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{job.title}</h3>
                    <p className="text-sm text-gray-400">Quelle: {job.source}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-blue-400 font-semibold">{job.budget || 'N/A'}</span>
                    <div className="flex items-center mt-1" title={`Match Score: ${job.matchScore}%`}>
                      <div className="w-16 bg-slate-700 rounded-full h-2 mr-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            job.matchScore > 85 ? 'bg-green-500' :
                            job.matchScore > 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${job.matchScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{job.matchScore}%</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 mt-2 line-clamp-2">{job.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">Keine Jobs gefunden.</div>
        )}
      </div>

      {selectedJob && (
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Job Details</h2>
          <h3 className="font-bold">{selectedJob.title}</h3>
          <p className="text-sm text-gray-400 mb-2">Quelle: {selectedJob.source} • Budget: {selectedJob.budget || 'N/A'}</p>
          <p className="text-gray-300 whitespace-pre-wrap">{selectedJob.description}</p>

          <div className="flex flex-wrap gap-4 mt-4">
            <button onClick={handleAnalyzeJob} disabled={isAnalyzing} className="btn-glass flex items-center gap-2">
              {isAnalyzing ? <FiRefreshCw className="animate-spin" /> : <FiStar />}
              {isAnalyzing ? 'Analysiere...' : 'Job analysieren'}
            </button>
            <button
              onClick={handleGenerateProposal}
              disabled={isGeneratingProposal || !analysisResult || analysisResult.error}
              className="btn-glass flex items-center gap-2"
            >
              {isGeneratingProposal ? <FiRefreshCw className="animate-spin" /> : <FiArrowRight />}
              {isGeneratingProposal ? 'Generiere...' : 'Proposal generieren'}
            </button>
          </div>

          {isAnalyzing && (
            <div className="flex justify-center py-6">
              <FiRefreshCw className="animate-spin h-6 w-6 text-blue-500" />
            </div>
          )}

          {analysisResult && !isAnalyzing && (
            <div className="mt-4 space-y-4">
              {analysisResult.error ? (
                <p className="text-red-500">{analysisResult.error}</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-card p-3">
                      <p className="text-sm text-gray-400">Score</p>
                      <p className="text-xl font-bold">{analysisResult.score}%</p>
                    </div>
                    <div className="glass-card p-3">
                      <p className="text-sm text-gray-400">Aufwand</p>
                      <p className="text-xl font-bold">{analysisResult.effort_estimate}</p>
                    </div>
                    <div className="glass-card p-3">
                      <p className="text-sm text-gray-400">ROI</p>
                      <p className="text-xl font-bold">{analysisResult.roi}x</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-card p-3">
                      <h4 className="font-semibold mb-2">Risiken</h4>
                      <ul className="space-y-1 text-sm text-gray-400">
                        {analysisResult.risks?.map((r, i) => <li key={i}><FiX className="inline mr-1 text-red-400" />{r}</li>)}
                      </ul>
                    </div>
                    <div className="glass-card p-3">
                      <h4 className="font-semibold mb-2">Chancen</h4>
                      <ul className="space-y-1 text-sm text-gray-400">
                        {analysisResult.opportunities?.map((o, i) => <li key={i}><FiCheck className="inline mr-1 text-green-400" />{o}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="glass-card p-3">
                    <h4 className="font-semibold mb-2">Budget-Analyse</h4>
                    <p className="text-sm text-gray-400">{analysisResult.budget_analysis}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm">Empfehlung:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      analysisResult.recommendation === 'accept' ? 'bg-green-900 text-green-300' :
                      analysisResult.recommendation === 'consider' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {analysisResult.recommendation?.toUpperCase()}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {isGeneratingProposal && (
            <div className="flex justify-center py-6">
              <FiRefreshCw className="animate-spin h-6 w-6 text-blue-500" />
            </div>
          )}

          {generatedProposal && !isGeneratingProposal && (
            <div className="glass-card p-4 mt-4">
              <h3 className="font-semibold mb-2">Generiertes Proposal</h3>
              <pre className="whitespace-pre-wrap text-gray-300 font-sans text-sm max-h-60 overflow-y-auto">{generatedProposal}</pre>
              <div className="flex justify-end mt-4 gap-2">
                <button className="btn-glass flex items-center gap-2 text-sm">
                  <FiClock />
                  Speichern
                </button>
                <button className="btn-glass flex items-center gap-2 text-sm">
                  <FiArrowRight />
                  Absenden
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobsPage;
