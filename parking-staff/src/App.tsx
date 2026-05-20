import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import StaffRoute from './components/auth/StaffRoute';
import LoginPage from './pages/LoginPage';
import StaffDashboard from './pages/StaffDashboard';
import LogisticsPage from './pages/LogisticsPage';
import SecurityPage from './pages/SecurityPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <StaffRoute>
              <StaffDashboard />
            </StaffRoute>
          }
        />
        <Route
          path="/logistics"
          element={
            <StaffRoute>
              <LogisticsPage />
            </StaffRoute>
          }
        />
        <Route
          path="/security"
          element={
            <StaffRoute>
              <SecurityPage />
            </StaffRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
