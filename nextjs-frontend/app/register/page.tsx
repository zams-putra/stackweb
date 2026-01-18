import Link from "next/link";

export default function Register() {
  return (
  <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
      <form
   
        className="w-full max-w-sm bg-slate-800 p-6 rounded-xl shadow-lg space-y-5"
      >
        <h1 className="text-2xl font-bold text-center">Sign up</h1>

 
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
 
            required
          />
        </div>


        <div>
          <label className="block text-sm mb-1">Password</label>
          <div className="relative">
            <input
   
              placeholder="••••••••"
              className="w-full px-3 py-2 pr-10 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"


              required
            />

            <button
              type="button"
 
              className="absolute inset-y-0 right-0 px-3 text-slate-400 hover:text-slate-200"
              aria-label="Toggle password visibility"
            >
              {/* {showPassword ? '🙈' : '👁️'} */}👁️
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
          Already have an account?{' '}
          <Link
            href="/"
            className="text-blue-400 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
