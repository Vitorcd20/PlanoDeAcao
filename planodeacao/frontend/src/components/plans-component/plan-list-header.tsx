/* eslint-disable @typescript-eslint/no-explicit-any */

import StatusSelect from "../../components/ui/status-select";
import Button from "../ui/button";
import PlusIcon from "../../assets/icons/plus.svg?react";
import { type Plan } from "../../api/PlansService";

interface PlanListHeaderProps {
  statusFilter: Plan["status"] | "TODOS";
  setStatusFilter: (status: Plan["status"] | "TODOS") => void;
  setPlanModal: (modal: { isOpen: boolean; editing: any | null }) => void;
  isSelectDisabled?: boolean;
}

export default function PlanListHeader({
  statusFilter,
  setStatusFilter,
  setPlanModal,
  isSelectDisabled = false,
}: PlanListHeaderProps) {
  return (
    <section className="mb-4 flex justify-between items-end">
      <div className="flex flex-col items-start gap-2">
        <label className="text-sm font-medium text-gray-700">
          Filtrar por status:
        </label>
        <StatusSelect
          disabled={isSelectDisabled}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          className={`
            px-3 py-2 border rounded-lg bg-white
            ${isSelectDisabled ? "cursor-not-allowed" : ""}
            `}
        />
      </div>

      <Button
        className="flex items-center gap-2"
        icon={PlusIcon}
        onClick={() => setPlanModal({ isOpen: true, editing: null })}
      >
        Novo Plano
      </Button>
    </section>
  );
}
