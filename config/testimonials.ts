// config/testimonials.ts

// 1. Define the Type (Fixes the "any is weird" comment)
export interface TestimonialItem {
  type: "youtube" | "twitter" | "activity" | "article";
  colSpan: string;
  link: string;
  // Optional properties depending on the card type
  author?: string;
  role?: string;
  content?: string;
  thumbnailColor?: string;
  handle?: string;
  title?: string;
  stat?: string;
  desc?: string;
  source?: string;
}

// 2. Export the Data (Fixes the "move to config" comment)
export const testimonials: TestimonialItem[] = [
  {
    type: "youtube",
    author: "Manu Arora",
    role: "Founder, Aceternity UI",
    content: "Review: The cleanest React components I've seen this year.",
    thumbnailColor: "bg-red-950",
    link: "#",
    colSpan: "col-span-1 md:col-span-2",
  },
  {
    type: "twitter",
    author: "Sarah Drasner",
    handle: "@sarah_edo",
    content: "Just tried out Wigggle UI for a client project. The radial gradients are exactly what I was missing. 🎨",
    link: "#",
    colSpan: "col-span-1",
  },
  {
    type: "activity",
    title: "Project Activity",
    stat: "1,240+",
    desc: "Commits pushed to main",
    link: "#",
    colSpan: "col-span-1",
  },
  {
    type: "article",
    source: "daily.dev",
    title: "Top 10 UI Libraries to Watch in 2026",
    desc: "Wigggle UI featured as a top contender for modern dashboard design.",
    link: "#",
    colSpan: "col-span-1",
  },
  {
    type: "youtube",
    author: "OrcDev",
    role: "Tech YouTuber",
    content: "Building a SaaS in 1 hour using these new components.",
    thumbnailColor: "bg-blue-950",
    link: "#",
    colSpan: "col-span-1 md:col-span-2",
  },
  {
    type: "twitter",
    author: "Guillermo Rauch",
    handle: "@rauchg",
    content: "This is the speed we need on the web. Incredible performance metrics on the new release. ▲",
    link: "#",
    colSpan: "col-span-1",
  },
];