"use client";

import { CheckIcon } from "lucide-react";
import * as React from "react";

import { Text } from "@/components/ui/text";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

type BillStatus = "overdue" | "soon" | "later";

const BILLS: {
  amount: number;
  due: string;
  name: string;
  status: BillStatus;
}[] = [
  { amount: 1200, due: "2 days overdue", name: "Rent", status: "overdue" },
  { amount: 15.99, due: "Tomorrow", name: "Netflix", status: "soon" },
  { amount: 86, due: "Fri, 28", name: "Electricity", status: "later" },
];

const STATUS_DOT: Record<BillStatus, string> = {
  later: "bg-muted-foreground",
  overdue: "bg-destructive",
  soon: "bg-vercel-yellow",
};

const format = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: value % 1 ? 2 : 0 })}`;

const WidgetDemo = () => {
  const [paid, setPaid] = React.useState<Set<string>>(new Set());

  const togglePaid = (name: string) => {
    setPaid((current) => {
      const next = new Set(current);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const total = BILLS.filter((bill) => !paid.has(bill.name)).reduce(
    (sum, bill) => sum + bill.amount,
    0
  );

  return (
    <Widget
      className="transition-all duration-300 hover:shadow-lg motion-safe:hover:-translate-y-1"
      design="mumbai"
      size="md"
    >
      <WidgetHeader className="items-center">
        <WidgetTitle>
          <Text variant="muted-foreground">
            {total === 0 ? "All paid 🎉" : "Upcoming bills"}
          </Text>
        </WidgetTitle>
        <span className="tabular-nums">
          <Text weight="semibold">{format(total)}</Text>
        </span>
      </WidgetHeader>
      <WidgetContent className="items-center">
        <ul className="flex w-full flex-col gap-1">
          {BILLS.map((bill) => {
            const isPaid = paid.has(bill.name);
            return (
              <li key={bill.name}>
                <button
                  aria-label={`${bill.name}, ${format(bill.amount)}, ${isPaid ? "paid" : "unpaid"}. Toggle paid.`}
                  aria-pressed={isPaid}
                  className="hover:bg-secondary flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 transition-all duration-200 active:scale-[0.98] motion-safe:hover:translate-x-1"
                  onClick={() => togglePaid(bill.name)}
                  type="button"
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`flex items-center justify-center rounded-full transition-all duration-300 ${isPaid ? "bg-productive size-4 scale-110" : `${STATUS_DOT[bill.status]} size-2`}`}
                    >
                      {isPaid && (
                        <CheckIcon className="size-3 stroke-2 text-white" />
                      )}
                    </span>
                    <Text
                      decoration={isPaid ? "cancelled" : undefined}
                      size="sm"
                      variant={isPaid ? "muted-foreground" : "default"}
                      weight="medium"
                    >
                      {bill.name}
                    </Text>
                    <Text
                      size="xs"
                      variant={
                        bill.status === "overdue" && !isPaid
                          ? "destructive"
                          : "muted-foreground"
                      }
                    >
                      {isPaid ? "Paid" : bill.due}
                    </Text>
                  </span>
                  <span className="tabular-nums">
                    <Text
                      decoration={isPaid ? "cancelled" : undefined}
                      size="sm"
                      variant={isPaid ? "muted-foreground" : "default"}
                    >
                      {format(bill.amount)}
                    </Text>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
