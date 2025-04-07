import axios from 'axios';

export const fetchSettings = async (token) => {
  const res = await axios.get('/api/settings', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateSettings = async (token, settings) => {
  const res = await axios.put('/api/settings', settings, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
