import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 ml-0 md:ml-64">
          {/* Channel banner skeleton */}
          <Skeleton className="w-full h-32 md:h-48 rounded-lg mb-4" />

          {/* Channel info skeleton */}
          <div className="flex flex-col md:flex-row gap-4 items-center md:items-start mb-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-2 text-center md:text-left">
              <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
              <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
              <Skeleton className="h-4 w-64 mx-auto md:mx-0" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Videos skeleton */}
          <Skeleton className="h-10 w-full mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <div className="flex gap-2">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

