import Link from "next/link";

import { CodeBlockCommand } from "@/components/code-block-command";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import WidgetMarquee from "@/components/widget-marquee";
import convertNpmCommand from "@/lib/convert-npm-command";

const Home = () => (
  <div className="grid min-h-0 w-full grid-rows-[auto_1fr] gap-6">
    <div className="space-y-6">
      <PageHeader title="The first ever collection of Widgets for the Web.">
        An open-source curated collection of copy-paste widgets for your next
        project.
      </PageHeader>
      <div className="mx-auto w-max min-w-xl">
        <CodeBlockCommand
          {...convertNpmCommand("npx shadcn@latest add @wigggleui/widget")}
        />
      </div>
      <div className="flex items-center justify-center gap-6">
        <Button asChild>
          <Link href="/widgets">Explore Widgets</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/docs">View Docs</Link>
        </Button>
      </div>
    </div>
    <div className="mx-auto w-full min-w-0 overflow-hidden">
      <WidgetMarquee />
    </div>
  </div>
);

export default Home;
