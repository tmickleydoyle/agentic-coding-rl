'use client'
import { useApp } from '../../components/AppStateProvider'
import { useSales } from '../../hooks/useSales'
import StatCard from '../../components/StatCard'
import type { Region } from '../../lib/types'

export default function OverviewPage() {
  const { regionFilter, setRegionFilter } = useApp()
  const { totals, topProduct } = useSales()
  return (
    <section data-testid="page-overview">
      <h1>Overview</h1>
      <select
        data-testid="region-filter"
        value={regionFilter}
        onChange={(e) => setRegionFilter(e.target.value as Region | 'all')}
      >
        <option value="all">All</option>
        <option value="NA">NA</option>
        <option value="EU">EU</option>
        <option value="APAC">APAC</option>
      </select>
      <div data-testid="stats">
        <StatCard label="Revenue" value={totals.totalRevenue} testid="revenue" />
        <StatCard label="Units" value={totals.totalUnits} testid="units" />
        <StatCard label="Orders" value={totals.orderCount} testid="orders" />
        <StatCard label="Top product" value={topProduct} testid="top-product" />
      </div>
    </section>
  )
}
