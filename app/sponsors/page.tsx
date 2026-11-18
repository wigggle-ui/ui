import PageHeader from "@/components/page-header";
import SponsorshipTiers from "@/components/sponsorship-tiers";
import { totalWidgetCount } from "@/config/widgets";

export const metadata = {
  description:
    "Support Wigggle UI and help keep its open-source widgets growing.",
  title: "Sponsors",
};

const reachStats = [
  { label: "Total Widgets", value: totalWidgetCount.toLocaleString() },
  { label: "Monthly Visitors", value: "60K+ " },
  { label: "Page Views", value: "150K+" },
];

const Page = () => (
  <main className="mx-auto max-w-7xl space-y-6">
    <PageHeader title="Sponsors">
      Help keep Wigggle UI free and open source for developers everywhere.
    </PageHeader>
    <hr />
    <section aria-labelledby="sponsor-reach-heading">
      <ul className="grid list-none gap-6 sm:grid-cols-3">
        {reachStats.map(({ label, value }) => (
          <li className="p-1" key={label}>
            <div className="flex min-h-28 flex-col items-center justify-center gap-3 px-3">
              <h2 className="text-muted-foreground flex items-center justify-center gap-2 font-mono text-sm font-medium tracking-wide uppercase">
                {label}
              </h2>
              <p className="text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
                {value}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
    <hr />
    <SponsorshipTiers />
  </main>
);

export default Page;
