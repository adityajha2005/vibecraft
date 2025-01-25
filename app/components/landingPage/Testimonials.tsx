"use client";

import { MessageSquare } from "lucide-react";

const Testimonials = () => {
  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-20 text-center">
        {/* Heading Section */}
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-black">What Our Artists Say</h2>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Alex", review: "VibeCraft revolutionized my creative process. The adaptive AI is incredible!" },
            { name: "Jordan", review: "The sensory-friendly features are a game changer. Highly recommend!" },
            { name: "Taylor", review: "Collaboration is so seamless with ArtSync. Love the community vibe!" },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="p-6 border rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Icon */}
              <MessageSquare className="mb-4 text-black h-8 w-8 mx-auto" />

              {/* Review Text */}
              <p className="text-md md:text-lg italic text-gray-700">"{testimonial.review}"</p>

              {/* Name */}
              <h3 className="mt-4 text-lg  md:text-xl font-bold text-gray-900">- {testimonial.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
