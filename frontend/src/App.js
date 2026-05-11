import "./App.css";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Invoices from "./pages/Invoices";
import Gst from "./pages/Gst";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";

function ProtectedApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/gst" element={<Gst />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {

  return (
    <HashRouter>
      <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/*" element={<ProtectedApp />} />
          </Routes>
      </AuthProvider>
    </HashRouter>
  );

}

export default App;
