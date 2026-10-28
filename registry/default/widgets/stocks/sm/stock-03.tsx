import { EyeIcon, TriangleIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn, truncate } from "@/registry/default/lib/utils";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const stocks = [
  {
    company: "Apple Inc",
    difference: 4.26,
    isPositive: false,
    ticker: "AAPL",
    value: 262.24,
  },
  {
    company: "Amazon.com Inc.",
    difference: 7.7,
    isPositive: true,
    ticker: "AMZN",
    value: 187.24,
  },
  {
    company: "Alphabet Inc Class A",
    difference: 2.98,
    isPositive: true,
    ticker: "GOOGL",
    value: 290.24,
  },
];

const WidgetDemo = () => (
  <Widget design="mumbai">
    <WidgetHeader>
      <WidgetTitle>Watchlist</WidgetTitle>
      <EyeIcon className="size-4" />
    </WidgetHeader>
    <WidgetContent className="mt-0.5 flex-col items-start justify-start">
      {stocks.map((stock) => (
        <div
          key={stock.ticker}
          className="flex w-full items-center justify-between space-x-2 border-b py-1.5 last:border-b-0"
        >
          <div className="flex flex-col items-start gap-0">
            <Label size="sm">
              <TriangleIcon
                className={cn(
                  stock.isPositive
                    ? "fill-productive"
                    : "fill-destructive rotate-180",
                  "size-2 stroke-none"
                )}
              />
              {stock.ticker}
            </Label>
            <Label variant="muted-foreground" size="xs">
              {truncate(stock.company)}
            </Label>
          </div>
          <div className="flex flex-col items-end gap-0">
            <Label size="sm">{stock.value}</Label>
            <Label
              size="xs"
              variant={stock.isPositive ? "productive" : "destructive"}
            >
              {stock.isPositive ? "+" : "-"}
              {stock.difference}
            </Label>
          </div>
        </div>
      ))}
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
