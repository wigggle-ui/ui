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
    type: "youtube",
    author: "Manu Arora",
    authorAvatar: "https://avatars.githubusercontent.com/u/23276437?v=4",
    role: "Founder, Aceternity UI",
    content: "Something which is not just a component for a landing page.",
    thumbnailColor: "bg-red-950",
    link: "https://www.youtube.com/live/NAS4BEP2KtA?si=JsflmWzp9OFA7yIl&t=3797",
    colSpan: "col-span-1 md:col-span-2",
  },
  {
    type: "twitter",
    author: "OrcDev",
    authorAvatar: "https://avatars.githubusercontent.com/u/7549148?v=4",
    handle: "@orcdev",
    content: "This one is a gem, I love it! 💚",
    link: "https://x.com/orcdev/status/2007367172990071008",
    colSpan: "col-span-1",
  },
  {
    type: "article",
    source: "daily.dev",
    title: "Widgets Library for the Web",
    desc: "Wigggle UI featured as a top contender for modern dashboard design.",
    link: "https://app.daily.dev/posts/widgets-library-for-the-web-wigggle-ui-ysnbauodg",
    colSpan: "col-span-1",
  },
  {
    type: "twitter",
    author: "Alem Tuzlak",
    authorAvatar: "https://avatars.githubusercontent.com/u/18480956?v=4",
    handle: "@AlemTuzlak",
    content:
      "Loved the widget idea, I'm going to explore it in my SaaS idea and see if I can fit it into there 🤭",
    link: "https://x.com/AlemTuzlak/status/2007371716629237914",
    colSpan: "col-span-1",
  },
  {
    type: "article",
    source: "allshadcn.com",
    title:
      "The first open-source collection of copy-paste widgets for web projects, fully compatible with shadcn/ui.",
    desc: "Wigggle UI is the pioneering open-source repository of ready-to-use widgets tailored for web development, particularly within the shadcn/ui ecosystem.",
    link: "https://allshadcn.com/tools/wigggle-ui/",
    colSpan: "col-span-1",
  },
  {
    type: "twitter",
    author: "nuqs",
    authorAvatar: "https://avatars.githubusercontent.com/u/43356325?s=200&v=4",
    handle: "@nuqs47ng",
    content:
      "Oh we saw that on @orcdev's stream, very cool! This one brings back a lot of good memories (iPod gen 1 🎶)",
    link: "https://x.com/nuqs47ng/status/2007892944922272176",
    colSpan: "col-span-1",
  },
  {
    type: "youtube",
    author: "OrcDev",
    authorAvatar: "https://avatars.githubusercontent.com/u/7549148?v=4",
    role: "Web Dev Warrior",
    content: "This is really cool, I really love Wigggle UI.",
    thumbnailColor: "bg-red-950",
    link: "https://www.youtube.com/live/w4AUms5wNpY?si=qF8bQOBiaaWKBBTz&t=1635",
    colSpan: "col-span-1 md:col-span-2",
  },
];
