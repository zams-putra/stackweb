import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const resp = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    return NextResponse.json({ error: 'invalid' }, { status: 401 });
  }

  const data = await resp.json();

  const res = NextResponse.json({ success: true });

  res.cookies.set('access_token', data.data.access_token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
  });

  return res;
}
