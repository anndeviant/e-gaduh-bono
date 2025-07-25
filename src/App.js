import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminManagement from "./pages/admin/AdminManagement";
import PeternakManagement from "./pages/admin/PeternakManagement";
import LaporanPeternak from "./pages/admin/LaporanPeternak";
import PeternakTransparencyPage from "./pages/peternak/TransparencyPage";
import PeternakFAQPage from "./pages/peternak/PeternakFAQPage";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/peternak/transparency"
          element={<PeternakTransparencyPage />}
        />
        <Route path="/peternak/faq" element={<PeternakFAQPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/management"
          element={
            <ProtectedRoute>
              <AdminManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/peternak"
          element={
            <ProtectedRoute>
              <PeternakManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/laporan"
          element={
            <ProtectedRoute>
              <LaporanPeternak />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
