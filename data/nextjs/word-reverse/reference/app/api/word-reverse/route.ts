const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams
  const sentence = params.get('sentence')
  if (sentence === null || sentence === '') {
    return json({ error: 'sentence is required' }, 400)
  }
  const result = sentence
    .split(' ')
    .map((word) => word.split('').reverse().join(''))
    .join(' ')
  return json({ result })
}
