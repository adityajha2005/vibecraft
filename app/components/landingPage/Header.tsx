"use client";

import { Palette, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const handleSmoothScroll = (
  e: React.MouseEvent<HTMLAnchorElement>,
  targetId: string,
  isHomePage: boolean
) => {
  e.preventDefault();
  if (!isHomePage) {
    window.location.href = `/${targetId}`;
    return;
  }
  const target = document.querySelector(targetId);
  target?.scrollIntoView({ behavior: "smooth" });
};

const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>, isHomePage: boolean) => {
  e.preventDefault();
  if (!isHomePage) {
    window.location.href = '/';
    return;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="fixed w-full bg-white bg-opacity-50 backdrop-blur-xl text-black border-b border-gray-400 shadow-sm z-10 px-6 md:px-16">
      <div id="main" className="container mx-auto h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <Palette className="h-8 w-8 text-black" />
          <Link href="/" onClick={(e) => handleScrollToTop(e, isHomePage)}>
            <span className="text-xl md:text-2xl font-bold tracking-wide">VibeCraft</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <Link
            href={isHomePage ? "#features" : "/#features"}
            className="text-black hover:text-gray-700 transition"
            onClick={(e) => handleSmoothScroll(e, "#features", isHomePage)}
          >
            Features
          </Link>
          <Link
            href={isHomePage ? "#howworks" : "/#howworks"}
            className="text-black hover:text-gray-700 transition"
            onClick={(e) => handleSmoothScroll(e, "#howworks", isHomePage)}
          >
            How It Works
          </Link>
          <Link
            href={isHomePage ? "#testimonials" : "/#testimonials"}
            className="text-black hover:text-gray-700 transition"
            onClick={(e) => handleSmoothScroll(e, "#testimonials", isHomePage)}
          >
            Testimonials
          </Link>
        </div>

        {/* Sign In and Get Started Buttons */}
        {/* <div className="hidden md:flex gap-4">
          <Link href="/signin">
            <button className="px-5 py-2 text-black border-2 border-gray-700 rounded-xl hover:bg-gray-200 transition">
              Sign In
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-4 py-2 text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition">
              Get Started
            </button>
          </Link>
        </div> */}

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-black" /> // Cross icon
          ) : (
            <Menu className="w-6 h-6 text-black" /> // Menu icon
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="  bg-opacity-70 backdrop-blur-lg z-40 flex items-center justify-center"
          onClick={closeMenu}
        >
          <div
            className="bg-transparent transform transition-transform flex flex-col items-center space-y-6 p-6"
            onClick={(e) => e.stopPropagation()} 
          >
            <Link
              href={isHomePage ? "#features" : "/#features"}
              className="text-black text-md hover:text-gray-700 transition"
              onClick={(e) => handleSmoothScroll(e, "#features", isHomePage)}
            >
              Features
            </Link>
            <Link
              href={isHomePage ? "#howworks" : "/#howworks"}
              className="text-black text-md hover:text-gray-700 transition"
              onClick={(e) => handleSmoothScroll(e, "#howworks", isHomePage)}
            >
              How It Works
            </Link>
            <Link
              href={isHomePage ? "#testimonials" : "/#testimonials"}
              className="text-black text-md hover:text-gray-700 transition"
              onClick={(e) => handleSmoothScroll(e, "#testimonials", isHomePage)}
            >
              Testimonials
            </Link>
            {/* <Link href="/signin" onClick={closeMenu}>
              <button className="w-full px-4 py-2 text-md text-black border border-gray-700 rounded-xl hover:bg-gray-200 transition">
                Sign In
              </button>
            </Link>
            <Link href="/signup" onClick={closeMenu}>
              <button className="w-full px-4 py-2 text-md text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition">
                Get Started
              </button>
            </Link> */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
