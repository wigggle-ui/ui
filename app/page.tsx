import Features from "@/components/features";
import Hero from "@/components/hero";
import SocialTestimonials from "@/components/social-testimonials"; 

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <Hero />
      <Features />
      <SocialTestimonials />
    </div>
  );
}