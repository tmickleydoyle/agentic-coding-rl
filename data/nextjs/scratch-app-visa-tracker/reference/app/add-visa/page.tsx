import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import type { Visa, VisaStatus } from "../../lib/types";

let clientId = 100;

export default function AddVisaPage() {
  const { navigate, addVisa } = useApp();
  const [country, setCountry] = useState("");
  const [visaType, setVisaType] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [status, setStatus] = useState<VisaStatus>("applied");
  const [passportNumber, setPassportNumber] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const visa: Visa = { id: String(++clientId), country, visaType, appliedDate, expiryDate, status, passportNumber, notes };
    addVisa(visa);
    navigate("/visas");
  }

  return (
    <div data-testid="add-visa-page">
      <h2>Add Visa</h2>
      <form onSubmit={handleSubmit}>
        <input data-testid="input-country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />
        <input data-testid="input-visa-type" value={visaType} onChange={(e) => setVisaType(e.target.value)} placeholder="Visa Type" />
        <input data-testid="input-applied-date" type="date" value={appliedDate} onChange={(e) => setAppliedDate(e.target.value)} />
        <input data-testid="input-expiry-date" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
        <select data-testid="input-status" value={status} onChange={(e) => setStatus(e.target.value as VisaStatus)}>
          <option value="applied">applied</option>
          <option value="approved">approved</option>
          <option value="expired">expired</option>
        </select>
        <input data-testid="input-passport" value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} placeholder="Passport Number" />
        <textarea data-testid="input-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button type="submit" data-testid="submit-visa">Save Visa</button>
      </form>
    </div>
  );
}
