import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function DilutionPage() {
  const { shareholders } = useApp();
  const [newShares, setNewShares] = useState("");
  const totalCurrentShares = shareholders.reduce((s, sh) => s + sh.shares, 0);
  const newSharesNum = parseInt(newShares, 10);
  const postTotal = !isNaN(newSharesNum) && newSharesNum > 0 ? totalCurrentShares + newSharesNum : null;

  return (
    <div data-testid="dilution-page">
      <h1>Dilution Calculator</h1>
      <input
        data-testid="dilution-new-shares-input"
        type="number"
        value={newShares}
        onChange={(e) => setNewShares(e.target.value)}
        placeholder="New shares to issue"
      />
      <table data-testid="dilution-table">
        <thead>
          <tr><th>Name</th><th>Shares</th><th>Pre %</th><th>Post %</th></tr>
        </thead>
        <tbody>
          {shareholders.map((sh) => {
            const prePct = totalCurrentShares > 0 ? ((sh.shares / totalCurrentShares) * 100).toFixed(2) : "0.00";
            const postPct = postTotal !== null ? ((sh.shares / postTotal) * 100).toFixed(2) : "-";
            return (
              <tr key={sh.id} data-testid={`dilution-row-${sh.id}`}>
                <td>{sh.name}</td>
                <td>{sh.shares.toLocaleString()}</td>
                <td data-testid={`dilution-pre-${sh.id}`}>{prePct}%</td>
                <td data-testid={`dilution-post-${sh.id}`}>{postTotal !== null ? `${postPct}%` : "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
