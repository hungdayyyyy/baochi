"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Users,
  Tags,
  LayoutGrid,
  ExternalLink,
  Settings,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/admin/articles", label: "Quản lý bài viết", icon: FileText },
    { href: "/admin/layouts", label: "Sắp xếp trang (Layout)", icon: LayoutGrid },
    { href: "/admin/categories", label: "Chuyên mục", icon: FolderTree },
    { href: "/admin/authors", label: "Tác giả", icon: Users },
    { href: "/admin/tags", label: "Thẻ Tags", icon: Tags },
    { href: "/admin/users", label: "Quản lý tài khoản (Users)", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#141414] text-gray-300 min-h-screen flex flex-col justify-between border-r border-[#262626]">
      <div>
        {/* Brand */}
        <div className="p-6 border-b border-[#262626]">
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="font-serif text-2xl font-black text-white uppercase tracking-tight">
              Forbes
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-[#d8361e] px-1.5 py-0.5 rounded">
              CMS
            </span>
          </Link>
          <p className="text-[11px] text-gray-500 mt-1">Hệ thống Quản trị Nội dung</p>
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-[#d8361e] text-white shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-[#222222]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer link to public site */}
      <div className="p-4 border-t border-[#262626] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between text-xs text-gray-400 hover:text-white p-2 rounded hover:bg-[#222222] transition-colors"
        >
          <span>Xem trang công khai</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
