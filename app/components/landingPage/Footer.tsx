"use client";

const Footer = () => {
  return (
    <footer className="py-8 bg-white text-center">
      <p className="text-black text-sm md:text-md">
        © {new Date().getFullYear()} VibeCraft. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
