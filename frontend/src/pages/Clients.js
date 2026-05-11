import { useEffect, useState } from "react";
import api from "../api";
import AddClient from "../components/AddClient";

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClients = async () => {
    try {
      const response = await api.get("/clients");
      setClients(response.data);
      setError("");
    } catch (err) {
      setError("Unable to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const deleteClient = async (id) => {
    await api.delete(`/clients/${id}`);
    loadClients();
  };

  return (
    <div className="page">
      <h1>Clients</h1>
      <AddClient onSaved={loadClients} />

      <section className="panel">
        <h2>Client List</h2>
        {loading && <p>Loading clients...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && (
          <div className="table">
            <div className="table-head client-table">
              <span>Name</span>
              <span>Business</span>
              <span>GST</span>
              <span>Phone</span>
              <span>Action</span>
            </div>
            {clients.map((client) => (
              <div className="table-row client-table" key={client._id}>
                <span>{client.name}</span>
                <span>{client.businessName || "-"}</span>
                <span>{client.gst || "-"}</span>
                <span>{client.phone || "-"}</span>
                <button className="danger" onClick={() => deleteClient(client._id)}>Delete</button>
              </div>
            ))}
            {clients.length === 0 && <p>No clients found.</p>}
          </div>
        )}
      </section>
    </div>
  );
}

export default Clients;
