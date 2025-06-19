/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Calendar, Target, Clock, Eye } from "lucide-react";
import Button from "../ui/button";
import StatusSelect from "../ui/status-select";

interface Plan {
  id?: number;
  titulo: string;
  objetivo: string;
  data: string;
  status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO";
  acoes?: any[];
}

interface PlanCardProps {
  plan: Plan;
  onEdit?: (plan: Plan) => void;
  onDelete?: (id: number) => void;
  onAddAction?: (plan: Plan) => void;
  onViewActions?: (plan: Plan) => void;
  onChangeStatus?: (
    id: number,
    newStatus: Plan["status"]
  ) => void | Promise<void>;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onEdit,
  onDelete,
  onAddAction,
  onViewActions,
  onChangeStatus,
}) => {
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "EM_ANDAMENTO":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CONCLUIDO":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleViewActions = () => {
    if (onViewActions) {
      onViewActions(plan);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow min-h-[300px] flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-4 break-words">
          {plan.titulo}
        </h3>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              plan.status
            )}`}
          >
            {plan.status.replace("_", " ")}
          </span>

          {onChangeStatus && (
            <StatusSelect
              value={plan.status!}
              onChange={(value) => onChangeStatus(plan.id!, value as Plan["status"])}
              disabled={false}
            />
          )}
        </div>
      </div>

      <div className="flex items-start gap-3 mb-4">
        <span title="objetivo"><Target className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" /></span>
        <p className="text-gray-700 text-sm leading-relaxed break-words">
          {plan.objetivo}
        </p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span title="Data"><Calendar className="w-5 h-5 text-gray-500" /></span>
        <span className="text-sm text-gray-600">{formatDate(plan.data)}</span>
      </div>

      {plan.acoes && plan.acoes.length > 0 ? (
        <div
          className="flex items-center justify-between gap-3 mb-4 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={handleViewActions}
        >
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">
              {plan.acoes.length} {plan.acoes.length === 1 ? "meta" : "metas"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Eye className="w-4 h-4" />
            <span>Ver detalhes</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <Clock className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500">Nenhuma meta cadastrada</span>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
        {onEdit && (
          <Button
            onClick={() => onEdit(plan)}
            variant='save'
            style={{height: '50px'}}
            className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            Editar
          </Button>
        )}

        {onDelete && plan.id && (
          <Button
            onClick={() => onDelete(plan.id!)}
            variant='danger'
            style={{height: '50px'}}
            className="flex-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            Excluir
          </Button>
        )}

        {onAddAction && (
          <Button
            onClick={() => onAddAction(plan)}
            variant='success'
            style={{height: '50px'}}
            className="flex-1 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            Adicionar Ação
          </Button>
        )}
      </div>
    </div>
  );
};

export default PlanCard;
