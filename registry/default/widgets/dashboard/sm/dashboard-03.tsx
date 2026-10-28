import { MoveDownIcon, MoveUpIcon } from "lucide-react";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const visitors = [
  {
    count: 54,
    day: "Today",
    hasGrown: true,
  },
  {
    count: 374,
    day: "7 days",
    hasGrown: false,
  },
  {
    count: 1498,
    day: "30 days",
    hasGrown: true,
  },
  {
    count: 1498,
    day: "90 days",
    hasGrown: true,
  },
];

const WidgetDemo = () => (
  <Widget className="gap-3" design="mumbai">
    <WidgetHeader>
      <WidgetTitle className="w-full text-center">acme.com</WidgetTitle>
    </WidgetHeader>
    <WidgetContent>
      <Table className="w-full">
        <TableBody>
          {visitors.map((visitor) => (
            <TableRow key={visitor.day}>
              <TableCell>
                <div className="text-muted-foreground -my-0.5 font-medium">
                  {visitor.day}
                </div>
              </TableCell>
              <TableCell>
                <div className="-my-0.5 flex items-center justify-end gap-1.5 text-right">
                  {visitor.count}
                  {visitor.hasGrown ? (
                    <MoveUpIcon
                      className="stroke-productive size-4"
                      strokeWidth={3}
                    />
                  ) : (
                    <MoveDownIcon
                      className="stroke-destructive size-4"
                      strokeWidth={3}
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
