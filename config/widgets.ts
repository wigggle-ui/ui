import type { LucideProps } from "lucide-react";
import {
  CalendarIcon,
  ChartNoAxesCombinedIcon,
  CirclePlayIcon,
  Clock3Icon,
  CloudSunIcon,
  GoalIcon,
  LayoutDashboardIcon,
  TrophyIcon,
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export interface WidgetCategory {
  slug: string;
  name: string;
  widgets: {
    sm: {
      name: string;
    }[];
    md?: {
      name: string;
    }[];
    lg?: {
      name: string;
    }[];
  };
  isNew?: boolean;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export const categories: WidgetCategory[] = [
  {
    icon: CalendarIcon,
    isNew: true,
    name: "Calendar",
    slug: "calendar",
    widgets: {
      lg: [
        { name: "calendar-lg-01" },
        { name: "calendar-lg-02" },
        { name: "calendar-lg-03" },
        { name: "calendar-lg-04" },
        { name: "calendar-lg-05" },
        { name: "calendar-lg-06" },
      ],
      md: [
        { name: "calendar-md-01" },
        { name: "calendar-md-02" },
        { name: "calendar-md-03" },
        { name: "calendar-md-04" },
        { name: "calendar-md-05" },
        { name: "calendar-md-06" },
      ],
      sm: [
        { name: "calendar-sm-01" },
        { name: "calendar-sm-02" },
        { name: "calendar-sm-03" },
        { name: "calendar-sm-04" },
        { name: "calendar-sm-05" },
        { name: "calendar-sm-06" },
        { name: "calendar-sm-07" },
        { name: "calendar-sm-08" },
        { name: "calendar-sm-09" },
      ],
    },
  },
  {
    icon: Clock3Icon,
    name: "Clock",
    slug: "clock",
    widgets: {
      lg: [],
      md: [],
      sm: [
        { name: "clock-sm-01" },
        { name: "clock-sm-02" },
        { name: "clock-sm-03" },
        { name: "clock-sm-04" },
        { name: "clock-sm-05" },
        { name: "clock-sm-06" },
        { name: "clock-sm-07" },
        { name: "clock-sm-08" },
        { name: "clock-sm-09" },
        { name: "clock-sm-10" },
        { name: "clock-sm-11" },
        { name: "clock-sm-12" },
        { name: "clock-sm-13" },
      ],
    },
  },
  {
    icon: LayoutDashboardIcon,
    name: "Dashboard",
    slug: "dashboard",
    widgets: {
      lg: [{ name: "dashboard-lg-01" }, { name: "dashboard-lg-02" }],
      md: [{ name: "dashboard-md-01" }, { name: "dashboard-md-02" }],
      sm: [
        { name: "dashboard-sm-01" },
        { name: "dashboard-sm-02" },
        { name: "dashboard-sm-03" },
        { name: "dashboard-sm-04" },
        { name: "dashboard-sm-05" },
        { name: "dashboard-sm-06" },
        { name: "dashboard-sm-07" },
      ],
    },
  },
  {
    icon: CirclePlayIcon,
    name: "Media",
    slug: "media",
    widgets: {
      md: [
        { name: "media-md-01" },
        { name: "media-md-02" },
        { name: "media-md-03" },
        { name: "media-md-04" },
        { name: "media-md-05" },
      ],
      sm: [
        { name: "media-sm-01" },
        { name: "media-sm-02" },
        { name: "media-sm-03" },
        { name: "media-sm-04" },
        { name: "media-sm-05" },
        { name: "media-sm-06" },
        { name: "media-sm-07" },
        { name: "media-sm-08" },
      ],
    },
  },
  {
    icon: GoalIcon,
    name: "Productivity",
    slug: "productivity",
    widgets: {
      md: [
        { name: "productivity-md-01" },
        { name: "productivity-md-02" },
        { name: "productivity-md-03" },
        { name: "productivity-md-04" },
      ],
      sm: [
        { name: "productivity-sm-01" },
        { name: "productivity-sm-02" },
        { name: "productivity-sm-03" },
        { name: "productivity-sm-04" },
        { name: "productivity-sm-05" },
        { name: "productivity-sm-06" },
        { name: "productivity-sm-07" },
      ],
    },
  },
  {
    icon: TrophyIcon,
    name: "Sports",
    slug: "sports",
    widgets: {
      lg: [],
      md: [],
      sm: [
        { name: "sports-sm-01" },
        { name: "sports-sm-02" },
        { name: "sports-sm-03" },
        { name: "sports-sm-04" },
        { name: "sports-sm-05" },
        { name: "sports-sm-06" },
        { name: "sports-sm-07" },
      ],
    },
  },
  {
    icon: ChartNoAxesCombinedIcon,
    name: "Stocks",
    slug: "stocks",
    widgets: {
      lg: [],
      md: [],
      sm: [
        { name: "stock-sm-01" },
        { name: "stock-sm-02" },
        { name: "stock-sm-03" },
        { name: "stock-sm-04" },
        { name: "stock-sm-05" },
        { name: "stock-sm-06" },
      ],
    },
  },

  {
    icon: CloudSunIcon,
    name: "Weather",
    slug: "weather",
    widgets: {
      lg: [],
      md: [{ name: "weather-md-01" }, { name: "weather-md-02" }],
      sm: [
        { name: "weather-sm-01" },
        { name: "weather-sm-02" },
        { name: "weather-sm-03" },
        { name: "weather-sm-04" },
        { name: "weather-sm-05" },
        { name: "weather-sm-06" },
        { name: "weather-sm-07" },
        { name: "weather-sm-08" },
        { name: "weather-sm-09" },
      ],
    },
  },
];

export const getWidgetCount = (category: WidgetCategory): number =>
  category.widgets.sm.length +
  (category.widgets.md?.length ?? 0) +
  (category.widgets.lg?.length ?? 0);

export const totalWidgetCount = categories.reduce(
  (total, category) => total + getWidgetCount(category),
  0
);

export const getCategory = (slug: string): WidgetCategory | undefined =>
  categories.find((category) => category.slug === slug);
