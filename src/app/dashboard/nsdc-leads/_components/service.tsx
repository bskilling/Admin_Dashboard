// services/nsdcLeadService.ts
import env from '@/lib/env';
import axios from 'axios';

const API_BASE_URL = env?.BACKEND_URL + '/api/nsdc-lead';

export const getZohoNsdcLeads = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const pushLeadsToZoho = async () => {
  const response = await axios.post(`${API_BASE_URL}/push-to-zoho`);
  return response.data;
};

export const deleteZohoNsdcLead = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};
