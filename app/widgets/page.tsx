import CategoryCard from "@/components/category-card";
import PageHeader from "@/components/page-header";
import { categories, getWidgetCount } from "@/config/widgets";

const Home = () => (
  <div className="relative" data-home>
    <PageHeader title="Widgets">
      Widgets are divided based on categories. Take your pick!
    </PageHeader>

    <div className="relative my-16">
      <div className="mx-auto grid w-max gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {categories.map((category) => (
          <CategoryCard
            key={category.slug}
            slug={category.slug}
            name={category.name}
            widgetCount={getWidgetCount(category)}
            isNew={category.isNew}
            icon={category.icon}
          />
        ))}
      </div>
    </div>
  </div>
);

export default Home;
