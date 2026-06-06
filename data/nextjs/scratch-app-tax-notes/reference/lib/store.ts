import { TaxDocument, Deduction, TaxNote } from "./types";

let documents: TaxDocument[] = [
  { id: "doc1", name: "W-2 Employer", type: "w2", year: 2023, amount: 75000 },
  { id: "doc2", name: "1099-INT Bank", type: "1099", year: 2023, amount: 250 },
];

let deductions: Deduction[] = [
  { id: "ded1", description: "Home Office", amount: 1500, category: "business" },
  { id: "ded2", description: "Charitable Donations", amount: 800, category: "charitable" },
  { id: "ded3", description: "Medical Expenses", amount: 2200, category: "medical" },
];

let taxNotes: TaxNote[] = [
  { id: "n1", title: "Deadline Reminder", content: "File by April 15", date: "2024-01-01" },
];

export function getDocuments(): TaxDocument[] { return documents; }
export function getDeductions(): Deduction[] { return deductions; }
export function getTaxNotes(): TaxNote[] { return taxNotes; }
export function addDocument(d: TaxDocument): void { documents.push(d); }
export function deleteDocument(id: string): void { documents = documents.filter((d) => d.id !== id); }
export function addDeduction(d: Deduction): void { deductions.push(d); }
export function deleteDeduction(id: string): void { deductions = deductions.filter((d) => d.id !== id); }
export function addTaxNote(n: TaxNote): void { taxNotes.push(n); }
export function deleteTaxNote(id: string): void { taxNotes = taxNotes.filter((n) => n.id !== id); }

export function __reset(): void {
  documents = [
    { id: "doc1", name: "W-2 Employer", type: "w2", year: 2023, amount: 75000 },
    { id: "doc2", name: "1099-INT Bank", type: "1099", year: 2023, amount: 250 },
  ];
  deductions = [
    { id: "ded1", description: "Home Office", amount: 1500, category: "business" },
    { id: "ded2", description: "Charitable Donations", amount: 800, category: "charitable" },
    { id: "ded3", description: "Medical Expenses", amount: 2200, category: "medical" },
  ];
  taxNotes = [{ id: "n1", title: "Deadline Reminder", content: "File by April 15", date: "2024-01-01" }];
}
