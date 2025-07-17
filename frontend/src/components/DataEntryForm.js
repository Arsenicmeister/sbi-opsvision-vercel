import React, { useState } from 'react';
import './DataEntryForm.css';

const branches = [
  "BABY NAGAR VELACHERY",
  "BYE PASS VELACHERY", 
  "INDIRA NAGAR ADYAR",
  "NANDAMBAKKAM",
  "PBB BESANT NAGAR",
  "SHASTHRI NAGAR",
  "ANNA NAGAR WEST",
  "ANNA NAGAR EAST",
  "T NAGAR",
  "MYLAPORE",
  "THIRUVANMIYUR",
  "KODAMBAKKAM",
  "VADAPALANI",
  "ASHOK NAGAR",
  "WEST MAMBALAM",
  "SAIDAPET",
  "GUINDY",
  "TAMBARAM",
  "CHROMEPET",
  "PALLAVARAM",
  "TAMBARAM SANATORIUM",
  "MEDAVAKKAM",
  "SHOLINGANALLUR",
  "PERUNGUDI",
  "THORAIPAKKAM",
  "KELAMBAKKAM",
  "MAHABALIPURAM",
  "CHENGALPATTU",
  "KANCHEEPURAM",
  "SRIPERUMBUDUR",
  "POONAMALLEE",
  "AVADI",
  "AMBATTUR",
  "MADHAVARAM",
  "ENNORE",
  "MANALI"
];

const formFields = [
  { key: 'kyc_updation', label: 'KYC Updation (%)', max: 100 },
  { key: 'deduplication', label: 'Deduplication (%)', max: 100 },
  { key: 'edd', label: 'EDD (%)', max: 100 },
  { key: 'ria', label: 'RIA (%)', max: 100 },
  { key: 'deaf_accounts', label: 'DEAF Accounts (%)', max: 100 },
  { key: 'ccsc_updation', label: 'CCSC Updation (%)', max: 100 },
  { key: 'zta_bgl_attended', label: 'ZTA BGL Attended (%)', max: 100 },
  { key: 'current_dqi', label: 'Current DQI (%)', max: 100 },
  { key: 'legacy_dqi', label: 'Legacy DQI (%)', max: 100 },
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate percentage fields
    if (name !== 'branch_name' && name !== 'notes') {
      const numValue = parseFloat(value);
      if (value !== '' && (isNaN(numValue) || numValue < 0 || numValue > 100)) {
        return; // Don't update if invalid
      }
    }
    
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("Submitting data...");

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const result = await response.json();
        setStatus(`✔️ ${result.message}`);
        
        // Reset form except branch name
        setForm({
          ...form,
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
      } else {
        const error = await response.json();
        setStatus(`❌ ${error.error || 'Submission failed'}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setStatus("❌ Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
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
    setStatus(null);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Branch Daily Data Entry</h2>
        <p>Enter daily performance metrics for your branch</p>
      </div>

      <form onSubmit={handleSubmit} className="data-entry-form">
        <div className="form-section">
          <h3>Branch Selection</h3>
          <div className="form-group">
            <label htmlFor="branch_name">Branch Name *</label>
            <select 
              id="branch_name"
              name="branch_name" 
              value={form.branch_name}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Select Your Branch</option>
              {branches.map((branch, index) => (
                <option key={index} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Performance Metrics</h3>
          <div className="metrics-grid">
            {formFields.map((field) => (
              <div key={field.key} className="form-group">
                <label htmlFor={field.key}>{field.label} *</label>
                <input
                  type="number"
                  id={field.key}
                  name={field.key}
                  value={form[field.key]}
                  onChange={handleChange}
                  min="0"
                  max={field.max}
                  step="0.1"
                  required
                  className="form-control"
                  placeholder="0-100"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Information</h3>
          <div className="form-group">
            <label htmlFor="notes">Operational Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="4"
              className="form-control"
              placeholder="Any additional notes or observations..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={resetForm}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Reset Form
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Data'}
          </button>
        </div>

        {status && (
          <div className={`status-message ${status.includes('✔️') ? 'success' : 'error'}`}>
            {status}
          </div>
        )}
      </form>
    </div>
  );
};

export default DataEntryForm;
