'use client'
import React from 'react'
export function InvoicesPage() { return <div data-testid="invoices-page"><h1>Invoices</h1><select data-testid="input-invoice-client"><option value="">Select client</option></select><select data-testid="input-invoice-status"><option value="draft">draft</option></select><input data-testid="input-invoice-taxrate" type="number" /><textarea data-testid="input-invoice-items" /><button data-testid="add-invoice-btn">Add Invoice</button></div> }
