export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-card border border-border/50">
      {/* Image Skeleton */}
      <div className="aspect-square shimmer" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 rounded-full shimmer" />
        <div className="h-5 w-3/4 rounded-lg shimmer" />
        <div className="h-4 w-20 rounded-lg shimmer" />
        <div className="h-6 w-24 rounded-lg shimmer" />
      </div>
    </div>
  );
}
