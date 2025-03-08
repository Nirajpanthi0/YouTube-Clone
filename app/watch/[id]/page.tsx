import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import VideoPlayer from "@/components/video-player"
import RelatedVideos from "@/components/related-videos"
import VideoInfo from "@/components/video-info"
import CommentsSection from "@/components/comments-section"
import VideoTabs from "@/components/video-tabs"

interface WatchPageProps {
  params: {
    id: string
  }
}

export default function WatchPage({ params }: WatchPageProps) {
  const videoId = params.id

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 ml-0 md:ml-64">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VideoPlayer videoId={videoId} />

              {/* Mobile: Tabs for info and comments */}
              <div className="block lg:hidden">
                <VideoTabs videoId={videoId} />
              </div>

              {/* Desktop: Show info and comments stacked */}
              <div className="hidden lg:block">
                <VideoInfo videoId={videoId} />
                <CommentsSection videoId={videoId} />
              </div>
            </div>
            <div className="lg:col-span-1">
              <RelatedVideos currentVideoId={videoId} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

