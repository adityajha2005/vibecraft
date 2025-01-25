"use client";

import { Zap, Brush, Star } from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-20 text-center">
        {/* Heading Section */}
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-black">How It Works</h2>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Inspire",
              icon: <Zap className="h-10 w-10 text-black" />,
              text: "Share your ideas or inspirations, and let AI work its magic.",
            },
            {
              step: "2",
              title: "Create",
              icon: <Brush className="h-10 w-10 text-black" />,
              text: "Customize your art in real time with intuitive tools.",
            },
            {
              step: "3",
              title: "Share",
              icon: <Star className="h-10 w-10 text-black" />,
              text: "Showcase your masterpieces and gain recognition.",
            },
          ].map((step, index) => (
            <div
              key={index}
              className="p-6 border rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Icon */}
              <div className="mb-4 flex justify-center">{step.icon}</div>

              {/* Title */}
              <h3 className="text-lg md:text-2xl font-bold mb-2 text-black">
                Step {step.step}: {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-lg text-gray-600">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
