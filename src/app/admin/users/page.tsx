"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Shield, User, Edit2, Trash2, Key, CheckCircle, AlertCircle, X } from "lucide-react";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<"admin" | "editor">("editor");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormRole("editor");
    setFormError("");
    setIsCreateOpen(true);
  };

  const openEditModal = (u: AdminUser) => {
    setEditingUser(u);
    setFormName(u.name);
    setFormEmail(u.email);
    setFormPassword(""); // Only if resetting password
    setFormRole(u.role);
    setFormError("");
    setIsCreateOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName.trim() || !formEmail.trim()) {
      setFormError("Vui lòng nhập tên và email");
      return;
    }

    if (!editingUser && (!formPassword || formPassword.length < 6)) {
      setFormError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setSaving(true);
      const url = editingUser ? `/api/users/${editingUser._id}` : "/api/users";
      const method = editingUser ? "PUT" : "POST";

      const payload: any = {
        name: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
      };

      if (formPassword.trim()) {
        payload.password = formPassword.trim();
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Có lỗi xảy ra");
        return;
      }

      setIsCreateOpen(false);
      await fetchUsers();
    } catch (err: any) {
      setFormError(err.message || "Lỗi lưu tài khoản");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${name}"?`)) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchUsers();
      } else {
        const d = await res.json();
        alert(d.error || "Xóa thất bại");
      }
    } catch (err) {
      alert("Lỗi kết nối");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Tài khoản (Users)</h1>
          <p className="text-sm text-gray-500 mt-1">
            Phân quyền quản trị viên (Admin) và biên tập viên bài viết (Editor) cho hệ thống Forbes CMS
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 bg-[#d8361e] hover:bg-[#b52a15] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm người dùng</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#d8361e]"
          />
        </div>
        <span className="text-xs text-gray-500 font-medium hidden sm:inline">
          Tổng số: <strong className="text-gray-800">{filteredUsers.length}</strong> tài khoản
        </span>
      </div>

      {/* User Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Tên người dùng</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Vai trò (Role)</th>
                <th className="py-3 px-4">Ngày tạo</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-gray-900 flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{u.email}</td>
                    <td className="py-3.5 px-4">
                      {u.role === "admin" ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          <Shield className="w-3 h-3" />
                          <span>Admin</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <User className="w-3 h-3" />
                          <span>Editor</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 text-xs">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(u)}
                          className="p-1.5 text-gray-500 hover:text-[#d8361e] hover:bg-gray-100 rounded transition-colors"
                          title="Chỉnh sửa / Đổi mật khẩu"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(u._id, u.name)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Xóa người dùng"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create / Edit User */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-fadeIn border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900 text-base">
                {editingUser ? "Chỉnh sửa tài khoản" : "Tạo tài khoản mới"}
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#d8361e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email đăng nhập
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="admin@forbes.vn"
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#d8361e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {editingUser ? "Đổi mật khẩu mới (Bỏ trống nếu không đổi)" : "Mật khẩu"}
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder={editingUser ? "Nhập mật khẩu mới..." : "Ít nhất 6 ký tự"}
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#d8361e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Vai trò (Role)
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#d8361e]"
                >
                  <option value="editor">Editor (Biên tập viên viết bài)</option>
                  <option value="admin">Admin (Quản trị viên toàn quyền)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#d8361e] hover:bg-[#b52a15] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm"
                >
                  {saving ? "Đang lưu..." : editingUser ? "Cập nhật" : "Tạo tài khoản"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
