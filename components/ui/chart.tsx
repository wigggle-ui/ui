"use client";

import { cn } from "cn";
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import type { TooltipValueType } from "recharts";

const INITIAL_DIMENSION = { height: 200, width: 320 } as const;
type TooltipNameType = number | string;
type ChartTheme = "dark" | "light";
type TooltipItem = NonNullable<
  RechartsPrimitive.DefaultTooltipContentProps<
    TooltipValueType,
    TooltipNameType
  >["payload"]
>[number];

type ChartColorVariable = [name: string, value: string];

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<ChartTheme, string> }
  )
>;

interface ChartContextProps {
  config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextProps | null>(null);

const useChart = () => {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
};

const getChartColorVariables = (
  chartConfig: ChartConfig
): ChartColorVariable[] =>
  Object.entries(chartConfig).flatMap(([key, itemConfig]) => {
    if (!/^[\w-]+$/u.test(key)) {
      return [];
    }

    if (itemConfig.theme) {
      return [
        [
          `--color-${key}`,
          `light-dark(${itemConfig.theme.light}, ${itemConfig.theme.dark})`,
        ],
      ];
    }

    return itemConfig.color ? [[`--color-${key}`, itemConfig.color]] : [];
  });

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorVariableNames = React.useRef<string[]>([]);

  const setChartRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      const target = element?.parentElement;

      if (!target) {
        return;
      }

      for (const variableName of colorVariableNames.current) {
        target.style.removeProperty(variableName);
      }

      const colorVariables = getChartColorVariables(config);

      for (const [variableName, color] of colorVariables) {
        target.style.setProperty(variableName, color);
      }

      colorVariableNames.current = colorVariables.map(([name]) => name);
    },
    [config]
  );

  return <div ref={setChartRef} data-chart={id} className="hidden" />;
};

const ChartContainer = ({
  id,
  className,
  children,
  config,
  style,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
  initialDimension?: {
    width: number;
    height: number;
  };
}) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replaceAll(":", "")}`;
  const contextValue = React.useMemo(() => ({ config }), [config]);

  return (
    <ChartContext.Provider value={contextValue}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs scheme-light dark:scheme-dark [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        style={style}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <div className="size-full">
          <RechartsPrimitive.ResponsiveContainer
            initialDimension={initialDimension}
          >
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        </div>
      </div>
    </ChartContext.Provider>
  );
};

const getPayloadConfigFromPayload = (
  config: ChartConfig,
  payload: unknown,
  key: string
) => {
  if (typeof payload !== "object" || payload === null) {
    return;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
};

const ChartTooltip = RechartsPrimitive.Tooltip;

interface ChartTooltipItemProps {
  item: TooltipItem;
  config: ChartConfig;
  index: number;
  nameKey?: string;
  color?: string;
  indicator: "line" | "dot" | "dashed";
  hideIndicator: boolean;
  nestLabel: boolean;
  tooltipLabel: React.ReactNode;
  formatter?: React.ComponentProps<
    typeof RechartsPrimitive.Tooltip
  >["formatter"];
}

interface ChartTooltipIndicatorProps {
  icon?: React.ComponentType;
  hideIndicator: boolean;
  indicator: "line" | "dot" | "dashed";
  indicatorColor: string | undefined;
  nestLabel: boolean;
}

const ChartTooltipIndicator = ({
  icon: Icon,
  hideIndicator,
  indicator,
  indicatorColor,
  nestLabel,
}: ChartTooltipIndicatorProps) => {
  if (Icon) {
    return <Icon />;
  }

  if (hideIndicator) {
    return null;
  }

  return (
    <div
      className={cn(
        "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
        {
          "h-2.5 w-2.5": indicator === "dot",
          "my-0.5": nestLabel && indicator === "dashed",
          "w-0 border-[1.5px] border-dashed bg-transparent":
            indicator === "dashed",
          "w-1": indicator === "line",
        }
      )}
      style={
        {
          "--color-bg": indicatorColor,
          "--color-border": indicatorColor,
        } as React.CSSProperties
      }
    />
  );
};

interface ChartTooltipDetailsProps {
  item: TooltipItem;
  itemLabel: React.ReactNode;
  nestLabel: boolean;
  tooltipLabel: React.ReactNode;
}

const ChartTooltipDetails = ({
  item,
  itemLabel,
  nestLabel,
  tooltipLabel,
}: ChartTooltipDetailsProps) => (
  <div
    className={cn(
      "flex flex-1 justify-between leading-none",
      nestLabel ? "items-end" : "items-center"
    )}
  >
    <div className="grid gap-1.5">
      {nestLabel ? tooltipLabel : null}
      <span className="text-muted-foreground">{itemLabel}</span>
    </div>
    {item.value !== null && item.value !== undefined && (
      <span className="text-foreground font-mono font-medium tabular-nums">
        {typeof item.value === "number"
          ? item.value.toLocaleString()
          : String(item.value)}
      </span>
    )}
  </div>
);

const ChartTooltipItem = ({
  item,
  config,
  index,
  nameKey,
  color,
  indicator,
  hideIndicator,
  nestLabel,
  tooltipLabel,
  formatter,
}: ChartTooltipItemProps) => {
  const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`;
  const itemConfig = getPayloadConfigFromPayload(config, item, key);
  const indicatorColor = color ?? item.payload?.fill ?? item.color;

  return (
    <div
      className={cn(
        "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
        indicator === "dot" && "items-center"
      )}
    >
      {formatter && item.value !== undefined && item.name ? (
        formatter(item.value, item.name, item, index, item.payload)
      ) : (
        <>
          <ChartTooltipIndicator
            icon={itemConfig?.icon}
            hideIndicator={hideIndicator}
            indicator={indicator}
            indicatorColor={indicatorColor}
            nestLabel={nestLabel}
          />
          <ChartTooltipDetails
            item={item}
            itemLabel={itemConfig?.label ?? item.name}
            nestLabel={nestLabel}
            tooltipLabel={tooltipLabel}
          />
        </>
      )}
    </div>
  );
};

const ChartTooltipContent = ({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<
      TooltipValueType,
      TooltipNameType
    >,
    "accessibilityLayer"
  >) => {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>;
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);

  if (!active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-32 items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {nestLabel ? null : tooltipLabel}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => (
            <ChartTooltipItem
              key={`${item.dataKey ?? item.name ?? "value"}-${index}`}
              item={item}
              config={config}
              index={index}
              nameKey={nameKey}
              color={color}
              indicator={indicator}
              hideIndicator={hideIndicator}
              nestLabel={nestLabel}
              tooltipLabel={tooltipLabel}
              formatter={formatter}
            />
          ))}
      </div>
    </div>
  );
};

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = ({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> & {
  hideIcon?: boolean;
  nameKey?: string;
} & RechartsPrimitive.DefaultLegendContentProps) => {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item, index) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={index}
              className={cn(
                "[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px] bg-(--color-indicator)"
                  style={
                    { "--color-indicator": item.color } as React.CSSProperties
                  }
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
};

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
