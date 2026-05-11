import { NavLink } from "react-router-dom";

function Sidebar() {

  return (

    <div className="sidebar">

      <h2>CA Office</h2>

      <ul>

        <li><NavLink to="/">Dashboard</NavLink></li>
        <li><NavLink to="/clients">Clients</NavLink></li>
        <li><NavLink to="/gst">GST</NavLink></li>
        <li><NavLink to="/invoices">Invoices</NavLink></li>

      </ul>

    </div>
  );
}

export default Sidebar;
