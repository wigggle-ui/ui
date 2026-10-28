// SM
import CalendarLg01 from "@/registry/default/widgets/calendar/lg/calendar-01";
import CalendarLg02 from "@/registry/default/widgets/calendar/lg/calendar-02";
import CalendarLg06 from "@/registry/default/widgets/calendar/lg/calendar-06";
import CalendarMd01 from "@/registry/default/widgets/calendar/md/calendar-01";
import CalendarMd06 from "@/registry/default/widgets/calendar/md/calendar-06";
import CalendarSm01 from "@/registry/default/widgets/calendar/sm/calendar-01";
import CalendarSm04 from "@/registry/default/widgets/calendar/sm/calendar-04";
import CalendarSm06 from "@/registry/default/widgets/calendar/sm/calendar-06";
import CalendarSm09 from "@/registry/default/widgets/calendar/sm/calendar-08";
import ClockSm04 from "@/registry/default/widgets/clock/sm/clock-04";
import ClockSm05 from "@/registry/default/widgets/clock/sm/clock-05";
import ClockSm11 from "@/registry/default/widgets/clock/sm/clock-11";
import ClockSm12 from "@/registry/default/widgets/clock/sm/clock-12";
import ClockSm13 from "@/registry/default/widgets/clock/sm/clock-13";
import DashboardLg01 from "@/registry/default/widgets/dashboard/lg/dashboard-01";
import DashboardLg02 from "@/registry/default/widgets/dashboard/lg/dashboard-02";
import DashboardMd02 from "@/registry/default/widgets/dashboard/md/dashboard-02";
import DashboardSm04 from "@/registry/default/widgets/dashboard/sm/dashboard-04";
import DashboardSm05 from "@/registry/default/widgets/dashboard/sm/dashboard-05";
import DashboardSm06 from "@/registry/default/widgets/dashboard/sm/dashboard-06";
import MediaMd01 from "@/registry/default/widgets/media/md/media-01";
import MediaMd03 from "@/registry/default/widgets/media/md/media-03";
// MD
import MediaSm02 from "@/registry/default/widgets/media/sm/media-02";
import MediaSm06 from "@/registry/default/widgets/media/sm/media-06";
import ProductivityMd02 from "@/registry/default/widgets/productivity/md/productivity-02";
import ProductivityMd04 from "@/registry/default/widgets/productivity/md/productivity-04";
import ProductivitySm01 from "@/registry/default/widgets/productivity/sm/productivity-01";
import ProductivitySm02 from "@/registry/default/widgets/productivity/sm/productivity-02";
import ProductivitySm04 from "@/registry/default/widgets/productivity/sm/productivity-04";
// LG
import SportsSm02 from "@/registry/default/widgets/sports/sm/sports-02";
import SportsSm05 from "@/registry/default/widgets/sports/sm/sports-05";
import StocksSm01 from "@/registry/default/widgets/stocks/sm/stock-01";
import StocksSm04 from "@/registry/default/widgets/stocks/sm/stock-04";
import type { WidgetEntryType } from "@/types";

export const SM_WIDGETS: WidgetEntryType[] = [
  {
    key: "calendar-sm-01",
    widget: <CalendarSm01 />,
  },
  {
    key: "calendar-sm-04",
    widget: <CalendarSm04 />,
  },
  {
    key: "calendar-sm-06",
    widget: <CalendarSm06 />,
  },
  {
    key: "calendar-sm-09",
    widget: <CalendarSm09 />,
  },
  {
    key: "clock-sm-04",
    widget: <ClockSm04 />,
  },
  {
    key: "clock-sm-05",
    widget: <ClockSm05 />,
  },
  {
    key: "clock-sm-11",
    widget: <ClockSm11 />,
  },
  {
    key: "clock-sm-12",
    widget: <ClockSm12 />,
  },
  {
    key: "clock-sm-13",
    widget: <ClockSm13 />,
  },
  {
    key: "dashboard-sm-04",
    widget: <DashboardSm04 />,
  },
  {
    key: "dashboard-sm-05",
    widget: <DashboardSm05 />,
  },
  {
    key: "dashboard-sm-06",
    widget: <DashboardSm06 />,
  },
  {
    key: "media-sm-02",
    widget: <MediaSm02 />,
  },
  {
    key: "media-sm-06",
    widget: <MediaSm06 />,
  },
  {
    key: "productivity-sm-01",
    widget: <ProductivitySm01 />,
  },
  {
    key: "productivity-sm-02",
    widget: <ProductivitySm02 />,
  },
  {
    key: "productivity-sm-04",
    widget: <ProductivitySm04 />,
  },
  {
    key: "sports-sm-02",
    widget: <SportsSm02 />,
  },
  {
    key: "sports-sm-05",
    widget: <SportsSm05 />,
  },
  {
    key: "stocks-sm-01",
    widget: <StocksSm01 />,
  },
  {
    key: "stocks-sm-04",
    widget: <StocksSm04 />,
  },
];

export const MD_WIDGETS: WidgetEntryType[] = [
  {
    key: "calendar-md-01",
    widget: <CalendarMd01 />,
  },
  {
    key: "calendar-md-06",
    widget: <CalendarMd06 />,
  },
  {
    key: "dashboard-md-02",
    widget: <DashboardMd02 />,
  },
  {
    key: "media-md-01",
    widget: <MediaMd01 />,
  },
  {
    key: "media-md-03",
    widget: <MediaMd03 />,
  },
  {
    key: "productivity-md-02",
    widget: <ProductivityMd02 />,
  },
  {
    key: "productivity-md-04",
    widget: <ProductivityMd04 />,
  },
];

export const LG_WIDGETS: WidgetEntryType[] = [
  {
    key: "calendar-lg-01",
    widget: <CalendarLg01 />,
  },
  {
    key: "dashboard-lg-01",
    widget: <DashboardLg01 />,
  },
  {
    key: "calendar-lg-02",
    widget: <CalendarLg02 />,
  },
  {
    key: "dashboard-lg-02",
    widget: <DashboardLg02 />,
  },
  {
    key: "calendar-lg-06",
    widget: <CalendarLg06 />,
  },
];
