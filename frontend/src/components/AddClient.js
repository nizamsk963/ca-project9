import React, { useState } from "react";
import api from "../api";

function AddClient({ onSaved }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gst, setGst] = useState("");
  const [pan, setPan] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");

  const addClient = async () => {
    const data = { name, email, phone, gst, pan, businessName, address };

    try {
      await api.post("/add-client", data);
      alert("Client Added Successfully");

      setName("");
      setEmail("");
      setPhone("");
      setGst("");
      setPan("");
      setBusinessName("");
      setAddress("");
      if (onSaved) {
        onSaved();
      }
    } catch (err) {
      alert("Error Occurred");
    }
  };

  return (
    <div className="form-box">
      <h2>Add Client</h2>

      <input placeholder="Name" value={name}
        onChange={(e) => setName(e.target.value)} />

      <input placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} />

      <input placeholder="Phone" value={phone}
        onChange={(e) => setPhone(e.target.value)} />

      <input placeholder="GST" value={gst}
        onChange={(e) => setGst(e.target.value)} />

      <input placeholder="PAN" value={pan}
        onChange={(e) => setPan(e.target.value)} />

      <input placeholder="Business Name" value={businessName}
        onChange={(e) => setBusinessName(e.target.value)} />

      <input placeholder="Address" value={address}
        onChange={(e) => setAddress(e.target.value)} />

      <button onClick={addClient}>
        Add Client
      </button>
    </div>
  );
}

export default AddClient;
