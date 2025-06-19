/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { listPlans, type Plan } from "../api/PlansService";

interface PlansContextType {
  allPlans: Plan[];
  totalPlansCount: number;
  concludedPlansCount: number;
  pendingPlansCount: number;
  inProgressPlansCount: number;
  isLoadingPlans: boolean;
  refreshPlans: () => void;
  addPlan: (newPlan: Plan) => void;
  updatePlan: (updatedPlan: Plan) => void;
  removePlan: (planId: number) => void;
  getPlansByStatus: (status: Plan["status"]) => Plan[];
}

const PlansContext = createContext<PlansContextType | undefined>(undefined);

export const PlansProvider = ({ children }: { children: React.ReactNode }) => {
  const [allPlans, setAllPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

  const loadAllPlans = async () => {
    setIsLoadingPlans(true);
    try {
      const allPlansData = await listPlans();
      setAllPlans(allPlansData);
    } catch (error) {
      console.error("Erro ao carregar planos:", error);
      setAllPlans([]);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  useEffect(() => {
    loadAllPlans();

    const handleFocus = () => {
      loadAllPlans();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadAllPlans();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const interval = setInterval(() => {
      if (!document.hidden) { 
        loadAllPlans();
      }
    }, 120000); 

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  const totalPlansCount = allPlans.length;
  const concludedPlansCount = allPlans.filter((p) => p.status === "CONCLUIDO").length;
  const pendingPlansCount = allPlans.filter((p) => p.status === "PENDENTE").length;
  const inProgressPlansCount = allPlans.filter((p) => p.status === "EM_ANDAMENTO").length;

  const refreshPlans = () => loadAllPlans();

  const addPlan = (newPlan: Plan) => {
    setAllPlans((prev) => [...prev, newPlan]);
  };

  const updatePlan = (updatedPlan: Plan) => {
    setAllPlans((prev) =>
      prev.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan))
    );
  };

  const removePlan = (planId: number) => {
    setAllPlans((prev) => prev.filter((plan) => plan.id !== planId));
  };

  const getPlansByStatus = (status: Plan["status"]): Plan[] => {
  return allPlans.filter((plan) => plan.status === status);
};

  return (
    <PlansContext.Provider
      value={{
        allPlans,
        totalPlansCount,
        concludedPlansCount,
        pendingPlansCount,
        inProgressPlansCount,
        isLoadingPlans,
        refreshPlans,
        addPlan,
        updatePlan,
        removePlan,
         getPlansByStatus
      }}
    >
      {children}
    </PlansContext.Provider>
  );
};

export const usePlans = () => {
  const context = useContext(PlansContext);
  if (!context) throw new Error("usePlans deve ser usado dentro de PlansProvider");
  return context;
};