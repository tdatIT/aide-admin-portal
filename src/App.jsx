import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import PrivateRoute from "@/components/PrivateRoute";
import { Error403 } from "@/pages/auth/Error403";

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <PrivateRoute>
          <Navigate to="/dashboard/patient-case" replace />
        </PrivateRoute>
      } />
      <Route path="/dashboard/*" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/auth/error-403" element={<Error403 />} />
      <Route path="*" element={
        <PrivateRoute>
          <Navigate to="/dashboard/patient-case" replace />
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default App;
