import Features from "@/components/features";
// import Showcase from "@/components/showcase";

import Hero from "@/components/hero";

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <Hero />
      <Features />
      {/* <Showcase /> */}
    </div>
  );
}
