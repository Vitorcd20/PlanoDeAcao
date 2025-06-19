/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1.0/api/planos";

export interface Plan {
  id?: number;
  titulo: string;
  objetivo: string;
  data: string;
  status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO";
  acoes?: any[];
}

export interface CreatePlanData {
  titulo: string;
  objetivo: string;
  data: string;
  status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO";
}

function handleError(error: any): never {
  console.error("Request error:", error);
  throw error;
}

export const createPlan = async (plan: CreatePlanData): Promise<Plan> => {
  try {
    const res = await axios.post<Plan>(API_BASE, plan);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const listPlans = async (): Promise<Plan[]> => {
  try {
    const res = await axios.get<Plan[]>(API_BASE);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getPlanById = async (id: number): Promise<Plan> => {
  try {
    const res = await axios.get<Plan>(`${API_BASE}/${id}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const updatePlan = async (
  id: number,
  plan: Partial<CreatePlanData>
): Promise<Plan> => {
  try {
    const res = await axios.put<Plan>(`${API_BASE}/${id}`, plan);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const updatePlanStatus = async (
  id: number,
  status: string
): Promise<Plan> => {
  try {
    const res = await axios.patch<Plan>(`${API_BASE}/${id}/status`, { status });
    return res.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const deletePlan = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE}/${id}`);
  } catch (error) {
    handleError(error);
  }
};

export const listPlansByStatus = async (status: string): Promise<Plan[]> => {
  try {
    const res = await axios.get<Plan[]>(`${API_BASE}/status/${status}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
