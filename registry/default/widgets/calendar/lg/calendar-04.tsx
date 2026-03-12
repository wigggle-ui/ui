import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";
import { Label } from "@/registry/default/ui/label";
import { Separator } from "@/registry/default/ui/separator";

export default function WidgetDemo() {
  const now = new Date();

  const monthName = now.toLocaleDateString("en-US", { month: "long" });
  const date = now.getDate();
  const day = now.toLocaleDateString("en-US", { weekday: "short" });

  const tomorrow = new Date(now.getTime() + 86400000);
  const nextDate = tomorrow.getDate();
  const nextDay = tomorrow.toLocaleDateString("en-US", { weekday: "short" });

  return (
    <Widget size="lg" className="p-0">
      <WidgetHeader className="bg-destructive rounded-t-3xl p-4">
        <WidgetTitle className="w-max text-center text-2xl text-white">
          {monthName}
        </WidgetTitle>
      </WidgetHeader>
      <WidgetContent className="flex flex-col justify-start gap-4 p-4">
        <div className="flex w-full items-start justify-start gap-4">
          <div className="flex flex-col items-center justify-center">
            <Label className="text-3xl">{date}</Label>
            <Label className="text-center text-sm font-light">{day}</Label>
          </div>
          <div className="w-full space-y-2">
            <div className="bg-secondary flex w-full items-center justify-between rounded-lg px-3 py-2">
              <div className="space-y-1">
                <Label className="text-sm font-normal">Vercel Stand Up</Label>
                <Label className="text-muted-foreground">California</Label>
              </div>
              <div className="flex flex-col items-end justify-end gap-1.5">
                <Label>09:00</Label>
                <Label className="text-muted-foreground">10:00</Label>
              </div>
            </div>
            <div className="bg-secondary flex w-full items-center justify-between rounded-lg px-3 py-2">
              <div className="space-y-1">
                <Label className="text-sm font-normal">Vercel Sit Down</Label>
                <Label className="text-muted-foreground">New York</Label>
              </div>
              <div className="flex flex-col items-end justify-end gap-1.5">
                <Label>12:00</Label>
                <Label className="text-muted-foreground">13:00</Label>
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex w-full items-start justify-start gap-4">
          <div className="flex flex-col items-center justify-center">
            <Label className="text-3xl">{nextDate}</Label>
            <Label className="text-center text-sm font-light">{nextDay}</Label>
          </div>
          <div className="w-full space-y-2">
            <div className="bg-secondary flex w-full items-center justify-between rounded-lg px-3 py-2">
              <div className="space-y-1">
                <Label className="text-sm font-normal">Vercel Dream</Label>
                <Label className="text-muted-foreground">Mumbai</Label>
              </div>
              <div className="flex flex-col items-end justify-end gap-1.5">
                <Label>22:00</Label>
                <Label className="text-muted-foreground">24:00</Label>
              </div>
            </div>
            <div className="bg-secondary flex w-full items-center justify-between rounded-lg px-3 py-2">
              <div className="space-y-1">
                <Label className="text-sm font-normal">Vercel Stand Up</Label>
                <Label className="text-muted-foreground">California</Label>
              </div>
              <div className="flex flex-col items-end justify-end gap-1.5">
                <Label>09:00</Label>
                <Label className="text-muted-foreground">10:00</Label>
              </div>
            </div>
          </div>
        </div>
      </WidgetContent>
    </Widget>
  );
}
