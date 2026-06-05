'use client'
import { useApp } from '../../components/AppStateProvider'
import { useDirectory } from '../../hooks/useDirectory'
import EmployeeCard from '../../components/EmployeeCard'

export default function DirectoryPage() {
  const { query, departmentFilter, setQuery, setDepartmentFilter, selectEmployee } = useApp()
  const { results, departments } = useDirectory()
  return (
    <section data-testid="page-directory">
      <h1>Directory</h1>
      <input
        data-testid="search-input"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <select
        data-testid="dept-filter"
        value={departmentFilter}
        onChange={(e) => setDepartmentFilter(e.target.value)}
      >
        <option value="all">All departments</option>
        {departments.map((d) => (
          <option key={d.department} value={d.department}>
            {d.department}
          </option>
        ))}
      </select>
      <p data-testid="result-count">{results.length}</p>
      {results.length === 0 ? (
        <p data-testid="empty-state">No employees match.</p>
      ) : (
        <ul data-testid="employee-list">
          {results.map((e) => (
            <EmployeeCard key={e.id} employee={e} onOpen={selectEmployee} />
          ))}
        </ul>
      )}
    </section>
  )
}
