interface VideoPlayerProps {
  videoId: string
}

export default function VideoPlayer({ videoId }: VideoPlayerProps) {
  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  )
}

