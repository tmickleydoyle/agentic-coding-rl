export type Item = { weight: number; value: number };

export function knapsack(
  items: Item[],
  capacity: number,
): { value: number; chosen: number[] } {
  const n = items.length;
  if (n === 0 || capacity <= 0) return { value: 0, chosen: [] };

  // dp[i][w] = best value using first i items with capacity w.
  const dp: number[][] = [];
  for (let i = 0; i <= n; i++) dp.push(new Array<number>(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const { weight, value } = items[i - 1];
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (weight <= w) {
        const take = dp[i - 1][w - weight] + value;
        if (take > dp[i][w]) dp[i][w] = take;
      }
    }
  }

  // Reconstruct chosen indices.
  const chosen: number[] = [];
  let w = capacity;
  for (let i = n; i >= 1; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      chosen.push(i - 1);
      w -= items[i - 1].weight;
    }
  }
  chosen.reverse();

  return { value: dp[n][capacity], chosen };
}

export function coinChange(coins: number[], amount: number): number {
  if (amount === 0) return 0;
  if (amount < 0) return -1;

  const INF = amount + 1;
  const dp = new Array<number>(amount + 1).fill(INF);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (let c = 0; c < coins.length; c++) {
      const coin = coins[c];
      if (coin > 0 && coin <= a && dp[a - coin] + 1 < dp[a]) {
        dp[a] = dp[a - coin] + 1;
      }
    }
  }
  return dp[amount] === INF ? -1 : dp[amount];
}
