import { Target } from "lucide-react";

interface EmptyStateProps {
  statusLabel: string;
  onCreate: () => void;
}

export default function EmptyState({ statusLabel }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-8 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Target className="w-8 h-8 text-gray-400" />
      </div>

      <div className="max-w-sm space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">
          Nenhum plano {statusLabel.toLowerCase()}
        </h3>

        <p className="text-gray-500">
          Você não tem planos com status "{statusLabel}" no momento.
        </p>
      </div>
    </div>
  );
}
