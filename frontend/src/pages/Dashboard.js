import { useEffect, useState } from "react";
import api from "../api";
import DashboardCards from "../components/DashboardCards";

function Dashboard() {
  const [stats, setStats] = useState({
    clients: 0,
    invoices: 0,
    gstPending: 0,
    unpaidInvoices: 0,
    revenue: 0,
    taxCollected: 0
  });

  useEffect(() => {
    api.get("/dashboard")
      .then((response) => setStats(response.data))
      .catch(() => {});
  }, []);

  return (

    <div className="page">

      <h1>Dashboard</h1>

      <DashboardCards stats={stats} />

      <section className="summary-grid">
        <div>
          <h3>Unpaid Invoices</h3>
          <p>{stats.unpaidInvoices}</p>
        </div>
        <div>
          <h3>Tax Collected</h3>
          <p>Rs {stats.taxCollected}</p>
        </div>
      </section>

    </div>

  );

}

export default Dashboard;
