"use client";

import React, { useState } from "react";

export default function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <div className="bg-[#181716] text-white p-6 border border-[#2d2c2a]">
      <span className="text-[11px] font-bold uppercase tracking-widest text-[#f4121e] block mb-2">
        FORBES NEWSLETTER
      </span>
      <h4 className="font-serif text-lg font-bold mb-3">
        Cập nhật thông tin độc quyền
      </h4>
      <p className="text-gray-400 text-xs leading-relaxed mb-4">
        Đăng ký nhận những phân tích kinh tế, hồ sơ doanh nghiệp và xu hướng công nghệ hàng tuần.
      </p>
      {subscribed ? (
        <div className="bg-[#242321] border border-green-800 text-green-400 text-xs p-3">
          Cảm ơn bạn đã đăng ký nhận bản tin!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Địa chỉ email của bạn..."
            className="w-full bg-[#242321] border border-[#3a3937] px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#f4121e]"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#f4121e] hover:bg-[#d8101a] text-white font-bold text-xs uppercase py-2.5 tracking-wider transition-colors"
          >
            Đăng ký ngay
          </button>
        </form>
      )}
    </div>
  );
}
