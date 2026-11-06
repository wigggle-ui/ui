import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";

const Announcement = () => (
  <Badge asChild variant="secondary">
    <Link href="/widgets/sale">
      New Widget Category: Sale <ArrowRightIcon />
    </Link>
  </Badge>
);

export default Announcement;
