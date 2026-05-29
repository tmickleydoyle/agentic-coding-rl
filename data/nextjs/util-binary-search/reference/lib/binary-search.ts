export function binarySearch(sortedArr: number[], target: number): number {
  let lo = 0;
  let hi = sortedArr.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const val = sortedArr[mid];
    if (val === target) {
      return mid;
    }
    if (val < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return -1;
}
