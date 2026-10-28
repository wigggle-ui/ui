import WidgetCard from "@/components/widget-card";
import WidgetLoader from "@/components/widget-loader-client";
import { getWidgetsByNames } from "@/lib/utils";

const WidgetsDisplay = () => {
  const smWidgets = getWidgetsByNames([
    "calendar-sm-01",
    "dashboard-md-02",
    "dashboard-sm-01",
  ]);

  return (
    <div className="my-6 flex w-full flex-wrap items-center justify-center gap-6">
      {smWidgets.map((widget) => (
        <WidgetCard className="w-max" key={widget.name} widget={widget}>
          <WidgetLoader widget={widget} />
        </WidgetCard>
      ))}
    </div>
  );
};

export default WidgetsDisplay;
