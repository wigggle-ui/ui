import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const now = new Date();

const monthName = now.toLocaleDateString("en-US", { month: "long" });
const date = now.getDate();
const day = now.toLocaleDateString("en-US", { weekday: "short" });

const tomorrow = new Date(now.getTime() + 86_400_000);
const nextDate = tomorrow.getDate();
const nextDay = tomorrow.toLocaleDateString("en-US", { weekday: "short" });

const WidgetDemo = () => (
  <Widget size="lg" className="p-0">
    <WidgetHeader className="bg-destructive rounded-t-3xl p-4">
      <WidgetTitle className="w-max text-center text-2xl">
        {monthName}
      </WidgetTitle>
    </WidgetHeader>
    <WidgetContent className="flex flex-col justify-start gap-2 p-3">
      <div className="flex w-full items-start justify-start gap-4">
        <div className="flex flex-col items-center justify-center">
          <Text size="xxxl">{date}</Text>
          <Text size="sm" weight="light" className="text-center">
            {day}
          </Text>
        </div>
        <div className="w-full space-y-2">
          <div className="bg-secondary flex w-full items-center justify-between rounded-lg px-3 py-2">
            <div className="space-y-1">
              <Text size="sm">Vercel Stand Up</Text>
              <Text size="sm" variant="muted-foreground">
                California
              </Text>
            </div>
            <div className="flex flex-col items-end justify-end gap-1.5">
              <Text size="sm">09:00</Text>
              <Text size="sm" variant="muted-foreground">
                10:00
              </Text>
            </div>
          </div>
          <div className="bg-secondary flex w-full items-center justify-between rounded-lg px-3 py-2">
            <div className="space-y-1">
              <Text size="sm">Vercel Sit Down</Text>
              <Text size="sm" variant="muted-foreground">
                New York
              </Text>
            </div>
            <div className="flex flex-col items-end justify-end gap-1.5">
              <Text size="sm">12:00</Text>
              <Text size="sm" variant="muted-foreground">
                13:00
              </Text>
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex w-full items-start justify-start gap-4">
        <div className="flex flex-col items-center justify-center">
          <Text size="xxxl">{nextDate}</Text>
          <Text size="sm" weight="light" className="text-center">
            {nextDay}
          </Text>
        </div>
        <div className="w-full space-y-2">
          <div className="bg-secondary flex w-full items-center justify-between rounded-lg px-3 py-2">
            <div className="space-y-1">
              <Text size="sm">Vercel Dream</Text>
              <Text size="sm" variant="muted-foreground">
                Mumbai
              </Text>
            </div>
            <div className="flex flex-col items-end justify-end gap-1.5">
              <Text size="sm">22:00</Text>
              <Text size="sm" variant="muted-foreground">
                24:00
              </Text>
            </div>
          </div>
          <div className="bg-secondary flex w-full items-center justify-between rounded-lg px-3 py-2">
            <div className="space-y-1">
              <Text size="sm">Vercel Stand Up</Text>
              <Text size="sm" variant="muted-foreground">
                California
              </Text>
            </div>
            <div className="flex flex-col items-end justify-end gap-1.5">
              <Text size="sm">09:00</Text>
              <Text size="sm" variant="muted-foreground">
                10:00
              </Text>
            </div>
          </div>
        </div>
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
