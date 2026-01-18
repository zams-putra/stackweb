import LogoutButton from "@/components/logout";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 p-8">
            <div className="max-w-xl mx-auto bg-slate-800 p-6 rounded-xl space-y-4">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p>Welcome! Kamu sudah login 🎉</p>
                <div className="flex gap-3">
                <Link
                    href="/profile"
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
                >
                    Profile
                </Link>
                <LogoutButton />
                </div>
            </div>
        </div>
    )
}