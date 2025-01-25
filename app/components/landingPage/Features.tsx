"use client";

import { Brain, Palette, Users } from "lucide-react";

const Features = () => {
  return (
    <div id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-20">
        {/* Heading Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">Why Choose VibeCraft?</h2>
          <p className="text-md md:text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with intuitive design to create a unique artistic experience tailored to you.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Adaptive AI",
              icon: <Brain className="h-8 w-8 text-black" />,
              text: "Our AI learns your preferences and adjusts color schemes, patterns, and complexity to match your comfort level.",
            },
            {
              title: "Sensory-Friendly",
              icon: <Palette className="h-8 w-8 text-black" />,
              text: "Customizable interface with adjustable visual intensity and pattern complexity for a comfortable creative experience",
            },
            {
              title: "Collaborative",
              icon: <Users className="h-8 w-8 text-black" />,
              text: "Connect with fellow artists, share your creations, and collaborate on projects in our supportive community.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-300"
            >
              {/* Icon */}
              <div className="flex mb-4">
                <div className="p-3 bg-gray-200 rounded-full">{feature.icon}</div>
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-2xl font-bold text-black mb-2">{feature.title}</h3>

              {/* Description */}
              <p className="text-sm md:text-lg text-gray-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
