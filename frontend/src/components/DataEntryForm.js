import React, { useState } from 'react';

const branches = [
  "BABY NAGAR VELACHERY",
  "BYE PASS VELACHERY",
  "INDIRA NAGAR ADYAR",
  "NANDAMBAKKAM",
  "PBB BESANT NAGAR",
  "SHASTHRI NAGAR",
  // Add all 36 branches
];

const DataEntryForm = () => {
  const [form, setForm] = useState({
    branch_name: "",
    kyc_updation: "",
    deduplication: "",
    edd: "",
    ria: "",
    deaf_accounts: "",
    ccsc_updation: "",
    zta_bgl_attended: "",
    current_dqi: "",
    legacy_dqi: "",
    notes: "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("✔️ Submitted successfully!");
      setForm({ ...form, notes: "" });
    } else {
      setStatus("❌ Submission failed.");
    }
  };

  return (
    <div className="form-container" style={{ padding: '20px' }}>
      <h2>Branch Daily Data Entry</h2>
      <form onSubmit={handleSubmit}>
        <label>Branch:
          <select name="branch_name" required onChange={handleChange}>
            <option value="">Select Branch</option>
            {branches.map((b, i) => <option key={i} value={b}>{b}</option>)}
          </select>
        </label>

        {["kyc_updation", "deduplication", "edd", "ria", "deaf_accounts", "ccsc_updation", "zta_bgl_attended", "current_dqi", "legacy_dqi"].map((field) => (
          <label key={field}>
            {field.replace(/_/g, " ").toUpperCase()}:
            <input type="number" name={field} value={form[field]} onChange={handleChange} required />
          </label>
        ))}

        <label>Operational Notes:
          <textarea name="notes" value={form.notes} onChange={handleChange} />
        </label>

        <button type="submit">Submit</button>
        <div>{status}</div>
      </form>
    </div>
  );
};

export default DataEntryForm;
