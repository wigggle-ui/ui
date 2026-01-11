// components/social-cards.tsx
import { 
  Twitter, 
  Youtube, 
  MoveUpRight, 
  Github, 
  PlayCircle,
  Newspaper,
  GitCommitHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TestimonialItem } from "@/config/testimonials"; // Import the type!

// Fix: We now use { item: TestimonialItem } instead of { item: any }

export const TweetCard = ({ item }: { item: TestimonialItem }) => (
  <Card className="h-full bg-background border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 transition-colors">
    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 border">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.handle}`} />
            <AvatarFallback>{item.author?.[0]}</AvatarFallback>
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

export const YouTubeCard = ({ item }: { item: TestimonialItem }) => (
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

export const ArticleCard = ({ item }: { item: TestimonialItem }) => (
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

export const ActivityCard = ({ item }: { item: TestimonialItem }) => (
  <Card className="h-full bg-linear-to-br from-zinc-900 to-zinc-950 text-white border-none relative overflow-hidden">
     {/* Fix: Changed bg-gradient-to-br to bg-linear-to-br as requested */}
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