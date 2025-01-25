"use client";

import { Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center">
      <div className="container mx-auto px-4 text-center text-gray-800">
        <div className="inline-flex flex-col items-center">
          {/* Icon and Main Heading */}
            <Sparkles className="h-12 w-12 text-black animate-bounce" />
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Create Art in Perfect Harmony with AI
            </h1>
          </div>

          {/* Description */}
          <p className="text-md md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
            Experience a personalized creative journey where AI adapts to your
            sensory preferences, making digital art creation accessible and
            enjoyable for everyone.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 text-sm md:text-lg">
            <Link href="/signup">
              <button className="px-3 py-3 md:px-6 md:py-3 text-white bg-gray-800 rounded-2xl font-semibold hover:bg-gray-700 transition flex items-center gap-2">
                Start Creating <Sparkles className="h-5 w-5" />
              </button>
            </Link>
            <Link href="#features">
              <button className="px-3 py-3 md:px-6 md:py-3 text-gray-800 border border-gray-400 rounded-2xl font-semibold hover:bg-gray-200 transition flex items-center gap-2">
                Learn More <ChevronRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
