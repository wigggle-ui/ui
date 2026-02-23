import { Icons } from "@/registry/default/ui/icons";
import { SponsorType } from "@/types";

export const sponsors: SponsorType[] = [
  {
    name: "OpenPanel",
    url: "https://openpanel.dev?utm_source=wigggle-ui&utm_medium=sponsor&utm_campaign=website",
    logo: Icons.openPanel,
    tier: "platinum",
  },
  {
    name: "Vercel OSS Program",
    url: "https://vercel.com/oss?utm_source=wigggle-ui&utm_medium=sponsor&utm_campaign=website",
    logo: Icons.vercelOSS,
    tier: "platinum",
  },
];
