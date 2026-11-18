export interface SponsorshipTier {
  accent: string;
  benefits: string[];
  description: string;
  featured?: boolean;
  id: string;
  name: string;
  price: number;
}

export const sponsorshipTiers: SponsorshipTier[] = [
  {
    accent: "text-muted-foreground",
    benefits: ["A nice shoutout on X"],
    description: "A little support goes a long way.",
    id: "577329",
    name: "Herald",
    price: 5,
  },
  {
    accent: "text-sky-600 dark:text-sky-400",
    benefits: ["Everything in Herald", "Your details in the Sponsors section"],
    description: "Get your name on the list of backers.",
    id: "577331",
    name: "Guardian",
    price: 10,
  },
  {
    accent: "text-amber-700 dark:text-amber-400",
    benefits: ["Everything in Guardian", "Your details on the Landing Page"],
    description: "Be recognized as a Bronze Sponsor.",
    id: "577332",
    name: "Crusader",
    price: 20,
  },
  {
    accent: "text-slate-600 dark:text-slate-300",
    benefits: ["Everything in Crusader", "Your details on the Docs Page"],
    description: "Be recognized as a Silver Sponsor.",
    id: "577333",
    name: "Archon",
    price: 50,
  },
  {
    accent: "text-yellow-700 dark:text-yellow-400",
    benefits: ["Everything in Archon", "Your details in the GitHub Readme"],
    description: "Be recognized as a Gold Sponsor.",
    id: "577334",
    name: "Legend",
    price: 100,
  },
  {
    accent: "text-violet-600 dark:text-violet-400",
    benefits: [
      "Everything in Legend",
      "Featured prominently across major projects",
      "Priority private support via X or Discord",
      "Open to deeper collaboration and partnership",
    ],
    description: "Support open source at an organizational level.",
    featured: true,
    id: "577335",
    name: "Ancient",
    price: 500,
  },
];
