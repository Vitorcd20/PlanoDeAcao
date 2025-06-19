import Badge from "../ui/badge";
import Text from "../ui/text";
import { usePlans } from "../../context/plans-context"; 
export default function TaskSummary() {
  const { totalPlansCount, concludedPlansCount, isLoadingPlans } = usePlans();

  return (
    <>
      <div className="flex items-center gap-2">
        <Text variant="body-sm-bold" className="!text-gray-300">
          Planos criados
        </Text>
        <Badge variant="secondary" loading={isLoadingPlans}>
          {totalPlansCount}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Text variant="body-sm-bold" className="!text-gray-300">
          Planos Concluídos
        </Text>
        <Badge variant="primary" loading={isLoadingPlans}>
          {concludedPlansCount} de {totalPlansCount}
        </Badge>
      </div>
    </>
  );
}
