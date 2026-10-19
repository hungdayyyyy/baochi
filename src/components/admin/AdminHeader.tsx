"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, User as UserIcon } from "lucide-react";

export default function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div>
        <h2 className="text-sm font-semibold text-gray-800">
          Khu vực Quản trị Toà soạn
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold border border-gray-200">
            {session?.user?.name ? session.user.name.charAt(0) : "A"}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{session?.user?.name || "Quản trị viên"}</p>
            <p className="text-[10px] text-gray-400 capitalize">
              Vai trò: {(session?.user as any)?.role || "admin"}
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center space-x-1.5 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </header>
  );
}
