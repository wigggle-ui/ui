import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sponsorshipTiers } from "@/constants/sponsorship-tiers";

const SponsorshipTiers = () => (
  <section aria-labelledby="sponsorship-heading" className="space-y-5">
    <div className="space-y-2">
      <h2
        className="text-2xl font-semibold tracking-tight"
        id="sponsorship-heading"
      >
        Choose your level of support
      </h2>
      <p className="text-muted-foreground text-sm sm:text-base">
        Every tier is monthly and helps keep Wigggle UI free and open source.
      </p>
    </div>

    <ul className="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sponsorshipTiers.map((tier) => (
        <li key={tier.id}>
          <Card className="h-full">
            <CardHeader>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>
                    <span className={tier.accent}>{tier.name}</span>
                  </CardTitle>
                  {tier.featured && (
                    <span className="bg-primary text-primary-foreground rounded-full px-2.5 py-1 text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <CardDescription>{tier.description}</CardDescription>
                <p className="flex items-baseline gap-1 pt-2">
                  <span className="text-4xl font-semibold tracking-tight">
                    ${tier.price}
                  </span>
                  <span className="text-muted-foreground text-sm">/ month</span>
                </p>
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="space-y-3 border-t pt-5">
                {tier.benefits.map((benefit) => (
                  <li
                    className="flex items-start gap-2.5 text-sm leading-5"
                    key={benefit}
                  >
                    <Check
                      aria-hidden="true"
                      className={`mt-0.5 size-4 shrink-0 ${tier.accent}`}
                    />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                asChild
                className="w-full justify-between"
                variant={tier.featured ? "default" : "outline"}
              >
                <Link
                  aria-label={`Sponsor at $${tier.price} per month: ${tier.name}`}
                  href={`https://github.com/sponsors/henilshahdev/sponsorships?tier_id=${tier.id}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Choose {tier.name}
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </li>
      ))}
    </ul>
  </section>
);

export default SponsorshipTiers;
