import { Holding, Transaction } from './types'
export function getHoldings(): Holding[] { return [] }
export function addHolding(_d: Omit<Holding,'id'>): Holding { return { id:'',symbol:'',name:'',quantity:0,purchasePrice:0,currentPrice:0 } }
export function deleteHolding(_id: string): boolean { return false }
export function getTransactions(): Transaction[] { return [] }
export function addTransaction(_d: Omit<Transaction,'id'>): Transaction { return { id:'',symbol:'',type:'buy',quantity:0,price:0,date:'' } }
export function __reset() {}
