'use client'
// TODO: render a <button data-testid={`link-${href}`}>{label}</button>.
// When `active`, add aria-current="page". Call onClick when clicked.
export default function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string
  label: string
  active: boolean
  onClick: () => void
}) {
  return <button />
}
