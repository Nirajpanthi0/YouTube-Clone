"use client"

import { useEffect, useState } from "react"
import VideoCard from "@/components/video-card"
import { fetchMostPopularVideos, type YouTubeVideo } from "@/utils/youtube"
import { Skeleton } from "@/components/ui/skeleton"

interface VideoGridProps {
  categoryId?: string | null
}

export default function VideoGrid({ categoryId }: VideoGridProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true)
        console.log("VideoGrid: Loading videos for category:", categoryId || "all")

        // Pass the categoryId to the API function
        const popularVideos = await fetchMostPopularVideos({
          categoryId: categoryId,
          maxResults: 20,
        })

        console.log("VideoGrid: Videos loaded:", popularVideos.length)
        setVideos(popularVideos)
        setError(null)
      } catch (err) {
        console.error("VideoGrid: Error fetching videos:", err)
        setError("Failed to load videos. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [categoryId])

  if (loading) {
    return (
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
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-2 px-4 py-2 bg-primary text-white rounded-md">
          Retry
        </button>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">No videos found</p>
        <p className="text-muted-foreground mt-2">{categoryId ? "Try another category" : "Try again later"}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}

