import {
  BookOpenTextIcon,
  CalendarIcon,
  ChartNoAxesCombinedIcon,
  CirclePlayIcon,
  Clock3Icon,
  CloudSunIcon,
  Gamepad2Icon,
  GoalIcon,
  IndianRupeeIcon,
  LayoutDashboardIcon,
  LayoutGridCirclesIcon,
  ScrollTextIcon,
  SpeechIcon,
  TrophyIcon,
} from "lucide-react";

import { Icons } from "@/components/icons";
import type { LinkItem } from "@/types";

export const MENU_LINKS: LinkItem[] = [
  {
    href: "/",
    icon: <Icons.Logo />,
    shortcut: "GH",
    title: "Home",
  },
  {
    href: "/docs",
    icon: <BookOpenTextIcon />,
    shortcut: "GD",
    title: "Docs",
  },
  {
    href: "/widgets",
    icon: <LayoutGridCirclesIcon />,
    shortcut: "GW",
    title: "Widgets",
  },
  {
    href: "/playground",
    icon: <Gamepad2Icon />,
    shortcut: "GP",
    title: "Playground",
  },
  {
    href: "/sponsors",
    icon: <IndianRupeeIcon />,
    shortcut: "GS",
    title: "Sponsors",
  },
  {
    href: "/testimonials",
    icon: <SpeechIcon />,
    shortcut: "GT",
    title: "Testimonials",
  },
  {
    href: "/changelog",
    icon: <ScrollTextIcon />,
    shortcut: "GC",
    title: "Changelog",
  },
];

export const WIDGET_CATEGORY_LINKS: LinkItem[] = [
  {
    href: "/widgets/calendar",
    icon: <CalendarIcon />,
    title: "Calendar",
  },
  {
    href: "/widgets/clock",
    icon: <Clock3Icon />,
    title: "Clock",
  },
  {
    href: "/widgets/dashboard",
    icon: <LayoutDashboardIcon />,
    title: "Dashboard",
  },
  {
    href: "/widgets/media",
    icon: <CirclePlayIcon />,
    title: "Media",
  },
  {
    href: "/widgets/productivity",
    icon: <GoalIcon />,
    title: "Productivity",
  },
  {
    href: "/widgets/sports",
    icon: <TrophyIcon />,
    title: "Sports",
  },
  {
    href: "/widgets/stocks",
    icon: <ChartNoAxesCombinedIcon />,
    title: "Stocks",
  },
  {
    href: "/widgets/weather",
    icon: <CloudSunIcon />,
    title: "Weather",
  },
];

export const SOCIAL_LINKS: LinkItem[] = [
  {
    href: "https://x.com/henil106",
    icon: <Icons.X />,
    title: "X",
  },
  {
    href: "https://github.com/henilshahdev",
    icon: <Icons.GitHub />,
    title: "GitHub",
  },
  {
    href: "https://linkedin.com/in/henilshahdev",
    icon: <Icons.Apple />,
    title: "LinkedIn",
  },
];
