export interface WidgetEntryType {
  key: string;
  widget: React.ReactElement;
}

export interface WidgetCreditType {
  name: string;
  homepage: string;
  url: string;
  logo: string;
}

export interface SponsorType {
  name: string;
  url: string;
  logo: (props: React.ComponentProps<"svg">) => React.ReactElement;
  tier?: "platinum" | "gold" | "silver" | "bronze";
}

export interface LinkItem {
  title: string;
  href: string;
  icon?: React.ReactElement;
  shortcut?: string;
  openInNewTab?: boolean;
}
