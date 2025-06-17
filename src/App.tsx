
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { PlanProvider } from "@/context/PlanContext";
import { UserProfileProvider } from "@/context/UserProfileContext";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import SectionPage from "./pages/SectionPage";
import Summary from "./pages/Summary";
import BMRCalculator from "./pages/BMRCalculator";
import NotFound from "./pages/NotFound";
import VoucherPage from "./pages/VoucherPage";
import PlanGeneratorPage from "./pages/PlanGeneratorPage";
import AdminPage from "./pages/AdminPage";
import DietWizardPage from "./pages/DietWizardPage";
import DietCateringPage from "./pages/DietCateringPage";
import DietPlanPage from "./pages/DietPlanPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserProfileProvider>
        <PlanProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/:sectionId" element={<SectionPage />} />
              <Route path="/kalkulator-bmr" element={<BMRCalculator />} />
              <Route path="/generator-planu" element={<PlanGeneratorPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/podsumowanie" element={<Summary />} />
              <Route path="/voucher/:sectionId" element={<VoucherPage />} />
              <Route path="/dieta/wizard" element={<DietWizardPage />} />
              <Route path="/dieta/catering" element={<DietCateringPage />} />
              <Route path="/dieta/plan" element={<DietPlanPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PlanProvider>
      </UserProfileProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
