import { BrowserRouter, Route, Routes } from "react-router";
import LayoutMain from "./pages/layout-main";
import PageHome from "./pages/page-home";
import { PlansProvider } from "./context/plans-context";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <PlansProvider>
      <BrowserRouter>
      <Toaster />
        <Routes>
          <Route element={<LayoutMain />}>
            <Route index element={<PageHome />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PlansProvider>
  );
}

export default App;
