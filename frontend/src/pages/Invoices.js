import { useEffect, useState } from "react";
import api from "../api";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState({
    clientName: "",
    invoiceNo: "",
    date: "",
    amount: "",
    tax: "",
    status: "Unpaid"
  });

  const loadInvoices = async () => {
    const response = await api.get("/invoices");
    setInvoices(response.data);
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const updateForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const saveInvoice = async () => {
    await api.post("/invoices", {
      ...form,
      amount: Number(form.amount),
      tax: Number(form.tax)
    });
    setForm({ clientName: "", invoiceNo: "", date: "", amount: "", tax: "", status: "Unpaid" });
    loadInvoices();
  };

  const markPaid = async (invoice) => {
    await api.put(`/invoices/${invoice._id}`, { status: "Paid" });
    loadInvoices();
  };

  return (
    <div className="page">
      <h1>Invoices</h1>
      <section className="form-box">
        <h2>Create Invoice</h2>
        <input name="clientName" placeholder="Client Name" value={form.clientName} onChange={updateForm} />
        <input name="invoiceNo" placeholder="Invoice No" value={form.invoiceNo} onChange={updateForm} />
        <input name="date" type="date" value={form.date} onChange={updateForm} />
        <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={updateForm} />
        <input name="tax" type="number" placeholder="Tax" value={form.tax} onChange={updateForm} />
        <select name="status" value={form.status} onChange={updateForm}>
          <option>Unpaid</option>
          <option>Paid</option>
        </select>
        <button onClick={saveInvoice}>Save Invoice</button>
      </section>

      <section className="panel">
        <h2>Invoice Register</h2>
        <div className="table">
          <div className="table-head invoice-table">
            <span>Invoice</span>
            <span>Client</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {invoices.map((invoice) => (
            <div className="table-row invoice-table" key={invoice._id}>
              <span>{invoice.invoiceNo}</span>
              <span>{invoice.clientName}</span>
              <span>{invoice.date}</span>
              <span>Rs {invoice.amount}</span>
              <span>{invoice.status}</span>
              <button onClick={() => markPaid(invoice)}>Mark Paid</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Invoices;
