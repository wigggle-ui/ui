import Features from "@/components/features";
import Hero from "@/components/hero";
// Only import the requested component
import SocialTestimonials from "@/components/social-testimonials"; 

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <Hero />
      <Features />
      
      {/* The Issue only asked for this 👇 */}
      <SocialTestimonials />
    </div>
  );
}