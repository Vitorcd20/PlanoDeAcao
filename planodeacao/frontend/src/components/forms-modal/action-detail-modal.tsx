import React, { useEffect, useState } from "react";
import { deleteAction, updateActionStatus } from "../../api/ActionService";
import { safeDateFormat } from "../../helpers/utils";
import Button from "../ui/button";
import StatusSelect from "../ui/status-select";
import { Calendar, Target, Trash, X } from "lucide-react";

interface Action {
  id: number;
  acao: string;
  status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO";
  prazo: string;
}

interface ActionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  actions: Action[];
  planTitle?: string;
  onActionUpdate?: (updatedAction: Action) => void;
  onActionDelete?: (deletedActionId: number) => void;
}

const normalizeStatus = (status: string): Action["status"] => {
  if (status === "CONCLUIDA") return "CONCLUIDO";
  return status as Action["status"];
};

const ActionDetailsModal: React.FC<ActionDetailsModalProps> = ({
  isOpen,
  onClose,
  actions,
  planTitle,
  onActionUpdate,
  onActionDelete,
}) => {
  const [loadingStatus, setLoadingStatus] = useState<{
    [key: number]: boolean;
  }>({});
  const [deletingAction, setDeletingAction] = useState<{
    [key: number]: boolean;
  }>({});
  const [localActions, setLocalActions] = useState<Action[]>(
    actions.map((a) => ({ ...a, status: normalizeStatus(a.status) }))
  );

  useEffect(() => {
    if (isOpen) {
      setLocalActions(
        actions.map((a) => ({ ...a, status: normalizeStatus(a.status) }))
      );
    }
  }, [actions, isOpen]);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    try {
      const cleanDateString = safeDateFormat(dateString);
      const [year, month, day] = cleanDateString.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("pt-BR");
    } catch {
      return dateString;
    }
  };

  const handleStatusChange = async (
    actionId: number,
    newStatus: Action["status"]
  ) => {
    try {
      setLoadingStatus((prev) => ({ ...prev, [actionId]: true }));

      const apiStatus = newStatus === "CONCLUIDO" ? "CONCLUIDA" : newStatus;
      const updatedAction = await updateActionStatus(actionId, apiStatus);

      const normalizedUpdatedAction = {
        ...updatedAction,
        status: normalizeStatus(updatedAction.status),
      };

      setLocalActions((prev) =>
        prev.map((action) =>
          action.id === normalizedUpdatedAction.id
            ? normalizedUpdatedAction
            : action
        )
      );

      if (onActionUpdate) {
        onActionUpdate(normalizedUpdatedAction);
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setLoadingStatus((prev) => ({ ...prev, [actionId]: false }));
    }
  };

  const handleDeleteAction = async (actionId: number) => {
    try {
      setDeletingAction((prev) => ({ ...prev, [actionId]: true }));

      await deleteAction(actionId);

      setLocalActions((prev) => prev.filter((a) => a.id !== actionId));

      if (onActionDelete) {
        onActionDelete(actionId);
      }

      onClose();
    } catch (error) {
      console.error("Erro ao deletar ação:", error);
    } finally {
      setDeletingAction((prev) => ({ ...prev, [actionId]: false }));
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Ações do Plano
            </h2>
            {planTitle && (
              <p className="text-sm text-gray-600 mt-1">{planTitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer'"
          >
           <X />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {localActions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 00-2-2h2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma ação encontrada
              </h3>
              <p className="text-gray-500">
                Este plano ainda não possui ações cadastradas.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {localActions.map((action, index) => (
                <div
                  key={action.id || index}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3 gap-1">
                    <div className="flex items-center gap-1">
                      <span title="Ação">
                        <Target className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      </span>

                      <h3 className="font-medium text-gray-900">
                        {action.acao}
                      </h3>
                    </div>

                    <StatusSelect
                      value={action.status}
                      onChange={(value) =>
                        handleStatusChange(action.id, value as Action["status"])
                      }
                      disabled={
                        loadingStatus[action.id] || deletingAction[action.id]
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <span title="Prazo"><Calendar className="w-4 h-4 mr-2 text-gray-500" /></span>
                      <span>{formatDate(action.prazo)}</span>
                    </div>

                    <button
                      onClick={() => handleDeleteAction(action.id)}
                      disabled={deletingAction[action.id]}
                      className={`transition-colors ${
                        deletingAction[action.id]
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-500 hover:text-red-700"
                      }`}
                      title="Excluir ação"
                    >
                      <Trash className="w-4 h-4 cursor-pointer" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <Button
            onClick={onClose}
            className="px-4 py-2 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActionDetailsModal;
