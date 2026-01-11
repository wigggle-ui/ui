import { testimonials } from "@/config/testimonials";
import { 
  TweetCard, 
  YouTubeCard, 
  ArticleCard, 
  ActivityCard 
} from "@/components/social-cards";



export default function SocialTestimonials() {
  return (
    // Fix: Reduced py-24 to py-16 as requested
    <section className="py-16 relative overflow-hidden">
      <div className="container px-4 mx-auto">
        
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Loved by the Community
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of developers building the future of the web.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((item, i) => (
            <div key={i} className={item.colSpan}>
              {item.type === "twitter" && <TweetCard item={item} />}
              {item.type === "youtube" && <YouTubeCard item={item} />}
              {item.type === "article" && <ArticleCard item={item} />}
              {item.type === "activity" && <ActivityCard item={item} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}