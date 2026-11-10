import { Skeleton } from "@/components/ui/skeleton";

export function TrackPageSkeleton() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden grid-bg px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Track Header Card */}
        <div className="rounded-2xl border border-white/5 bg-[#1a1a2e]/70 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-2xl bg-primary/20" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-48 sm:w-64 rounded-lg bg-white/15" />
                <Skeleton className="h-4 w-36 rounded bg-white/10" />
              </div>
            </div>
            <Skeleton className="h-11 w-36 rounded-xl bg-primary/30" />
          </div>

          {/* Progress bar */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-24 rounded bg-white/10" />
              <Skeleton className="h-3 w-12 rounded bg-white/10" />
            </div>
            <Skeleton className="h-2.5 w-full rounded-full bg-white/5" />
          </div>
        </div>

        {/* Modules & Lesson Nodes */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-white/5 bg-[#1a1a2e]/40 p-4 sm:p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-40 sm:w-64 rounded bg-white/15" />
                  <Skeleton className="h-3 w-28 rounded bg-white/5" />
                </div>
              </div>
              <Skeleton className="h-8 w-20 rounded-lg bg-white/10 shrink-0" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
