"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import VideoCard from "@/components/video-card"
import { fetchChannelById, fetchVideosByChannel, formatViewCount, type YouTubeSearchResult } from "@/utils/youtube"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle2, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface ChannelPageProps {
  params: {
    id: string
  }
}

// Use a hardcoded channel ID for the user profile
const USER_CHANNEL_ID = "UCXuqSBlHAE6Xw-yeJA0Tunw" // Linus Tech Tips

export default function ChannelPage({ params }: ChannelPageProps) {
  const channelId = params.id
  const [channel, setChannel] = useState<any>(null)
  const [videos, setVideos] = useState<YouTubeSearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)

  // Check if this is the user's own channel
  const isOwnChannel = channelId === USER_CHANNEL_ID

  useEffect(() => {
    const loadChannelAndVideos = async () => {
      try {
        setLoading(true)

        // Load channel info
        console.log("Channel page: Loading channel info for:", channelId)
        const channelInfo = await fetchChannelById(channelId)
        setChannel(channelInfo)

        // Load channel videos
        console.log("Channel page: Loading videos for channel:", channelId)
        const channelVideos = await fetchVideosByChannel(channelId)
        setVideos(channelVideos)

        setError(null)
      } catch (err) {
        console.error("Channel page: Error fetching channel data:", err)
        setError("Failed to load channel information. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadChannelAndVideos()
  }, [channelId])

  if (loading) {
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
                    <Skeleton className="h-10 w-10 rounded-full" />
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

  if (error || !channel) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 pt-16">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 ml-0 md:ml-64">
            <div className="p-4 text-center">
              <p className="text-red-500">{error || "Channel not found"}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-primary text-white rounded-md"
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const { snippet, statistics, brandingSettings } = channel
  const { title, description, thumbnails, customUrl } = snippet
  const { subscriberCount, videoCount, viewCount } = statistics
  const bannerUrl = brandingSettings?.image?.bannerExternalUrl

  const formattedSubscriberCount = formatViewCount(subscriberCount || "0")
  const formattedVideoCount = Number.parseInt(videoCount || "0").toLocaleString()
  const formattedViewCount = formatViewCount(viewCount || "0")

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 ml-0 md:ml-64">
          {/* Channel banner */}
          {bannerUrl ? (
            <div className="w-full h-32 md:h-48 relative">
              <Image
                src={bannerUrl || "/placeholder.svg"}
                alt={`${title} banner`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-full h-32 md:h-48 bg-secondary"></div>
          )}

          {/* Channel info */}
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start mb-6">
              <div className="h-24 w-24 relative rounded-full overflow-hidden bg-secondary">
                <Image
                  src={thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url || "/placeholder.svg"}
                  alt={title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-1">
                  <h1 className="text-2xl font-bold">{title}</h1>
                  {customUrl && <CheckCircle2 className="h-5 w-5 text-primary hidden md:inline-block ml-1" />}

                  {isOwnChannel && (
                    <Badge variant="outline" className="ml-2 gap-1">
                      <User className="h-3 w-3" />
                      <span>This is you</span>
                    </Badge>
                  )}
                </div>

                <div className="text-sm text-muted-foreground mt-1">
                  {customUrl && <p>@{customUrl}</p>}
                  <p>
                    {formattedSubscriberCount} subscribers • {formattedVideoCount} videos • {formattedViewCount} views
                  </p>
                </div>

                <p className="mt-2 text-sm line-clamp-2 md:line-clamp-none">{description}</p>
              </div>

              {!isOwnChannel ? (
                <Button
                  variant={isSubscribed ? "outline" : "default"}
                  className="min-w-[120px]"
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
              ) : (
                <Button variant="outline" className="min-w-[120px]">
                  Customize Channel
                </Button>
              )}
            </div>

            {/* Channel content tabs */}
            <Tabs defaultValue="videos" className="mb-6">
              <TabsList>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="playlists">Playlists</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              <TabsContent value="videos">
                {videos.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-lg">No videos found</p>
                    <p className="text-muted-foreground mt-2">This channel hasn't uploaded any videos yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {videos.map((video) => (
                      <VideoCard key={video.id.videoId} video={video} hideChannelInfo />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="playlists">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Playlists will be available soon</p>
                </div>
              </TabsContent>

              <TabsContent value="community">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Community posts will be available soon</p>
                </div>
              </TabsContent>

              <TabsContent value="about">
                <div className="max-w-3xl">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="whitespace-pre-line mb-6">{description}</p>

                  <h3 className="font-medium mb-2">Stats</h3>
                  <p>Joined: {new Date(snippet.publishedAt).toLocaleDateString()}</p>
                  <p>{formattedViewCount} total views</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

