import { TaxDocument, Deduction, TaxNote } from "./types";
export function getDocuments(): TaxDocument[] { return []; }
export function getDeductions(): Deduction[] { return []; }
export function getTaxNotes(): TaxNote[] { return []; }
export function addDocument(_d: TaxDocument): void {}
export function deleteDocument(_id: string): void {}
export function addDeduction(_d: Deduction): void {}
export function deleteDeduction(_id: string): void {}
export function addTaxNote(_n: TaxNote): void {}
export function deleteTaxNote(_id: string): void {}
export function __reset(): void {}
