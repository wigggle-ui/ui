import { Icons } from "@/components/icons";
import type { SponsorType } from "@/types";

export const sponsors: SponsorType[] = [
  {
    logo: Icons.OpenPanel,
    name: "OpenPanel",
    tier: "platinum",
    url: "https://openpanel.dev?utm_source=wigggle-ui&utm_medium=sponsor&utm_campaign=website",
  },
  {
    logo: Icons.VercelOSS,
    name: "Vercel OSS Program",
    tier: "platinum",
    url: "https://vercel.com/oss?utm_source=wigggle-ui&utm_medium=sponsor&utm_campaign=website",
  },
];
