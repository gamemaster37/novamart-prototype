import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Campaigns } from "./pages/Campaigns";
import { CustomerProfile } from "./pages/CustomerProfile";
import { Customers } from "./pages/Customers";
import { Dashboard } from "./pages/Dashboard";
import { Privacy } from "./pages/Privacy";
import { Segments } from "./pages/Segments";
import { SupportCases } from "./pages/SupportCases";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerProfile />} />
        <Route path="/segments" element={<Segments />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/support-cases" element={<SupportCases />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
