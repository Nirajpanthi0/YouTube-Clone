"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VideoInfo from "@/components/video-info"
import CommentsSection from "@/components/comments-section"

interface VideoTabsProps {
  videoId: string
}

export default function VideoTabs({ videoId }: VideoTabsProps) {
  const [activeTab, setActiveTab] = useState("info")

  return (
    <div className="lg:hidden mt-4">
      <Tabs defaultValue="info" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <VideoInfo videoId={videoId} />
        </TabsContent>
        <TabsContent value="comments">
          <CommentsSection videoId={videoId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

