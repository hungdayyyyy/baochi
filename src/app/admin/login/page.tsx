"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@forbes.vn");
  const [password, setPassword] = useState("Admin@123456");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Generate standard Bearer JWT token from /api/auth/token
      const tokenRes = await fetch("/api/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const tokenData = await tokenRes.json();

      if (!tokenRes.ok || !tokenData.token) {
        setError(tokenData.error || "Email hoặc mật khẩu không chính xác");
        setLoading(false);
        return;
      }

      // Store JWT token for client-side Bearer token authorization
      if (typeof window !== "undefined") {
        localStorage.setItem("forbes_admin_token", tokenData.token);
        localStorage.setItem("forbes_admin_user", JSON.stringify(tokenData.user));
      }

      // 2. Synchronize NextAuth session for Next.js SSR middleware
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "Đã xảy ra lỗi đăng nhập.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0d0d0d] flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-[#161616] border border-[#2a2a2a] rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-block mb-3">
            <span className="font-serif text-4xl font-extrabold uppercase text-white tracking-tighter">
              Forbes
            </span>
            <span className="text-xs uppercase font-bold tracking-widest text-[#d8361e] ml-2">
              CMS
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-serif">
            Hệ thống Quản trị Toà soạn
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Đăng nhập để quản lý bài viết và bố cục trang
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Email đăng nhập
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@forbes.vn"
                className="w-full bg-[#202020] border border-[#333333] text-white px-4 py-2.5 pl-10 rounded text-sm focus:outline-none focus:border-[#d8361e]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#202020] border border-[#333333] text-white px-4 py-2.5 pl-10 rounded text-sm focus:outline-none focus:border-[#d8361e]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d8361e] hover:bg-[#b82d18] text-white font-bold text-xs uppercase tracking-wider py-3 rounded flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
            >
              <span>{loading ? "Đang xác thực..." : "Đăng nhập hệ thống"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-[#262626] text-center text-xs text-gray-500">
          Tài khoản mặc định: <span className="text-gray-300 font-mono">admin@forbes.vn</span> / <span className="text-gray-300 font-mono">Admin@123456</span>
        </div>
      </div>
    </div>
  );
}
