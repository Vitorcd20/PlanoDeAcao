import { Outlet } from "react-router";
import Header from "../components/ui/header";
import MainContent from "../components/ui/main-content";

export default function LayoutMain() {
  return (
    <>
      <Header />

      <MainContent className="mt-4 md:mt-8">
        <Outlet />
      </MainContent>
    </>
  );
}
