import React from "react";

export default function InjuriesPage() {
  return (
    <div data-testid="injuries-page">
      <h1>Injuries</h1>
      <form data-testid="add-injury-form">
        <input data-testid="input-body-part" placeholder="Body part" />
        <select data-testid="input-injury-type">
          <option value="strain">Strain</option>
          <option value="sprain">Sprain</option>
          <option value="fracture">Fracture</option>
          <option value="bruise">Bruise</option>
        </select>
        <select data-testid="input-severity">
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
        </select>
        <input data-testid="input-injury-date" type="date" />
        <button type="submit" data-testid="btn-add-injury">Add</button>
      </form>
      <ul data-testid="injury-list"></ul>
    </div>
  );
}
