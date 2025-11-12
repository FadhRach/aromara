import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SupplierCardProps {
  title: string;
  description: string;
  image: string;
  region: string;
  tags: string[];
  trends: string[];
  variant?: "dark" | "light";
}

export function SupplierCard({
  title,
  description,
  image,
  region,
  tags,
  trends,
  variant = "dark",
}: SupplierCardProps) {
  const isDark = variant === "dark";

  return (
    <Card className={`overflow-hidden ${isDark ? "bg-primary text-white" : "bg-white"}`}>
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Image */}
          <div className="relative w-40 h-48 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className={`text-sm mb-3 line-clamp-2 ${isDark ? "text-white/80" : "text-muted-foreground"}`}>
              {description}
            </p>
            <p className={`text-xs mb-4 ${isDark ? "text-white/60" : "text-muted-foreground"}`}>
              {region}
            </p>

            {/* Tags */}
            <div className="mb-3">
              <p className="text-xs font-semibold mb-2">Key</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className={isDark ? "bg-white/20 hover:bg-white/30" : ""}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Trends */}
            <div>
              <p className="text-xs font-semibold mb-2">Trends</p>
              <div className="flex flex-wrap gap-2">
                {trends.map((trend, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className={isDark ? "bg-white/20 hover:bg-white/30" : ""}
                  >
                    {trend}
                  </Badge>
                ))}
              </div>
            </div>

            {/* View Profile Button */}
            <div className="mt-4">
              <Button
                variant={isDark ? "secondary" : "outline"}
                size="sm"
                className="w-full"
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
