import { useState } from "react";
import { createAction, type AcaoPayload } from "../../api/ActionService";
import {
  createPlan,
  deletePlan,
  updatePlan,
  updatePlanStatus,
  type Plan,
} from "../../api/PlansService";
import ActionDetailsModal from "../forms-modal/action-detail-modal";
import ActionModal from "../forms-modal/action-modal";
import Modal from "../forms-modal/modal-new-plan";
import PlanCard from "./plan-card";
import { safeDateFormat } from "../../helpers/utils";
import { usePlans } from "../../context/plans-context";
import EmptyState from "../ui/empty-state";
import LoadingSpinner from "../ui/LoadingSpinner";
import PlanListHeader from "./plan-list-header";

interface FormData {
  titulo: string;
  objetivo: string;
  data: string;
}

const STATUS_LABELS = {
  PENDENTE: "Pendente",
  EM_ANDAMENTO: "Em Andamento",
  CONCLUIDO: "Concluído",
  TODOS: "Todos",
};

const getStatusLabel = (status: Plan["status"] | "TODOS") =>
  STATUS_LABELS[status];

export default function PlanListView() {
  const [planModal, setPlanModal] = useState<{
    isOpen: boolean;
    editing: Plan | null;
  }>({ isOpen: false, editing: null });

  const [statusFilter, setStatusFilter] = useState<Plan["status"] | "TODOS">(
    "PENDENTE"
  );
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [planSelectedForAction, setPlanSelectedForAction] =
    useState<Plan | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isActionDetailsModalOpen, setIsActionDetailsModalOpen] =
    useState(false);
  const [selectedPlanForDetails, setSelectedPlanForDetails] =
    useState<Plan | null>(null);

  const {
    allPlans,
    getPlansByStatus,
    isLoadingPlans,
    updatePlan: updatePlanInState,
    addPlan,
    removePlan,
  } = usePlans();

  const filteredPlans =
    statusFilter === "TODOS" ? allPlans : getPlansByStatus(statusFilter);

    const hasNoPlans = allPlans.length === 0;

  const handleSubmit = async (data: FormData) => {
    const { editing } = planModal;
    try {
      setPlanModal((prev) => ({ ...prev, isOpen: true }));
      const formattedDate = safeDateFormat(data.data);
      const payload = {
        ...data,
        data: formattedDate,
        status: editing?.status || "PENDENTE",
      };

      const plan = editing
        ? await updatePlan(editing.id!, payload)
        : await createPlan(payload);

      if (editing) {
        updatePlanInState(plan);
      } else {
        addPlan(plan);
      }

      setPlanModal({ isOpen: false, editing: null });
    } catch (error) {
      console.error("Erro ao salvar plano:", error);
    }
  };

  const handleSubmitAction = async (actionData: AcaoPayload) => {
    if (!planSelectedForAction) return;

    try {
      setIsActionLoading(true);
      const newAction = await createAction(
        planSelectedForAction.id!,
        actionData
      );
      const updatedPlan = {
        ...planSelectedForAction,
        acoes: [...(planSelectedForAction.acoes || []), newAction],
      };
      updatePlanInState(updatedPlan);
      setIsActionModalOpen(false);
      setPlanSelectedForAction(null);
    } catch (error) {
      console.error("Erro ao salvar ação:", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeletePlan = async (id: number) => {
    try {
      await deletePlan(id);
      removePlan(id);
    } catch (error) {
      console.error("Erro ao excluir plano:", error);
    }
  };

  const handleChangeStatus = async (id: number, newStatus: Plan["status"]) => {
    try {
      const updated = await updatePlanStatus(id, newStatus);
      updatePlanInState(updated);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleActionDelete = (deletedActionId: number) => {
    if (!selectedPlanForDetails) return;

    const updatedActions =
      selectedPlanForDetails.acoes?.filter(
        (acao) => acao.id !== deletedActionId
      ) || [];

    const updatedPlan = {
      ...selectedPlanForDetails,
      acoes: updatedActions,
    };

    updatePlanInState(updatedPlan);

    setSelectedPlanForDetails(updatedPlan);
  };

  return (
    <>
      <PlanListHeader
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setPlanModal={setPlanModal}
         isSelectDisabled={hasNoPlans}
      />

      <section className="space-y-6">
        {isLoadingPlans ? (
          <LoadingSpinner />
        ) : (
          <div className="grid gap-6 sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onEdit={() => setPlanModal({ isOpen: true, editing: plan })}
                onDelete={() => handleDeletePlan(plan.id!)}
                onAddAction={() => {
                  setPlanSelectedForAction(plan);
                  setIsActionModalOpen(true);
                }}
                onViewActions={() => {
                  setSelectedPlanForDetails(plan);
                  setIsActionDetailsModalOpen(true);
                }}
                onChangeStatus={handleChangeStatus}
              />
            ))}
          </div>
        )}

        {!isLoadingPlans && filteredPlans.length === 0 && (
          <EmptyState
            statusLabel={getStatusLabel(statusFilter)}
            onCreate={() => setPlanModal({ isOpen: true, editing: null })}
          />
        )}
      </section>

      <Modal
        isOpen={planModal.isOpen}
        onClose={() => setPlanModal({ isOpen: false, editing: null })}
        onSubmit={handleSubmit}
        title={planModal.editing ? "Editar Plano" : "Criar Novo Plano"}
        isLoading={false}
        initialData={
          planModal.editing
            ? {
                titulo: planModal.editing.titulo,
                objetivo: planModal.editing.objetivo,
                data: safeDateFormat(planModal.editing.data),
              }
            : undefined
        }
      />

      <ActionModal
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
          setPlanSelectedForAction(null);
        }}
        onSubmit={handleSubmitAction}
        isLoading={isActionLoading}
      />

      <ActionDetailsModal
        isOpen={isActionDetailsModalOpen}
        onClose={() => {
          setIsActionDetailsModalOpen(false);
          setSelectedPlanForDetails(null);
        }}
        actions={selectedPlanForDetails?.acoes || []}
        planTitle={selectedPlanForDetails?.titulo}
        onActionUpdate={(updatedAction) => {
          if (!selectedPlanForDetails) return;
          const updatedActions =
            selectedPlanForDetails.acoes?.map((acao) =>
              acao.id === updatedAction.id ? updatedAction : acao
            ) || [];
          const updatedPlan = {
            ...selectedPlanForDetails,
            acoes: updatedActions,
          };
          updatePlanInState(updatedPlan);
          setSelectedPlanForDetails(updatedPlan);
        }}
        onActionDelete={handleActionDelete}
      />
    </>
  );
}
