import { getRooms } from '../../../lib/store';

export function GET() {
  return Response.json(getRooms());
}
