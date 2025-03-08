import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { type YouTubeVideo, type YouTubeSearchResult, formatViewCount, formatPublishedDate } from "@/utils/youtube"

interface VideoProps {
  video: YouTubeVideo | YouTubeSearchResult
  hideChannelInfo?: boolean
}

export default function VideoCard({ video, hideChannelInfo = false }: VideoProps) {
  // Handle both video and search result types
  const isSearchResult = "id" in video && typeof video.id === "object"

  const videoId = isSearchResult ? (video as YouTubeSearchResult).id.videoId : (video as YouTubeVideo).id

  const { title, channelTitle, thumbnails, publishedAt, channelId } = video.snippet

  // Get view count if available (only in YouTubeVideo type)
  const viewCount =
    !isSearchResult && (video as YouTubeVideo).statistics
      ? formatViewCount((video as YouTubeVideo).statistics!.viewCount)
      : ""

  const timestamp = formatPublishedDate(publishedAt)

  // Get the best thumbnail available
  const thumbnail =
    thumbnails.maxres?.url ||
    thumbnails.standard?.url ||
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url ||
    "/placeholder.svg"

  return (
    <div className="group">
      <Link href={`/watch/${videoId}`}>
        <div className="aspect-video relative rounded-lg overflow-hidden mb-2 bg-secondary">
          <Image
            src={thumbnail || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            unoptimized // Add this to avoid issues with external images
          />
        </div>
      </Link>
      <div className="flex gap-3">
        {!hideChannelInfo && (
          <Link href={`/channel/${channelId}`}>
            <Avatar className="h-9 w-9 mt-1">
              <AvatarFallback>{channelTitle[0]}</AvatarFallback>
            </Avatar>
          </Link>
        )}
        <div>
          <Link href={`/watch/${videoId}`}>
            <h3 className="font-medium line-clamp-2 group-hover:text-primary">{title}</h3>
          </Link>
          {!hideChannelInfo && (
            <Link href={`/channel/${channelId}`}>
              <p className="text-sm text-muted-foreground hover:text-foreground">{channelTitle}</p>
            </Link>
          )}
          <p className="text-xs text-muted-foreground">
            {viewCount && `${viewCount} views • `}
            {timestamp}
          </p>
        </div>
      </div>
    </div>
  )
}

