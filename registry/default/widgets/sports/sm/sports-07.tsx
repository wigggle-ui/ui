import { cn } from "cn";
import Image from "next/image";

import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
} from "@/registry/default/ui/widget";

const scores = [
  {
    five_score: 17,
    four_score: 26,
    one_score: 27,
    teamAbbr: "GSW",
    teamName: "Golden State Warriors",
    three_score: 33,
    two_score: 34,
  },
  {
    five_score: 11,
    four_score: 26,
    one_score: 31,
    teamAbbr: "DN",
    teamName: "Denver Nuggets",
    three_score: 24,
    two_score: 39,
  },
];

const classes = {
  cell: "w-1 text-center",
  head: "w-1 text-center",
};

const WidgetDemo = () => (
  <Widget design="mumbai">
    <WidgetHeader className="mt-1.5">
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2">
          <Image
            className="size-8 rounded-full"
            src="/assets/logos/gsw.png"
            alt="GSW"
            width={20}
            height={20}
          />
          <Label size="xl">131</Label>
        </div>
        <div className="flex items-center gap-2">
          <Label size="xl">129</Label>
          <Image
            className="size-8 rounded-full"
            src="/assets/logos/dn.png"
            alt="DN"
            width={20}
            height={20}
          />
        </div>
      </div>
    </WidgetHeader>
    <WidgetContent className="flex-col items-center justify-end gap-2">
      <div className="[&>div[data-slot=table-container]]:no-scrollbar w-full min-w-0">
        <Table className="min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead className={cn(classes.head, "w-1 text-start")}>
                <span className="text-muted-foreground">Team</span>
              </TableHead>
              <TableHead className={classes.head}>
                <span className="text-muted-foreground">1</span>
              </TableHead>
              <TableHead className={classes.head}>
                <span className="text-muted-foreground">2</span>
              </TableHead>
              <TableHead className={classes.head}>
                <span className="text-muted-foreground">3</span>
              </TableHead>
              <TableHead className={classes.head}>
                <span className="text-muted-foreground">4</span>
              </TableHead>
              <TableHead className={classes.head}>
                <span className="text-muted-foreground">5</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((el, i) => (
              <TableRow key={i}>
                <TableCell className={cn(classes.head, "w-1 text-start")}>
                  {el.teamAbbr}
                </TableCell>
                <TableCell className={classes.cell}>{el.one_score}</TableCell>
                <TableCell className={classes.cell}>{el.two_score}</TableCell>
                <TableCell className={classes.cell}>{el.three_score}</TableCell>
                <TableCell className={classes.cell}>{el.four_score}</TableCell>
                <TableCell className={classes.cell}>{el.five_score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
