import axios from 'axios';

export const fetchProposals = async (token) => {
  const res = await axios.get('/api/proposals', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const submitProposal = async (token, proposal) => {
  try {
    const res = await axios.post('/api/proposals', proposal, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    if (err.response?.status === 402) {
      alert('Budgetlimit erreicht! Proposal nicht gesendet.');
    } else {
      alert('Fehler beim Senden des Proposals.');
    }
    throw err;
  }
};
