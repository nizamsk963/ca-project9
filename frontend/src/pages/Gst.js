import { useEffect, useState } from "react";
import api from "../api";

function Gst() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    clientName: "",
    gstin: "",
    period: "",
    returnType: "GSTR-3B",
    dueDate: "",
    taxAmount: "",
    status: "Pending"
  });

  const loadRecords = async () => {
    const response = await api.get("/gst");
    setRecords(response.data);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const updateForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const saveRecord = async () => {
    await api.post("/gst", {
      ...form,
      taxAmount: Number(form.taxAmount)
    });
    setForm({ clientName: "", gstin: "", period: "", returnType: "GSTR-3B", dueDate: "", taxAmount: "", status: "Pending" });
    loadRecords();
  };

  const markFiled = async (record) => {
    await api.put(`/gst/${record._id}`, { status: "Filed" });
    loadRecords();
  };

  return (
    <div className="page">
      <h1>GST Returns</h1>
      <section className="form-box">
        <h2>Add GST Record</h2>
        <input name="clientName" placeholder="Client Name" value={form.clientName} onChange={updateForm} />
        <input name="gstin" placeholder="GSTIN" value={form.gstin} onChange={updateForm} />
        <input name="period" placeholder="Period, example Apr 2026" value={form.period} onChange={updateForm} />
        <select name="returnType" value={form.returnType} onChange={updateForm}>
          <option>GSTR-1</option>
          <option>GSTR-3B</option>
          <option>GSTR-9</option>
        </select>
        <input name="dueDate" type="date" value={form.dueDate} onChange={updateForm} />
        <input name="taxAmount" type="number" placeholder="Tax Amount" value={form.taxAmount} onChange={updateForm} />
        <select name="status" value={form.status} onChange={updateForm}>
          <option>Pending</option>
          <option>Filed</option>
        </select>
        <button onClick={saveRecord}>Save GST Record</button>
      </section>

      <section className="panel">
        <h2>GST Register</h2>
        <div className="table">
          <div className="table-head gst-table">
            <span>Client</span>
            <span>Period</span>
            <span>Return</span>
            <span>Due Date</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {records.map((record) => (
            <div className="table-row gst-table" key={record._id}>
              <span>{record.clientName}</span>
              <span>{record.period}</span>
              <span>{record.returnType}</span>
              <span>{record.dueDate || "-"}</span>
              <span>{record.status}</span>
              <button onClick={() => markFiled(record)}>Mark Filed</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Gst;
