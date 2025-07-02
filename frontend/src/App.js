import './i18n';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import MenuChart from "./pages/MenuChart";
import DataRecord from "./pages/DataRecord";
import Setting from "./pages/Setting";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/menu-chart" element={<MenuChart />} />
          <Route path="/data-record" element={<DataRecord />} />
          <Route path="/setting" element={<Setting />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
