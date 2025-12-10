import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";

// Public pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// Donor pages
import DonorDashboard from "./pages/donor/Dashboard";
import DonateMedicine from "./pages/donor/Donate";
import MyDonations from "./pages/donor/Donations";
import DonorPickups from "./pages/donor/Pickups";
import DonorSettings from "./pages/donor/Settings";
import SearchMedicines from "./pages/SearchMedicines";

// Pharmacist pages
import PharmacistDashboard from "./pages/pharmacist/Dashboard";
import VerificationQueue from "./pages/pharmacist/Queue";
import VerifyMedicine from "./pages/pharmacist/Verify";

// Recipient pages
import RecipientDashboard from "./pages/recipient/Dashboard";
import AvailableMedicines from "./pages/recipient/Available";
import MyClaims from "./pages/recipient/Claims";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminRecipients from "./pages/admin/Recipients";
import AdminMedicines from "./pages/admin/Medicines";

// Profile
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            
            {/* Donor Routes */}
            <Route path="/donor" element={<DonorDashboard />} />
            <Route path="/donor/donate" element={<DonateMedicine />} />
            <Route path="/donor/donations" element={<MyDonations />} />
            <Route path="/donor/pickups" element={<DonorPickups />} />
            <Route path="/donor/settings" element={<DonorSettings />} />
            <Route path="/donor/search" element={<SearchMedicines />} />
            
            {/* Pharmacist Routes */}
            <Route path="/pharmacist" element={<PharmacistDashboard />} />
            <Route path="/pharmacist/queue" element={<VerificationQueue />} />
            <Route path="/pharmacist/verify/:id" element={<VerifyMedicine />} />
            
            {/* Recipient Routes */}
            <Route path="/recipient" element={<RecipientDashboard />} />
            <Route path="/recipient/available" element={<AvailableMedicines />} />
            <Route path="/recipient/claims" element={<MyClaims />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/recipients" element={<AdminRecipients />} />
            <Route path="/admin/medicines" element={<AdminMedicines />} />
            
            {/* Profile */}
            <Route path="/profile" element={<Profile />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;