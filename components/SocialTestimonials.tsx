import { ReactNode } from "react";
import { 
  Twitter, 
  Youtube, 
  Linkedin, 
  MoveUpRight, 
  Github, 
  PlayCircle,
  Newspaper,
  GitCommitHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// --- 1. DATA CONFIGURATION ---
// This is where you edit the specific reviews/posts
const testimonials = [
  {
    type: "youtube",
    author: "Manu Arora",
    role: "Founder, Aceternity UI",
    content: "Review: The cleanest React components I've seen this year.",
    thumbnailColor: "bg-red-950", // Simulating a video thumbnail
    link: "#",
    colSpan: "col-span-1 md:col-span-2", // Make video cards wider
  },
  {
    type: "twitter",
    author: "Sarah Drasner",
    handle: "@sarah_edo",
    content: "Just tried out Wigggle UI for a client project. The radial gradients are exactly what I was missing. 🎨",
    link: "#",
    colSpan: "col-span-1",
  },
  {
    type: "activity",
    title: "Project Activity",
    stat: "1,240+",
    desc: "Commits pushed to main",
    colSpan: "col-span-1",
  },
  {
    type: "article",
    source: "daily.dev",
    title: "Top 10 UI Libraries to Watch in 2026",
    desc: "Wigggle UI featured as a top contender for modern dashboard design.",
    link: "#",
    colSpan: "col-span-1",
  },
  {
    type: "youtube",
    author: "OrcDev",
    role: "Tech YouTuber",
    content: "Building a SaaS in 1 hour using these new components.",
    thumbnailColor: "bg-blue-950",
    link: "#",
    colSpan: "col-span-1 md:col-span-2",
  },
  {
    type: "twitter",
    author: "Guillermo Rauch",
    handle: "@rauchg",
    content: "This is the speed we need on the web. Incredible performance metrics on the new release. ▲",
    link: "#",
    colSpan: "col-span-1",
  },
];

// --- 2. MAIN COMPONENT ---
export default function SocialTestimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
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

// --- 3. SUB-COMPONENTS (Styles for each type) ---

const TweetCard = ({ item }: { item: any }) => (
  <Card className="h-full bg-background border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 transition-colors">
    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 border">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.handle}`} />
            <AvatarFallback>{item.author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{item.author}</span>
          <span className="text-xs text-muted-foreground">{item.handle}</span>
        </div>
      </div>
      <Twitter className="h-5 w-5 text-blue-400" />
    </CardHeader>
    <CardContent>
      <p className="text-sm leading-relaxed">{item.content}</p>
    </CardContent>
  </Card>
);

const YouTubeCard = ({ item }: { item: any }) => (
  <Card className="h-full overflow-hidden group relative border-zinc-200 dark:border-zinc-800">
    <div className={`absolute inset-0 ${item.thumbnailColor} opacity-20 group-hover:opacity-30 transition-opacity`} />
    <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-500" fill="currentColor" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Review</span>
            </div>
            <h3 className="text-xl font-bold">{item.author}</h3>
            <p className="text-sm text-muted-foreground">{item.role}</p>
        </div>
      </div>
      
      <div className="mt-8 space-y-4">
        <p className="text-lg font-medium italic">"{item.content}"</p>
        <Button variant="outline" className="group/btn gap-2 w-fit">
            Watch Video 
            <PlayCircle className="h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

const ArticleCard = ({ item }: { item: any }) => (
  <Card className="h-full bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
    <CardHeader>
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 px-2 py-1 bg-background rounded-full border text-xs font-medium">
                <Newspaper className="h-3 w-3" />
                {item.source}
            </div>
            <MoveUpRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg leading-tight">{item.title}</h3>
    </CardHeader>
    <CardContent>
        <p className="text-sm text-muted-foreground">{item.desc}</p>
    </CardContent>
  </Card>
);

const ActivityCard = ({ item }: { item: any }) => (
  <Card className="h-full bg-gradient-to-br from-zinc-900 to-zinc-950 text-white border-none relative overflow-hidden">
     {/* Decorative background pattern */}
    <div className="absolute -right-4 -top-4 opacity-10">
        <Github className="h-32 w-32" />
    </div>
    
    <CardContent className="flex flex-col items-center justify-center h-full py-8 space-y-2 relative z-10">
        <div className="p-3 bg-white/10 rounded-full mb-2">
            <GitCommitHorizontal className="h-6 w-6" />
        </div>
        <span className="text-4xl font-bold tracking-tighter">{item.stat}</span>
        <span className="text-sm text-zinc-400 font-medium uppercase tracking-wide">{item.desc}</span>
    </CardContent>
  </Card>
);