export default function SkeletonCard() {
  return (
    <div className="product-card">
      <div className="skeleton aspect-[3/4]" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-5 w-20 rounded" />
      </div>
    </div>
  );
}
