import React, { useState } from "react";

interface Property {
  id: number;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt: number;
  parking: number;
  hoa: number;
}

const PROPERTIES: Property[] = [
  { id: 1, address: "123 Maple St", price: 450000, bedrooms: 3, bathrooms: 2, sqft: 1800, yearBuilt: 1998, parking: 2, hoa: 0 },
  { id: 2, address: "456 Oak Ave", price: 320000, bedrooms: 2, bathrooms: 1, sqft: 1100, yearBuilt: 2005, parking: 1, hoa: 250 },
  { id: 3, address: "789 Pine Rd", price: 675000, bedrooms: 4, bathrooms: 3, sqft: 2600, yearBuilt: 1985, parking: 2, hoa: 0 },
  { id: 4, address: "101 Elm Blvd", price: 540000, bedrooms: 3, bathrooms: 2, sqft: 1950, yearBuilt: 2012, parking: 2, hoa: 150 },
  { id: 5, address: "202 Cedar Ln", price: 280000, bedrooms: 1, bathrooms: 1, sqft: 750, yearBuilt: 2019, parking: 1, hoa: 300 },
];

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("en-US");
}

export default function App() {
  const [selected, setSelected] = useState<number[]>([]);

  function toggle(id: number) {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  }

  function clearAll() {
    setSelected([]);
  }

  const compareProps = PROPERTIES.filter((p) => selected.includes(p.id));

  return (
    <div>
      <h1>Property Compare</h1>

      <div>
        <h2>Select Properties</h2>
        {PROPERTIES.map((p) => {
          const isChecked = selected.includes(p.id);
          const isDisabled = !isChecked && selected.length >= 3;
          return (
            <div key={p.id} data-testid={`property-option-${p.id}`}>
              <input
                type="checkbox"
                id={`prop-${p.id}`}
                checked={isChecked}
                disabled={isDisabled}
                onChange={() => toggle(p.id)}
                aria-label={p.address}
              />
              <label htmlFor={`prop-${p.id}`}>{p.address} — {formatPrice(p.price)}</label>
            </div>
          );
        })}
        <button onClick={clearAll} data-testid="clear-all">Clear All</button>
      </div>

      {compareProps.length > 0 && (
        <table data-testid="compare-table">
          <thead>
            <tr>
              <th>Feature</th>
              {compareProps.map((p) => <th key={p.id}>{p.address}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Address</td>
              {compareProps.map((p) => <td key={p.id}>{p.address}</td>)}
            </tr>
            <tr>
              <td>Price</td>
              {compareProps.map((p) => <td key={p.id}>{formatPrice(p.price)}</td>)}
            </tr>
            <tr>
              <td>Bedrooms</td>
              {compareProps.map((p) => <td key={p.id}>{p.bedrooms}</td>)}
            </tr>
            <tr>
              <td>Bathrooms</td>
              {compareProps.map((p) => <td key={p.id}>{p.bathrooms}</td>)}
            </tr>
            <tr>
              <td>Sqft</td>
              {compareProps.map((p) => <td key={p.id}>{p.sqft}</td>)}
            </tr>
            <tr>
              <td>Year Built</td>
              {compareProps.map((p) => <td key={p.id}>{p.yearBuilt}</td>)}
            </tr>
            <tr>
              <td>Parking Spaces</td>
              {compareProps.map((p) => <td key={p.id}>{p.parking}</td>)}
            </tr>
            <tr>
              <td>HOA/month</td>
              {compareProps.map((p) => (
                <td key={p.id}>{p.hoa === 0 ? "None" : formatPrice(p.hoa)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
