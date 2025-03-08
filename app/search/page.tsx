"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import VideoCard from "@/components/video-card"
import { searchVideos, type YouTubeSearchResult } from "@/utils/youtube"
import { Skeleton } from "@/components/ui/skeleton"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [videos, setVideos] = useState<YouTubeSearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return

      try {
        setLoading(true)
        const results = await searchVideos(query)
        setVideos(results)
        setError(null)
      } catch (err) {
        console.error("Error searching videos:", err)
        setError("Failed to load search results. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 ml-0 md:ml-64">
          <h2 className="text-2xl font-bold mb-6">Search results for "{query}"</h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-primary text-white rounded-md"
              >
                Retry
              </button>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg">No results found for "{query}"</p>
              <p className="text-muted-foreground mt-2">Try different keywords or check your spelling</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map((video) => (
                <VideoCard key={video.id.videoId} video={video} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

