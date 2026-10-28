import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import PageHeader from "@/components/page-header";
import WidgetCard from "@/components/widget-card";
import WidgetInfo from "@/components/widget-info";
import { categories, getCategory } from "@/config/widgets";
import { getWidgetInfo } from "@/lib/get-widget-info";
import { getWidgetsByNames } from "@/lib/utils";

interface PageProps {
  params: Promise<{ category: string }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);

  if (!category) {
    return {};
  }

  return {
    description: `Ready to use ${category.name} widgets for your next web project.`,
    title: `${category.name} widgets ~ Wigggle UI`,
  };
};

export const generateStaticParams = () =>
  categories.map((category) => ({
    category: category.slug,
  }));

const CategoryContent = async ({ params }: PageProps) => {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const smWidgets = getWidgetsByNames(
    category.widgets.sm.map((item) => item.name)
  );
  const mdWidgets = getWidgetsByNames(
    category.widgets.md?.map((item) => item.name) ?? []
  );
  const lgWidgets = getWidgetsByNames(
    category.widgets.lg?.map((item) => item.name) ?? []
  );

  const allWidgets = [...smWidgets, ...mdWidgets, ...lgWidgets];

  const widgetInfos = await Promise.all(
    allWidgets.map((widget) => getWidgetInfo(widget))
  );

  return (
    <div className="grid h-full min-h-0 w-full grid-rows-[auto_minmax(0,1fr)] gap-12">
      <PageHeader title={`${category.name} Widgets`}>
        A collection of {category.name} widgets from Wigggle UI.
      </PageHeader>
      <div className="page-grid -m-px grid min-h-0 w-full grid-cols-12 overflow-y-auto *:px-1 *:py-12 sm:*:px-8 xl:*:px-12">
        {widgetInfos.map((info, index) => {
          if (!info) {
            return null;
          }
          const widget = allWidgets[index];
          return (
            <WidgetCard key={widget.name} widget={widget}>
              {info.preview}
              <WidgetInfo
                widget={widget}
                preview={info.preview}
                code={info.code}
              />
            </WidgetCard>
          );
        })}
      </div>
    </div>
  );
};

const CategoryPageFallback = () => (
  <output aria-label="Loading category widgets" className="block">
    <div aria-hidden="true" className="relative space-y-3 text-center">
      <div className="bg-muted mx-auto h-12 max-w-sm animate-pulse rounded-md" />
      <div className="bg-muted mx-auto h-6 max-w-3xl animate-pulse rounded-md" />
    </div>
    <div
      aria-hidden="true"
      className="relative z-10 my-6 space-y-8 overflow-hidden p-3"
    >
      <div className="-m-px grid grid-cols-12 gap-6 *:px-1 *:py-12 sm:*:px-8 xl:*:px-12">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="col-span-12 sm:col-span-6 lg:col-span-4">
            <div className="bg-muted mx-auto aspect-square size-56 animate-pulse rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  </output>
);

const Page = ({ params }: PageProps) => (
  <Suspense fallback={<CategoryPageFallback />}>
    <CategoryContent params={params} />
  </Suspense>
);

export default Page;
