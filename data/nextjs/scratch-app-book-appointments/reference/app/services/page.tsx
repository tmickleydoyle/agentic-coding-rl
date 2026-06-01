'use client'
import { useApp } from '../../components/AppStateProvider'
import ServiceCard from '../../components/ServiceCard'

export default function ServicesPage() {
  const { services, selectService } = useApp()
  return (
    <section data-testid="page-services">
      <h1>Services</h1>
      <ul data-testid="services-list">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} onSelect={selectService} />
        ))}
      </ul>
    </section>
  )
}
