"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

const CallToAction = () => {
  return (
    <div className="py-24 bg-slate-900 text-center">
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-6">Ready to Start Creating?</h2>
      <p className="text-md md:text-lg text-white/80 mb-8">
        Join thousands of artists and start your journey with VibeCraft today.
      </p>
      <Link href="/signup">
        <button className="text-sm md:text-lg px-4 py-2 md:px-6 md:py-3 text-black bg-white rounded-2xl font-semibold hover:bg-gray-300 transition">
          Get Started Now <ChevronRight className="h-5 w-5 inline" />
        </button>
      </Link>
    </div>
  );
};

export default CallToAction;
