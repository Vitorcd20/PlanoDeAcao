import { useEffect, useState } from "react";
import { listPlans, type Plan } from "../api/PlansService";

export default function usePlans() {
  const [allPlans, setAllPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

  const loadAllPlans = async () => {
    setIsLoadingPlans(true);
    try {
      const allPlansData = await listPlans();
      setAllPlans(allPlansData);
    } catch (error) {
      console.error("Erro ao carregar todos os planos:", error);
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
  const concludedPlansCount = allPlans.filter(plan => plan.status === "CONCLUIDO").length;
  const pendingPlansCount = allPlans.filter(plan => plan.status === "PENDENTE").length;
  const inProgressPlansCount = allPlans.filter(plan => plan.status === "EM_ANDAMENTO").length;

  const refreshPlans = () => {
    loadAllPlans();
  };

  const updatePlan = (updatedPlan: Plan) => {
    setAllPlans(prev =>
      prev.map(plan =>
        plan.id === updatedPlan.id ? updatedPlan : plan
      )
    );
  };

  const addPlan = (newPlan: Plan) => {
    setAllPlans(prev => [...prev, newPlan]);
  };

  const removePlan = (planId: number) => {
    setAllPlans(prev => prev.filter(plan => plan.id !== planId));
  };

  const getPlansByStatus = (status: Plan['status']) => {
    return allPlans.filter(plan => plan.status === status);
  };

  return {
    allPlans,
    totalPlansCount,
    concludedPlansCount,
    pendingPlansCount,
    inProgressPlansCount,
    isLoadingPlans,
    refreshPlans,
    updatePlan,
    addPlan,
    removePlan,
    getPlansByStatus
  };
}