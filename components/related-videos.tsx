"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import {
  fetchRelatedVideos,
  fetchMostPopularVideos,
  type YouTubeSearchResult,
  formatPublishedDate,
} from "@/utils/youtube"

interface RelatedVideosProps {
  currentVideoId: string
}

export default function RelatedVideos({ currentVideoId }: RelatedVideosProps) {
  const [videos, setVideos] = useState<YouTubeSearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUsingFallback, setIsUsingFallback] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const loadRelatedVideos = async () => {
      try {
        setLoading(true)
        console.log("RelatedVideos: Fetching related videos for", currentVideoId)

        const relatedVideos = await fetchRelatedVideos(currentVideoId)
        console.log("RelatedVideos: Fetched", relatedVideos.length, "related videos")

        if (relatedVideos.length === 0) {
          console.log("RelatedVideos: No related videos found, using fallback")
          setIsUsingFallback(true)
          // Fetch popular videos as fallback
          const popularVideos = await fetchMostPopularVideos({ maxResults: 10 })
          // Convert to search result format
          const formattedVideos = popularVideos.map((video) => ({
            id: { kind: "youtube#video", videoId: video.id },
            snippet: video.snippet,
          }))
          setVideos(formattedVideos)
        } else {
          setIsUsingFallback(false)
          setVideos(relatedVideos)
        }

        setError(null)
      } catch (err) {
        console.error("RelatedVideos: Error fetching related videos:", err)
        setError("Failed to load related videos")
        setIsUsingFallback(true)

        try {
          // Fallback to popular videos
          console.log("RelatedVideos: Fetching popular videos as fallback")
          const popularVideos = await fetchMostPopularVideos({ maxResults: 10 })
          // Convert to search result format
          const formattedVideos = popularVideos.map((video) => ({
            id: { kind: "youtube#video", videoId: video.id },
            snippet: video.snippet,
          }))
          setVideos(formattedVideos)
        } catch (fallbackErr) {
          console.error("RelatedVideos: Error fetching fallback videos:", fallbackErr)
        }
      } finally {
        setLoading(false)
      }
    }

    loadRelatedVideos()
  }, [currentVideoId, retryCount])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  if (loading) {
    return (
      <div>
        <h3 className="font-medium mb-4">Related Videos</h3>
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex gap-2">
              <Skeleton className="flex-shrink-0 w-40 sm:w-48 aspect-video rounded-lg" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error && videos.length === 0) {
    return (
      <div>
        <h3 className="font-medium mb-4">Related Videos</h3>
        <div className="p-4 text-center bg-secondary rounded-lg">
          <p className="text-muted-foreground mb-2">{error}</p>
          <Button onClick={handleRetry} size="sm" variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div>
        <h3 className="font-medium mb-4">Related Videos</h3>
        <p className="text-muted-foreground text-center p-4">No videos found</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="font-medium mb-4">{isUsingFallback ? "Recommended Videos" : "Similar Videos"}</h3>
      <div className="space-y-4">
        {videos.map((video) => {
          // Handle both regular search results and converted popular videos
          const videoId = video.id.videoId || video.id
          const { title, channelTitle, thumbnails, publishedAt, channelId } = video.snippet
          const timestamp = formatPublishedDate(publishedAt)

          // Get the best thumbnail available
          const thumbnailUrl =
            thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url || "/placeholder.svg"

          return (
            <div key={videoId} className="flex gap-2">
              <div className="flex-shrink-0 w-40 sm:w-48">
                <Link href={`/watch/${videoId}`}>
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-secondary">
                    <Image
                      src={thumbnailUrl || "/placeholder.svg"}
                      alt={title}
                      fill
                      className="object-cover"
                      unoptimized // Add this to avoid issues with external images
                    />
                  </div>
                </Link>
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/watch/${videoId}`}>
                  <h4 className="font-medium text-sm line-clamp-2">{title}</h4>
                </Link>
                <Link href={`/channel/${channelId}`}>
                  <p className="text-xs text-muted-foreground mt-1">{channelTitle}</p>
                </Link>
                <p className="text-xs text-muted-foreground">{timestamp}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

