import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { MultiStepForm } from "./components/form/MultiStepForm";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { SSNCompletion } from "./components/ssn/SSNCompletion";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public form route */}
          <Route path="/" element={<MultiStepForm />} />

          {/* SSN completion - public link sent by admin */}
          <Route path="/complete-ssn/:token" element={<SSNCompletion />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
