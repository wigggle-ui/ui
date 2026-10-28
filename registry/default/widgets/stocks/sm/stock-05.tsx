import * as React from "react";

import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

interface Stock {
  logo: React.FC<React.SVGProps<SVGSVGElement>>;
  ticker: string;
  companyName: string;
  price: number;
}

const stocks: Stock[] = [
  {
    companyName: "Apple Inc.",
    logo: Icons.Apple,
    price: 262.82,
    ticker: "AAPL",
  },
  {
    companyName: "Salesforce, Inc.",
    logo: Icons.Salesforce,
    price: 307.46,
    ticker: "CRM",
  },
  {
    companyName: "Starbucks Corp.",
    logo: Icons.Starbucks,
    price: 86.09,
    ticker: "SBUX",
  },
  {
    companyName: "Tesla Inc.",
    logo: Icons.Tesla,
    price: 433.72,
    ticker: "TSLA",
  },
];

const WidgetDemo = () => (
  <Widget>
    <WidgetContent className="items-center">
      <div className="grid size-full grid-cols-2 items-center gap-6">
        {stocks.map(({ logo: Logo, ticker, price, companyName }) => (
          <Tooltip delayDuration={300} key={ticker}>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center justify-center gap-1">
                <Logo className="fill-foreground size-8 rounded-full" />
                <Label>${price}</Label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{companyName}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
