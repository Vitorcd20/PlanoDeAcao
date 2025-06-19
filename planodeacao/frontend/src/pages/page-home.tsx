import Container from "../components/ui/container";
import TaskList from "../components/plans-component/plan-list-view";
import TaskSummary from "../components/plans-component/plans-summary";

export default function PageHome() {
  return (
    <Container as="article" className="space-y-3">
      <header className="flex items-center justify-between">
        <TaskSummary />
      </header>

        <TaskList />
    </Container>
  );
}
