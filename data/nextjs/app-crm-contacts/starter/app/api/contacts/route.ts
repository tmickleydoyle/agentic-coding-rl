import {
  addTag,
  createContact,
  deleteContact,
  findContact,
  isKind,
  listActivities,
  listContacts,
  logActivity,
  removeTag,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: { contacts } with ?companyId=/?tag=; ?activity=true -> { activities }
  void req
  void listContacts
  void listActivities
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a contact, or with ?activity=true log an activity; validate inputs
  void req
  void createContact
  void logActivity
  void findContact
  void isKind
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= add a tag (&op=remove removes); 404 if absent, 400 if blank tag
  void req
  void addTag
  void removeTag
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete contact + activities; 404 if absent
  void req
  void deleteContact
  return json({ error: 'not implemented' }, 501)
}
