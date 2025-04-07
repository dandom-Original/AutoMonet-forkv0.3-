import axios from 'axios';

export const fetchJobs = async (token) => {
  const res = await axios.get('/api/jobs', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
