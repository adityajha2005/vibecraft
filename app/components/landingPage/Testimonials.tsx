import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const Testimonials=() =>{
  const testimonials = [
    {
      quote: "VibeCraft revolutionized my creative process. The adaptive AI is incredible!",
      name: "Alex",
      designation: "Creative Director at Visionary Studios",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote: "The sensory-friendly features are a game changer. Highly recommend!",
      name: "Jordan",
      designation: "UX Specialist at Harmony Tech",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote: "Collaboration is so seamless with ArtSync. Love the community vibe!",
      name: "Taylor",
      designation: "Community Manager at SyncWorks",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote: "ArtFusion's intuitive interface transformed the way I work with teams. It’s a must-have!",
      name: "Chris",
      designation: "Lead Designer at Creatify",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote: "The adaptive tools are exactly what our team needed to boost productivity. Highly recommend!",
      name: "Morgan",
      designation: "Product Manager at TechFlow",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  ];
  
  return (
    <>
    <div className="mb-10 mt-16">
    <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center text-black z-100">What Our Artists Say</h2>
  <AnimatedTestimonials testimonials={testimonials} />
  </div>
  </>
  );
}
export default Testimonials;
