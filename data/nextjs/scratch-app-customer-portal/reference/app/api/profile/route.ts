import { getProfile, updateProfile } from '../../../lib/store'

export async function GET() { return Response.json(getProfile()) }
export async function PATCH(req: Request) {
  const data = await req.json()
  return Response.json(updateProfile(data))
}
