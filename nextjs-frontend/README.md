# Frontend - NextJS
- main framework: NextJS
- styling: TailwindCSS

### Install 
```bash
npx create-next-app@latest nextjs-frontend --yes
cd nextjs-frontend
npm run dev
```


### set login logic in login page /src/page.tsx
```tsx
'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";


import React, { useState } from "react";

export default function Home() {

  const router = useRouter()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [liatPass, setLiatPass] = useState(false)
  const [errorGa, setErrorGa] = useState('')

  const liatPassHandler = () => {
    setLiatPass(!liatPass)
  }


  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const resp = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!resp.ok) {
      setErrorGa('invalid creds');
      return;
    }

    router.push('/dashboard');
  };

  
  
  return (
  <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
      <form
        className="w-full max-w-sm bg-slate-800 p-6 rounded-xl shadow-lg space-y-5"
        onSubmit={submitHandler}
      >
        <h1 className="text-2xl font-bold text-center">Sign in</h1>
        {
          errorGa ? (
            <p className="text-red-500 font-bold">{errorGa}</p>
          ) : ''
        }
 
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={form.email}
            onChange={(e) => {
              setForm({
                ...form,
                email: e.target.value
              })
            }}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <div className="relative">
            <input
              type={`${liatPass ? 'text' : 'password'}`}
              placeholder="••••••••"
              className="w-full px-3 py-2 pr-10 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={form.password}
              onChange={(e) => {
                setForm({
                  ...form,
                  password: e.target.value
                })
              }}
            />

            <button
              type="button"
              onClick={liatPassHandler}
              className="absolute inset-y-0 right-0 px-3 text-slate-400 hover:text-slate-200"
              aria-label="Toggle password visibility"
            >
              {liatPass ? 'unsee' : 'see'}
            </button>
          </div>
        </div>


        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-semibold transition"
        >
          Login
        </button>


        <p className="text-sm text-center text-slate-400">
          Don’t have an account?{' '}
          <Link
            href="/register"
            className="text-blue-400 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

```

## Authorization 

- set middleware for authorize, set di ./middleware.ts
```ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get('access_token');

  const protectedPrefixes = ['/dashboard', '/profile'];

  const isProtected = protectedPrefixes.some(p =>
    path === p || path.startsWith(p + '/')
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

```
- set login request for cookie set, di /app/page.tsx
```tsx
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const resp = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!resp.ok) {
      setErrorGa('invalid creds');
      return;
    }

    router.push('/dashboard');
  };
```

- di /api/auth/login, set route.ts
```ts
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

```