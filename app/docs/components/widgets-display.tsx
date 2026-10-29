import WidgetCard from "@/components/widget-card";
import WidgetLoader from "@/components/widget-loader-client";
import { getWidgetsByNames } from "@/lib/utils";

// oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The preview strip needs focus for keyboard scrolling.
const WidgetsDisplay = () => {
  const smWidgets = getWidgetsByNames([
    "calendar-sm-01",
    "dashboard-md-02",
    "dashboard-sm-01",
  ]);

  return (
    <section
      aria-label="Widget previews"
      className="my-6 flex w-full min-w-0 flex-nowrap items-center justify-start gap-6 overflow-x-auto overscroll-x-contain sm:flex-wrap sm:justify-center sm:overflow-visible"
      tabIndex={0}
    >
      {smWidgets.map((widget) => (
        <WidgetCard
          className="w-max shrink-0"
          key={widget.name}
          widget={widget}
        >
          <WidgetLoader widget={widget} />
        </WidgetCard>
      ))}
    </section>
  );
};
// oxlint-enable jsx-a11y/no-noninteractive-tabindex

export default WidgetsDisplay;
