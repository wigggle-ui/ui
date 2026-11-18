import { ArrowRightIcon } from "lucide-react";

import ElectricLogo from "@/components/electric-logo";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const WidgetDemo = () => (
  <Widget size="md" design="damn">
    <WidgetContent className="grid grid-cols-2 items-center">
      <div className="flex size-full items-center justify-start">
        <ElectricLogo
          className="me-auto -mt-0.5 w-max"
          src="/assets/logos/neon.svg"
          color="#37c38f"
          glowColor="#0b8f63"
          scale={0.65}
          strands={4}
          bend={0.6}
          crackle={1.5}
          arcs={1}
          speed={2.5}
          interactive
          intensity={1}
          glow={0.5}
          thickness={1}
          flicker={0.6}
          fill={0}
          cursorIntensity={0.75}
          cursorRadius={100}
        />
      </div>
      <div className="flex size-full flex-col items-start justify-between py-8 pe-4">
        <Text size="xl" weight="semibold">
          <span className="uppercase">50% OFF</span>
        </Text>
        <div className="space-y-1">
          <Text size="sm" weight="medium" variant="muted-foreground">
            $0.30 per GB-month on SCALE plans.
          </Text>
        </div>
        <Button size="sm">
          Claim Deal
          <ArrowRightIcon />
        </Button>
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
