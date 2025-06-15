
import api from '@/lib/api';
import { Owner } from '@/lib/types';

export const addOwner = async (ownerData: Partial<Owner>) => {
  const response = await api.post('/admin/owners', ownerData);
  return response.data;
};

export const getOwners = async () => {
  const response = await api.get('/admin/owners');
  return response.data;
};

export const updateOwnerStatus = async (ownerId: string, status: string) => {
  const response = await api.put(`/admin/owners/${ownerId}/status`, { status });
  return response.data;
};

export const deleteOwner = async (ownerId: string) => {
  const response = await api.delete(`/admin/owners/${ownerId}`);
  return response.data;
};
