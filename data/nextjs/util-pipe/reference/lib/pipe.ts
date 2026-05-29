export function pipe(...fns: Array<(arg: any) => any>): (arg: any) => any {
  return (arg: any): any => fns.reduce((acc, fn) => fn(acc), arg);
}

export function compose(...fns: Array<(arg: any) => any>): (arg: any) => any {
  return (arg: any): any => fns.reduceRight((acc, fn) => fn(acc), arg);
}
