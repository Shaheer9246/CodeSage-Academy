import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden grid-bg">
      {/* Background glow placeholder */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-5 lg:gap-6 max-w-[1720px] mx-auto px-3 sm:px-6 py-4 sm:py-6 lg:py-8">
        
        {/* Main Content Area (Left / Center) */}
        <div className="flex-1 min-w-0 space-y-6">
          
          {/* Top Hero Banner Skeleton */}
          <div className="rounded-2xl border border-white/5 bg-[#1a1a2e]/60 p-6 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-28 rounded-full bg-white/10" />
                  <Skeleton className="h-4 w-16 rounded-full bg-white/5" />
                </div>
                <Skeleton className="h-8 w-64 rounded-lg bg-white/10" />
                <Skeleton className="h-4 w-80 rounded-md bg-white/5" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-24 rounded-xl bg-white/10" />
                <Skeleton className="h-10 w-24 rounded-xl bg-white/10" />
              </div>
            </div>

            {/* Continue Learning Card Skeleton */}
            <div className="mt-6 p-4 rounded-xl border border-white/5 bg-black/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl bg-primary/20" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 rounded bg-white/10" />
                  <Skeleton className="h-5 w-48 rounded bg-white/15" />
                </div>
              </div>
              <Skeleton className="h-10 w-36 rounded-xl bg-primary/30" />
            </div>
          </div>

          {/* Filter Categories Pills Bar Skeleton */}
          <div className="flex items-center gap-2 overflow-hidden py-1">
            {[90, 80, 75, 70, 60, 65, 110, 100].map((width, idx) => (
              <Skeleton
                key={idx}
                style={{ width: `${width}px` }}
                className="h-9 shrink-0 rounded-xl bg-white/5 border border-white/5"
              />
            ))}
          </div>

          {/* Track Grid Skeleton (6 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/5 bg-[#1a1a2e]/40 p-5 space-y-4 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-11 h-11 rounded-xl bg-white/10" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-5 w-32 rounded bg-white/15" />
                      <Skeleton className="h-3 w-20 rounded bg-white/5" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-14 rounded-full bg-white/5" />
                </div>

                <Skeleton className="h-3 w-full rounded bg-white/5" />
                <Skeleton className="h-3 w-4/5 rounded bg-white/5" />

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16 rounded bg-white/10" />
                    <Skeleton className="h-3 w-10 rounded bg-white/10" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full bg-white/5" />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Skeleton className="h-4 w-20 rounded bg-white/5" />
                  <Skeleton className="h-9 w-28 rounded-xl bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Rail Stats Skeleton */}
        <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 space-y-5">
          {/* Daily Streak & XP Card */}
          <div className="rounded-2xl border border-white/5 bg-[#1a1a2e]/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-28 rounded bg-white/15" />
              <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-16 rounded-xl bg-white/5" />
              <Skeleton className="h-16 rounded-xl bg-white/5" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl bg-white/10" />
          </div>

          {/* Quick Challenges Card */}
          <div className="rounded-2xl border border-white/5 bg-[#1a1a2e]/40 p-5 space-y-3">
            <Skeleton className="h-5 w-36 rounded bg-white/15" />
            <Skeleton className="h-12 w-full rounded-xl bg-white/5" />
            <Skeleton className="h-12 w-full rounded-xl bg-white/5" />
          </div>
        </div>

      </div>
    </div>
  );
}
