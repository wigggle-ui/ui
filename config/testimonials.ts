export interface TestimonialItem {
  type: "youtube" | "twitter" | "activity" | "article";
  colSpan: string;
  link: string;
  author?: string;
  role?: string;
  content?: string;
  thumbnailColor?: string;
  handle?: string;
  title?: string;
  stat?: string;
  desc?: string;
  source?: string;
  authorAvatar?: string;
}

export const testimonials: TestimonialItem[] = [
  {
    author: "Manu Arora",
    authorAvatar: "https://avatars.githubusercontent.com/u/23276437?v=4",
    colSpan: "col-span-1 md:col-span-2",
    content: "Something which is not just a component for a landing page.",
    link: "https://www.youtube.com/live/NAS4BEP2KtA?si=JsflmWzp9OFA7yIl&t=3797",
    role: "Founder, Aceternity UI",
    thumbnailColor: "bg-red-950",
    type: "youtube",
  },
  {
    author: "OrcDev",
    authorAvatar: "https://avatars.githubusercontent.com/u/7549148?v=4",
    colSpan: "col-span-1",
    content: "This one is a gem, I love it! 💚",
    handle: "@orcdev",
    link: "https://x.com/orcdev/status/2007367172990071008",
    type: "twitter",
  },
  {
    colSpan: "col-span-1",
    desc: "Wigggle UI featured as a top contender for modern dashboard design.",
    link: "https://app.daily.dev/posts/widgets-library-for-the-web-wigggle-ui-ysnbauodg",
    source: "daily.dev",
    title: "Widgets Library for the Web",
    type: "article",
  },
  {
    author: "Alem Tuzlak",
    authorAvatar: "https://avatars.githubusercontent.com/u/18480956?v=4",
    colSpan: "col-span-1",
    content:
      "Loved the widget idea, I'm going to explore it in my SaaS idea and see if I can fit it into there 🤭",
    handle: "@AlemTuzlak",
    link: "https://x.com/AlemTuzlak/status/2007371716629237914",
    type: "twitter",
  },
  {
    colSpan: "col-span-1",
    desc: "Wigggle UI is the pioneering open-source repository of ready-to-use widgets tailored for web development, particularly within the shadcn/ui ecosystem.",
    link: "https://allshadcn.com/tools/wigggle-ui/",
    source: "allshadcn.com",
    title:
      "The first open-source collection of copy-paste widgets for web projects, fully compatible with shadcn/ui.",
    type: "article",
  },
  {
    author: "nuqs",
    authorAvatar: "https://avatars.githubusercontent.com/u/43356325?s=200&v=4",
    colSpan: "col-span-1",
    content:
      "Oh we saw that on @orcdev's stream, very cool! This one brings back a lot of good memories (iPod gen 1 🎶)",
    handle: "@nuqs47ng",
    link: "https://x.com/nuqs47ng/status/2007892944922272176",
    type: "twitter",
  },
  {
    author: "OrcDev",
    authorAvatar: "https://avatars.githubusercontent.com/u/7549148?v=4",
    colSpan: "col-span-1 md:col-span-2",
    content: "This is really cool, I really love Wigggle UI.",
    link: "https://www.youtube.com/live/w4AUms5wNpY?si=qF8bQOBiaaWKBBTz&t=1635",
    role: "Web Dev Warrior",
    thumbnailColor: "bg-red-950",
    type: "youtube",
  },
];
