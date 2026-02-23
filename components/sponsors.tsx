import Link from "next/link";

import { Card, CardHeader } from "@/components/ui/card";
import { SponsorType } from "@/types";
import { sponsors } from "@/constants/sponsors";

export default function Sponsors() {
  return (
    <section className="relative overflow-hidden py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
            Powered by the Best
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Your support helps Wigggle UI continuously improve for the
            community.
          </p>
        </div>
        <div className="mx-auto grid max-w-sm gap-6 *:text-center @min-4xl:max-w-full @min-4xl:grid-cols-3">
          {sponsors.map((el: SponsorType) => (
            <SponsorCard key={el.name} {...el} />
          ))}
        </div>
      </div>
    </section>
  );
}

const SponsorCard = ({ name, url, logo: Logo, tier }: SponsorType) => {
  return (
    <Link href={url} target="_blank">
      <Card className="group shadow-zinc-950/5">
        <CardHeader>
          <Logo className="mx-auto" />
        </CardHeader>
      </Card>
    </Link>
  );
};
