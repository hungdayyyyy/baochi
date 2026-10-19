"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { X, Search } from "lucide-react";

import TopAdBanner from "./TopAdBanner";

export interface NavChildCategory {
  _id: string;
  name: string;
  slug: string;
  position?: number;
  children?: NavChildCategory[];
}

export interface NavParentCategory {
  _id: string;
  name: string;
  slug: string;
  position: number;
  showInMenu: boolean;
  children: NavChildCategory[];
}

const DEFAULT_NAV_CATEGORIES: NavParentCategory[] = [
  {
    _id: "cat_tieu_diem",
    name: "Tiêu điểm",
    slug: "tieu-diem",
    position: 0,
    showInMenu: true,
    children: [
      {
        _id: "cat_goc_nhin",
        name: "Góc nhìn",
        slug: "goc-nhin",
        position: 1,
        children: [
          { _id: "sub_gn_1", name: "Sự kiện và Bình luận", slug: "goc-nhin/su-kien-va-binh-luan" },
          { _id: "sub_gn_2", name: "Ý tưởng", slug: "goc-nhin/y-tuong" },
        ],
      },
      {
        _id: "cat_infographic",
        name: "Infographic",
        slug: "multimedia/infographics",
        position: 2,
        children: [],
      },
    ],
  },
  {
    _id: "cat_kinh_doanh",
    name: "Kinh doanh",
    slug: "kinh-doanh",
    position: 1,
    showInMenu: true,
    children: [
      { _id: "sub_kd_1", name: "Thị trường", slug: "kinh-doanh/thi-truong" },
      { _id: "sub_kd_2", name: "Tài chính", slug: "kinh-doanh/tai-chinh-kinh-doanh" },
      { _id: "sub_kd_3", name: "Bất động sản", slug: "kinh-doanh/bat-dong-san" },
      { _id: "sub_kd_4", name: "Công nghiệp", slug: "kinh-doanh/cong-nghiep" },
      { _id: "sub_kd_5", name: "Dịch vụ", slug: "kinh-doanh/dich-vu" },
    ],
  },
  {
    _id: "cat_start_up",
    name: "Start-up",
    slug: "start-up",
    position: 2,
    showInMenu: true,
    children: [],
  },
  {
    _id: "cat_doanh_nghiep",
    name: "Doanh nghiệp",
    slug: "doanh-nghiep",
    position: 3,
    showInMenu: true,
    children: [
      { _id: "sub_dn_1", name: "Doanh nhân", slug: "doanh-nghiep/doanh-nhan" },
      { _id: "sub_dn_2", name: "Hồ sơ công ty", slug: "doanh-nghiep/ho-so-cong-ty" },
      { _id: "sub_dn_3", name: "Quản trị", slug: "doanh-nghiep/quan-tri" },
      { _id: "sub_dn_4", name: "Start-up", slug: "doanh-nghiep/start-up" },
      { _id: "sub_dn_5", name: "Chuyển đổi số", slug: "doanh-nghiep/chuyen-doi-so" },
      { _id: "sub_dn_6", name: "Nhân vật", slug: "doanh-nghiep/nhan-vat" },
    ],
  },
  {
    _id: "cat_cong_nghe",
    name: "Công nghệ",
    slug: "cong-nghe",
    position: 4,
    showInMenu: true,
    children: [
      { _id: "sub_cn_1", name: "Đổi mới", slug: "cong-nghe/doi-moi" },
      { _id: "sub_cn_2", name: "Chiến lược", slug: "cong-nghe/chien-luoc" },
      { _id: "sub_cn_3", name: "Trí tuệ nhân tạo (AI)", slug: "cong-nghe/tri-tue-nhan-tao" },
      { _id: "sub_cn_4", name: "Xu hướng", slug: "cong-nghe/xu-huong" },
      { _id: "sub_cn_5", name: "Sáng tạo", slug: "cong-nghe/sang-tao" },
      { _id: "sub_cn_6", name: "Công nghệ xanh", slug: "cong-nghe/cong-nghe-xanh" },
      { _id: "sub_cn_7", name: "Blockchain", slug: "cong-nghe/blockchain" },
      { _id: "sub_cn_8", name: "Fintech", slug: "cong-nghe/fintech" },
    ],
  },
  {
    _id: "cat_loi_song",
    name: "Lối sống",
    slug: "loi-song",
    position: 5,
    showInMenu: true,
    children: [],
  },
];

interface HeaderProps {
  categories?: NavParentCategory[];
}

export default function Header({ categories = [] }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isSticky, setIsSticky] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredChildId, setHoveredChildId] = useState<string | null>(null);

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const navCategories =
    categories && categories.length > 0 && categories.some((c) => c.children && c.children.length > 0)
      ? categories
      : DEFAULT_NAV_CATEGORIES;

  // Close drawer & dropdown on route change
  useEffect(() => {
    setDrawerOpen(false);
    setActiveDropdown(null);
    setSearchOpen(false);
  }, [pathname]);

  // Handle sticky navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Top ad banner is 230px
      setIsSticky(window.scrollY > 230);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle ESC key to close search, dropdown, drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setActiveDropdown(null);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced mouse enter/leave to prevent flickering & reset cascading submenus
  const handleMouseEnter = (catId: string, isFromTopNav = false) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (isFromTopNav || activeDropdown !== catId) {
      setHoveredChildId(null);
    }
    setActiveDropdown(catId);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setHoveredChildId(null);
    }, 120);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="w-full font-sans select-none relative z-50">
      {/* 1. TOP AD BANNER AREA: Matching IMAGE 2 */}
      {pathname === "/" && <TopAdBanner />}

      {/* STICKY HEADER WRAPPER (Logo Bar + Main Nav Row) */}
      <div
        className={`w-full bg-[#181716] transition-shadow duration-300 ${
          isSticky ? "fixed top-0 left-0 right-0 z-50 shadow-xl" : "relative"
        }`}
      >
        {/* 2. LOGO BAR (height 75px, dark background #181716) */}
        <div className="w-full border-b border-[#2d2c2a]">
          <div className="max-w-[1220px] mx-auto px-4 h-[75px] flex items-center justify-between">
            {/* Left: Hamburger + Forbes VIETNAM logo */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="w-[20px] h-[16px] flex flex-col justify-between items-start cursor-pointer focus:outline-none group p-0 bg-transparent border-0"
                aria-label="Open menu drawer"
                aria-expanded={drawerOpen}
              >
                <span className="w-[18px] h-[2px] bg-white group-hover:bg-[#f4121e] transition-colors rounded-none" />
                <span className="w-[18px] h-[2px] bg-white group-hover:bg-[#f4121e] transition-colors rounded-none" />
                <span className="w-[18px] h-[2px] bg-white group-hover:bg-[#f4121e] transition-colors rounded-none" />
              </button>

              <Link href="/" className="ml-7 block focus:outline-none">
                <Image
                  src="/assets/images/vietnam-forbes-digital-white.png"
                  alt="Forbes Việt Nam"
                  width={132}
                  height={32}
                  priority
                  className="h-[31px] w-auto object-contain"
                />
              </Link>
            </div>

            {/* Right: Search + Red 'Cơ hội hợp tác' button */}
            <div className="flex items-center space-x-5">
              {/* Expandable search input */}
              <div className="flex items-center relative">
                {searchOpen && (
                  <form onSubmit={handleSearchSubmit} className="mr-2 animate-fadeIn">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm..."
                      autoFocus
                      className="bg-transparent border-b border-white text-white text-sm px-2 py-1 focus:outline-none w-[150px] sm:w-[200px]"
                    />
                  </form>
                )}
                <button
                  type="button"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-1.5 text-white hover:text-[#f4121e] transition-colors focus:outline-none"
                  aria-label="Search"
                >
                  <Image
                    src="/assets/images/icon-search-white.svg"
                    alt="Search icon"
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                </button>
              </div>

              {/* Red 'Cơ hội hợp tác' button: square corners, white bold text */}
              <Link
                href="/partnership-inquiries"
                className="bg-[#f4121e] hover:bg-[#d8101a] text-white font-bold text-[14px] leading-4 tracking-[0.21px] py-[12.5px] px-6 transition-colors rounded-none inline-block whitespace-nowrap uppercase"
              >
                Cơ hội hợp tác
              </Link>
            </div>
          </div>
        </div>

        {/* 3. MAIN NAV ROW (height 56px, centered, uppercase, small bold sans-serif) */}
        <div className="w-full bg-[#181716] relative hidden lg:block">
          <div className="max-w-[1220px] mx-auto px-4">
            <nav className="flex items-center justify-center">
              <ul className="flex items-center justify-center space-x-6 xl:space-x-8">
                {navCategories.map((cat) => {
                  const isActive =
                    pathname === `/${cat.slug}` ||
                    (pathname.startsWith(`/${cat.slug}/`) && cat.slug !== "");
                  const hasChildren = cat.children && cat.children.length > 0;
                  const isHovered = activeDropdown === cat._id;

                  return (
                    <li
                      key={cat._id}
                      className="relative py-[16px] group"
                      onMouseEnter={() => handleMouseEnter(cat._id, true)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        href={`/${cat.slug}`}
                        onMouseEnter={() => handleMouseEnter(cat._id, true)}
                        className={`text-[13px] font-bold tracking-[0.04em] uppercase font-sans transition-colors block ${
                          isActive || isHovered
                            ? "text-white"
                            : "text-[#d0d0d0] hover:text-white"
                        }`}
                        aria-expanded={hasChildren ? isHovered : undefined}
                      >
                        {cat.name}
                      </Link>

                      {/* 4px Red Top Line Indicator with smooth running animation from left to right */}
                      <span
                        className={`absolute top-0 left-0 w-full h-[4px] bg-[#f4121e] pointer-events-none z-10 transition-transform duration-300 ease-out origin-left ${
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />

                      {/* 4. DROPDOWN (sub-menu): matching Image 1 & Image 2 */}
                      {hasChildren && isHovered && (
                        <div
                          className="absolute left-0 top-full bg-[#1c1c1c] shadow-[0_12px_32px_rgba(0,0,0,0.85)] z-50 flex flex-row items-start min-w-max border border-[#2a2a2a]"
                          onMouseEnter={() => handleMouseEnter(cat._id, false)}
                          onMouseLeave={handleMouseLeave}
                        >
                          {/* Case A: Tiêu điểm with cascading flyout (Image 1: initially only Góc nhìn & Infographic) */}
                          {cat.slug === "tieu-diem" ? (
                            (() => {
                              // Only show Column 2 if user actively hovers on a child with children
                              const activeChild = hoveredChildId
                                ? cat.children.find((c) => String(c._id) === String(hoveredChildId))
                                : null;
                              const subChildren = activeChild?.children || [];

                              return (
                                <div className="flex flex-row items-start">
                                  {/* Column 1: Direct children (Góc nhìn, Infographic) matching Image 1 */}
                                  <ul className={`flex flex-col py-0 m-0 w-[190px] bg-[#1c1c1c] ${subChildren.length > 0 ? "border-r border-[#2d2c2a]" : ""} animate-fadeIn`}>
                                    {cat.children.map((sub) => {
                                      const isCurrentHovered = String(hoveredChildId) === String(sub._id);
                                      const isSubActive = pathname === `/${sub.slug}`;
                                      const hasSubChildren = sub.children && sub.children.length > 0;

                                      return (
                                        <li
                                          key={sub._id}
                                          onMouseEnter={() => {
                                            if (hasSubChildren) {
                                              setHoveredChildId(sub._id);
                                            } else {
                                              setHoveredChildId(null);
                                            }
                                          }}
                                          className={`px-5 border-b border-[#2d2c2a] last:border-b-0 transition-colors ${
                                            isCurrentHovered ? "bg-[#282725]" : "hover:bg-[#252525]"
                                          }`}
                                        >
                                          <Link
                                            href={`/${sub.slug}`}
                                            className={`flex items-center py-[14px] text-[14px] font-sans font-medium leading-snug whitespace-nowrap transition-colors ${
                                              isSubActive || isCurrentHovered
                                                ? "text-white font-semibold"
                                                : "text-[#dcdcdc] hover:text-white"
                                            }`}
                                          >
                                            <span className="w-[7px] h-[7px] rounded-full bg-[#f4121e] shrink-0 mr-3.5 inline-block" />
                                            <span>{sub.name}</span>
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>

                                  {/* Column 2: Flying out ONLY when hovering Góc nhìn */}
                                  {subChildren.length > 0 && (
                                    <ul
                                      className="flex flex-col py-0 m-0 w-[220px] bg-[#1c1c1c] border-l border-[#2d2c2a] shadow-[0_6px_25px_rgba(0,0,0,0.7)] animate-fadeIn"
                                      onMouseLeave={() => setHoveredChildId(null)}
                                    >
                                      {subChildren.map((subChild) => {
                                        const isSubChildActive = pathname === `/${subChild.slug}`;
                                        return (
                                          <li
                                            key={subChild._id}
                                            className="px-5 border-b border-[#2d2c2a] last:border-b-0 hover:bg-[#282725] transition-colors"
                                          >
                                            <Link
                                              href={`/${subChild.slug}`}
                                              className={`flex items-center py-[14px] text-[14px] font-sans font-medium leading-snug whitespace-nowrap transition-colors ${
                                                isSubChildActive
                                                  ? "text-white font-semibold"
                                                  : "text-[#dcdcdc] hover:text-white"
                                              }`}
                                            >
                                              <span className="w-[7px] h-[7px] rounded-full bg-[#f4121e] shrink-0 mr-3.5 inline-block" />
                                              <span>{subChild.name}</span>
                                            </Link>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  )}
                                </div>
                              );
                            })()
                          ) : (
                            /* Case B: All other categories (Kinh doanh, Doanh nghiệp...) -> Single vertical column matching Image 2 */
                            <ul className="flex flex-col py-0 m-0 w-[210px] bg-[#1c1c1c] shadow-[0_12px_32px_rgba(0,0,0,0.85)] animate-fadeIn">
                              {cat.children.map((sub) => (
                                <li
                                  key={sub._id}
                                  className="px-5 border-b border-[#2d2c2a] last:border-b-0 hover:bg-[#252525] transition-colors"
                                >
                                  <Link
                                    href={`/${sub.slug}`}
                                    className={`flex items-center py-[14px] text-[14px] font-sans font-medium leading-snug whitespace-nowrap transition-colors ${
                                      pathname === `/${sub.slug}` ? "text-white font-semibold" : "text-[#dcdcdc] hover:text-white"
                                    }`}
                                  >
                                    <span className="w-[7px] h-[7px] rounded-full bg-[#f4121e] shrink-0 mr-3.5 inline-block" />
                                    <span>{sub.name}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* 5. HAMBURGER SLIDE-OUT DRAWER (Desktop & Mobile) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-[340px] max-w-[85vw] h-full bg-[#181716] z-10 flex flex-col justify-between overflow-y-auto shadow-2xl border-r border-[#2d2c2a] animate-slideInLeft">
            {/* Drawer Header */}
            <div>
              <div className="p-5 flex items-center justify-between border-b border-[#2d2c2a]">
                <Link href="/" onClick={() => setDrawerOpen(false)}>
                  <Image
                    src="/assets/images/vietnam-forbes-digital-white.png"
                    alt="Forbes Việt Nam"
                    width={120}
                    height={28}
                    className="h-[28px] w-auto object-contain"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="text-gray-400 hover:text-white p-1 focus:outline-none"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Drawer Menu Links */}
              <div className="py-2">
                {navCategories.map((cat) => (
                  <div key={cat._id} className="border-b border-[#242321]">
                    <Link
                      href={`/${cat.slug}`}
                      onClick={() => setDrawerOpen(false)}
                      className="block px-6 py-3.5 text-white font-bold text-[16px] tracking-wide uppercase hover:text-[#f4121e] transition-colors"
                    >
                      {cat.name}
                    </Link>

                    {/* Subcategories in Drawer */}
                    {cat.children && cat.children.length > 0 && (
                      <div className="bg-[#141312] py-1">
                        {cat.children.map((sub) => (
                          <Link
                            key={sub._id}
                            href={`/${sub.slug}`}
                            onClick={() => setDrawerOpen(false)}
                            className="flex items-center px-8 py-2.5 text-[#a0a0a0] hover:text-white text-[14px] transition-colors"
                          >
                            <span className="w-[6px] h-[6px] rounded-full bg-[#f4121e] mr-3 shrink-0" />
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Additional Drawer Links */}
                <div className="border-b border-[#242321]">
                  <Link
                    href="/goc-nhin"
                    onClick={() => setDrawerOpen(false)}
                    className="block px-6 py-3.5 text-white font-bold text-[16px] tracking-wide uppercase hover:text-[#f4121e] transition-colors"
                  >
                    Góc nhìn
                  </Link>
                </div>
                <div className="border-b border-[#242321]">
                  <Link
                    href="/multimedia"
                    onClick={() => setDrawerOpen(false)}
                    className="block px-6 py-3.5 text-white font-bold text-[16px] tracking-wide uppercase hover:text-[#f4121e] transition-colors"
                  >
                    Multimedia
                  </Link>
                </div>
                <div className="border-b border-[#242321]">
                  <Link
                    href="/magazine"
                    onClick={() => setDrawerOpen(false)}
                    className="block px-6 py-3.5 text-white font-bold text-[16px] tracking-wide uppercase hover:text-[#f4121e] transition-colors"
                  >
                    Ấn phẩm
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Footer: Magazine Banner + Partnership Button + Social + Copyright */}
            <div className="p-6 border-t border-[#2d2c2a] bg-[#121110]">
              <Link
                href="/dat-bao"
                onClick={() => setDrawerOpen(false)}
                className="block mb-5 overflow-hidden rounded shadow hover:opacity-90 transition-opacity"
              >
                <Image
                  src="/assets/images/155_Banner.png"
                  alt="Đặt báo Forbes"
                  width={290}
                  height={150}
                  className="w-full h-auto object-cover"
                />
              </Link>

              <div className="flex justify-center mb-5">
                <Link
                  href="/partnership-inquiries"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full text-center bg-[#f4121e] hover:bg-[#d8101a] text-white font-bold text-[13px] py-3 uppercase tracking-wider transition-colors"
                >
                  Cơ hội hợp tác
                </Link>
              </div>

              <div className="flex items-center justify-center space-x-4 mb-3 text-gray-400">
                <a
                  href="https://www.facebook.com/forbesvietnam.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <Image
                    src="/assets/images/facebook-white-icon.svg"
                    alt="Facebook"
                    width={18}
                    height={18}
                  />
                </a>
                <a
                  href="https://www.linkedin.com/company/forbes-vietnam/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <Image
                    src="/assets/images/lindken-white-icon.svg"
                    alt="LinkedIn"
                    width={18}
                    height={18}
                  />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <Image
                    src="/assets/images/twitter-white-icon.svg"
                    alt="Twitter"
                    width={18}
                    height={18}
                  />
                </a>
              </div>

              <p className="text-[12px] text-gray-500 text-center">
                © {new Date().getFullYear()} Forbes Việt Nam. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
