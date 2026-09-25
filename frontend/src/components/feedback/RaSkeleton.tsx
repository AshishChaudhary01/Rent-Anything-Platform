function RaSkeleton({ className = "" }: { className?: string }) {
  return <div className={`rap-skeleton rounded-xl bg-surface ${className}`} />
}

export function RaSkeletonCard() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white">
      <RaSkeleton className="size-12 rounded-full shrink-0" />
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <RaSkeleton className="h-4 w-2/3" />
        <RaSkeleton className="h-3 w-full" />
      </div>
    </div>
  )
}

export default RaSkeleton
