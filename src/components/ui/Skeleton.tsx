import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({ className, variant = "text", width, height }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-white/10 rounded",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded-lg",
        className
      )}
      style={{ width, height }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="text" height={24} width="60%" />
      <Skeleton variant="text" height={16} />
      <Skeleton variant="text" height={16} width="80%" />
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="text" height={24} width={60} />
        ))}
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <Skeleton variant="rectangular" height={220} />
      <div className="p-5 space-y-3">
        <Skeleton variant="text" height={24} width="70%" />
        <Skeleton variant="text" height={16} />
        <Skeleton variant="text" height={16} width="60%" />
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="text" height={22} width={50} />
          ))}
        </div>
      </div>
    </div>
  );
}
