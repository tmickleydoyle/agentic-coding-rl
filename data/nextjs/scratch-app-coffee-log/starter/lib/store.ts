import type { Bean, Brew } from './types';
let beans: Bean[] = []; let brews: Brew[] = [];
export function __reset() { beans = []; brews = []; }
export function getBeans() { return beans; }
export function addBean(_d: Omit<Bean,'id'>): Bean { return {} as Bean; }
export function deleteBean(_id: string) {}
export function getBrews() { return brews; }
export function addBrew(_d: Omit<Brew,'id'>): Brew { return {} as Brew; }
export function deleteBrew(_id: string) {}
