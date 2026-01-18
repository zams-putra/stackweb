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
