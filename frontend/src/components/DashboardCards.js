function DashboardCards({ stats }) {

  return (

    <div className="cards">

      <div className="card">

        <h3>Total Clients</h3>

        <p>{stats.clients}</p>

      </div>

      <div className="card">

        <h3>Pending GST</h3>

        <p>{stats.gstPending}</p>

      </div>

      <div className="card">

        <h3>Invoices</h3>

        <p>{stats.invoices}</p>

      </div>

      <div className="card">

        <h3>Revenue</h3>

        <p>Rs {stats.revenue}</p>

      </div>

    </div>
  );
}

export default DashboardCards;
