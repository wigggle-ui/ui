import Link from "next/link";

import { TweetCard, YouTubeCard, ArticleCard } from "@/components/social-cards";

import { testimonials } from "@/config/testimonials";

export default function SocialTestimonials() {
  return (
    <section className="relative overflow-hidden py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
            Loved by the Community
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Join thousands of developers building the future of the web.
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, i) => (
            <Link href={item.link} key={i} className={item.colSpan}>
              <div key={i} className="size-full">
                {item.type === "twitter" && <TweetCard item={item} />}
                {item.type === "youtube" && <YouTubeCard item={item} />}
                {item.type === "article" && <ArticleCard item={item} />}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
