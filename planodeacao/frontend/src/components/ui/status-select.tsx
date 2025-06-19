import React from "react";
import { Select } from "antd";

const { Option } = Select;

interface StatusSelectProps {
  value: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO" | "TODOS";
  onChange: (
    value: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO" | "TODOS"
  ) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const StatusSelect: React.FC<StatusSelectProps> = ({
  value,
  onChange,
  disabled,
}) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{ width: "140px" }}
      className={
        value === "PENDENTE"
          ? "bg-yellow-100 text-yellow-800 border-yellow-300"
          : value === "EM_ANDAMENTO"
          ? "bg-blue-100 text-blue-800 border-blue-300"
          : "bg-green-100 text-green-800 border-green-300"
      }
    >
      <Option value="TODOS">Todos</Option>
      <Option value="PENDENTE">Pendente</Option>
      <Option value="EM_ANDAMENTO">Em Andamento</Option>
      <Option value="CONCLUIDO">Concluída</Option>
    </Select>
  );
};

export default StatusSelect;
