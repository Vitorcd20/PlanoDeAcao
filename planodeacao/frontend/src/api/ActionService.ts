import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/v1.0/api/acoes';
const PLANS_BASE = 'http://localhost:8080/api/v1.0/api/planos';

export interface Acao {
  id: number;
  acao: string;
  prazo: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA'; 
}

export interface AcaoPayload {
  acao: string;
  prazo: string;
  status?: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA'; 
}

function handleError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    console.error('Request error:', error.response?.data || error.message);
  } else {
    console.error('Unexpected error:', error);
  }
  throw error;
}

export const listActionsByPlan = async (planId: number): Promise<Acao[]> => {
  try {
    const res = await axios.get<Acao[]>(`${PLANS_BASE}/${planId}/acoes`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getActionById = async (id: number): Promise<Acao> => {
  try {
    const res = await axios.get<Acao>(`${API_BASE}/${id}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const createAction = async (planId: number, action: AcaoPayload): Promise<Acao> => {
  try {
    const res = await axios.post<Acao>(`${PLANS_BASE}/${planId}/acoes`, action);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateAction = async (id: number, action: AcaoPayload): Promise<Acao> => {
  try {
    const res = await axios.put<Acao>(`${API_BASE}/${id}`, action);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateActionStatus = async (
  id: number,
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' 
): Promise<Acao> => {
  try {
    const res = await axios.patch<Acao>(`${API_BASE}/${id}/status`, { status });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteAction = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE}/${id}`);
  } catch (error) {
    handleError(error);
  }
};

export const listActionsByStatus = async (
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' 
): Promise<Acao[]> => {
  try {
    const res = await axios.get<Acao[]>(`${API_BASE}/status/${status}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};