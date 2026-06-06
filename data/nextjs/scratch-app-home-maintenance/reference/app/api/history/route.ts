import { getTasks } from '../../../lib/store'
export async function GET() {
  const completed = getTasks().filter(t=>t.status==='completed').sort((a,b)=>(b.completedDate||'').localeCompare(a.completedDate||''))
  return Response.json(completed)
}
