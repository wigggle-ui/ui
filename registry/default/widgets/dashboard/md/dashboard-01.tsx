import { Gauge, GaugeArc, GaugeTrack, GaugeValue } from "@/components/gauge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
} from "@/registry/default/ui/widget";

const dbInfo = [
  {
    label: "Database",
    value: "Neon Postgres",
  },
  {
    label: "Size",
    value: "128 MB",
  },
  {
    label: "Tables",
    value: "42",
  },
  {
    label: "Uptime",
    value: "3D 4H 21M",
  },
  {
    label: "QPS",
    value: "57",
  },
  {
    label: "Backup",
    value: "2025-11-06 02:13 UTC",
  },
];

const WidgetDemo = () => (
  <Widget design="mumbai" size="md" className="gap-3 pt-2">
    <WidgetContent className="justify-between gap-3">
      <div className="mt-2 flex h-full w-max flex-col items-center justify-center gap-3">
        <WidgetHeader className="bg-muted mx-auto w-max items-center justify-center rounded-md px-2 py-1">
          <p>wigggle_db</p>
        </WidgetHeader>
        <Gauge
          value={64}
          min={0}
          max={100}
          startAngle={180}
          endAngle={540}
          radius={30}
          padding={6}
          fit="content"
          transition={{ bounce: 0.1, type: "spring", visualDuration: 0.5 }}
        >
          <GaugeTrack
            width={4}
            color="var(--muted)"
            opacity={1}
            cap="round"
            offset={0}
          />
          <GaugeArc
            width={4}
            color="var(--primary)"
            opacity={1}
            cap="round"
            offset={0}
          />
          <GaugeValue
            x={0}
            y={0}
            fontSize={20}
            color="var(--foreground)"
            font="sans"
            weight="semibold"
            decimals={0}
          />
        </Gauge>
      </div>
      <div className="h-full w-full">
        <Table>
          <TableBody>
            {dbInfo.map((el) => (
              <TableRow key={el.label}>
                <TableCell>
                  <div className="text-muted-foreground -my-1">{el.label}</div>
                </TableCell>
                <TableCell>
                  <div className="-my-1 text-right">{el.value}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
