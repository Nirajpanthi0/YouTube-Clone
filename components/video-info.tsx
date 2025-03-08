"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal, Bell, MessageSquare, CheckCircle2 } from "lucide-react"
import { fetchVideoById, type YouTubeVideo, formatViewCount, formatPublishedDate } from "@/utils/youtube"

interface VideoInfoProps {
  videoId: string
}

export default function VideoInfo({ videoId }: VideoInfoProps) {
  const [video, setVideo] = useState<YouTubeVideo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [commentCount, setCommentCount] = useState(0)

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true)
        const videoData = await fetchVideoById(videoId)
        setVideo(videoData)
        setError(null)
      } catch (err) {
        console.error("Error fetching video:", err)
        setError("Failed to load video information. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadVideo()

    // Get comment count from localStorage
    try {
      const savedComments = localStorage.getItem(`comments-${videoId}`)
      if (savedComments) {
        setCommentCount(JSON.parse(savedComments).length)
      } else {
        // Default to 5 if no saved comments (our mock data has 5 comments)
        setCommentCount(5)
      }
    } catch (e) {
      console.error("Error loading comment count:", e)
    }
  }, [videoId])

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  if (loading) {
    return (
      <div className="mb-6 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24 mt-1" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error || "Video not found"}</p>
        <button onClick={() => window.location.reload()} className="mt-2 px-4 py-2 bg-primary text-white rounded-md">
          Retry
        </button>
      </div>
    )
  }

  const { title, channelTitle, description, publishedAt, channelId } = video.snippet
  const {
    viewCount,
    likeCount,
    commentCount: apiCommentCount,
  } = video.statistics || {
    viewCount: "0",
    likeCount: "0",
    commentCount: "0",
  }
  const formattedViewCount = formatViewCount(viewCount)
  const formattedLikeCount = formatViewCount(likeCount)
  const publishedDate = formatPublishedDate(publishedAt)

  // Use API comment count if available, otherwise use our local count
  const displayCommentCount = apiCommentCount ? formatViewCount(apiCommentCount) : commentCount.toString()

  return (
    <div className="mb-6">
      <h1 className="text-xl font-bold mb-2">{title}</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Link href={`/channel/${channelId}`}>
            <Avatar className="h-10 w-10">
              <AvatarFallback>{channelTitle[0]}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link href={`/channel/${channelId}`}>
              <p className="font-medium flex items-center">
                {channelTitle}
                <CheckCircle2 className="h-4 w-4 text-primary ml-1" />
              </p>
            </Link>
            <p className="text-xs text-muted-foreground">Subscribers</p>
          </div>
          <Button
            variant={isSubscribed ? "outline" : "default"}
            size="sm"
            className="ml-2"
            onClick={() => setIsSubscribed(!isSubscribed)}
          >
            {isSubscribed ? (
              <>
                <Bell className="h-4 w-4 mr-1" />
                Subscribed
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full bg-secondary">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-l-full ${isLiked ? "text-primary" : ""}`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {formattedLikeCount}
            </Button>
            <div className="h-5 w-px bg-border"></div>
            <Button variant="ghost" size="sm" className="rounded-r-full">
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="secondary" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>

          <Button variant="secondary" size="sm" className="hidden sm:flex">
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-secondary rounded-lg p-3 text-sm">
        <div className="flex items-center gap-2 font-medium mb-1">
          <span>{formattedViewCount} views</span>
          <span>•</span>
          <span>{publishedDate}</span>
          {apiCommentCount && (
            <>
              <span>•</span>
              <span className="flex items-center">
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                {displayCommentCount}
              </span>
            </>
          )}
        </div>
        <div className={isDescriptionExpanded ? "" : "line-clamp-2"}>
          <p className="whitespace-pre-line">{description}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 p-0 h-auto font-medium"
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
        >
          {isDescriptionExpanded ? "Show less" : "Show more"}
        </Button>
      </div>
    </div>
  )
}

