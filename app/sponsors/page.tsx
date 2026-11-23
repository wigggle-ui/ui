import CountUp from "@/components/count-up";
import PageHeader from "@/components/page-header";
import SponsorshipTiers from "@/components/sponsorship-tiers";
import { totalWidgetCount } from "@/config/widgets";

export const metadata = {
  description:
    "Support Wigggle UI and help keep its open-source widgets growing.",
  title: "Sponsors",
};

const reachStats = [
  {
    label: "Total Widgets",
    suffix: "",
    value: totalWidgetCount.toLocaleString(),
  },
  { label: "Monthly Visitors", suffix: "K+", value: "60" },
  { label: "Page Views", suffix: "K+", value: "150" },
];

const Page = () => (
  <div className="mx-auto max-w-7xl space-y-6">
    <PageHeader title="Sponsors">
      If you like what we&apos;re building, help us build more.
    </PageHeader>
    <hr />
    <section aria-labelledby="sponsor-reach-heading">
      <ul className="grid list-none grid-cols-3 gap-6">
        {reachStats.map(({ label, value, suffix }) => (
          <li className="p-1" key={label}>
            <div className="flex min-h-28 flex-col items-center justify-center gap-3 px-3">
              <h2 className="text-muted-foreground flex items-center justify-center gap-2 text-center font-mono text-sm font-medium tracking-wide uppercase">
                {label}
              </h2>
              <CountUp
                from={0}
                to={Number(value)}
                mode="roll"
                easing="expo"
                format="standard"
                direction="up"
                duration={1.5}
                delay={0}
                suffix={suffix}
                trigger="view"
                replayOnHover
                className="text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
    <hr />
    <SponsorshipTiers />
  </div>
);

export default Page;
