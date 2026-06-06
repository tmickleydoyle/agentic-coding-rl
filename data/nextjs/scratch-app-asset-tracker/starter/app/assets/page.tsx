'use client'
import React from 'react'
export function AssetsPage() { return <div data-testid="assets-page"><h1>Assets</h1><input data-testid="input-asset-name" placeholder="Name" /><input data-testid="input-asset-category" placeholder="Category" /><input data-testid="input-asset-price" type="number" placeholder="Purchase Price" /><input data-testid="input-asset-year" type="number" placeholder="Purchase Year" /><input data-testid="input-asset-depreciation" type="number" placeholder="Depreciation Rate %" /><button data-testid="add-asset-btn">Add Asset</button></div> }
