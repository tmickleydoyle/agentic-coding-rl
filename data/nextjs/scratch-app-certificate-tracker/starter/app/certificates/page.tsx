'use client'
import React from 'react';
export function CertificatesPage() {
  return (
    <div data-testid="certificates-page">
      <h2>Certificates</h2>
      <button data-testid="issue-cert-btn">Issue Certificate</button>
      <ul data-testid="cert-list"></ul>
    </div>
  );
}
