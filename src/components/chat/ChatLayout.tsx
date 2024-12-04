"use client"

import { useState } from "react";
import AIChat from "@/components/chat/AIChat";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import ChatHistory from "@/components/chat/ChatHistory";
import Navbar from "../layout/Navbar";
import { Chat } from "@prisma/client";
import { GPT4oMessagesInput, O1MessagesInput } from "@/lib/types";

export default function ChatLayout({ chatHistory, userId, messages, chatId }: { chatHistory: Chat[], userId: string, messages?: (O1MessagesInput | GPT4oMessagesInput)[] | undefined, chatId?: string }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={20}
            minSize={15}
            maxSize={25}
            className={`${isSidebarOpen ? 'block' : 'hidden'
              } md:block absolute md:relative z-40 h-full md:h-auto`}
            style={{ width: isSidebarOpen ? '80%' : '20%' }}
          >
            <ChatHistory history={chatHistory} userId={userId} />
          </ResizablePanel>
          <ResizableHandle className="hidden md:flex" />
          <ResizablePanel defaultSize={80} className="w-full md:w-auto">
            <AIChat userId={userId} initialMessages={messages} chatId={chatId} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>

  )
}