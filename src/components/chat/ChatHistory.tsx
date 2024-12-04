'use client'

import { Button } from "@/components/ui/button"
import { Chat } from "@prisma/client"
import { PlusCircle, MessageCircle, Ellipsis, Trash } from "lucide-react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import deleteChat from "@/utils/deleteChat"
import { useRouter } from "next/navigation"

interface ChatHistoryProps {
  history: Chat[],
  userId: string
}

export default function ChatHistory({ history, userId }: ChatHistoryProps) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="h-full bg-gray-50 p-4 flex flex-col">
      <Link href={"/chat"} className="mb-4">
        <Button className="w-full flex items-center gap-2">
          <PlusCircle size={20} />
          New Chat
        </Button>
      </Link>

      <div className="flex-1 overflow-y-auto">
        {history.map((chat) => {
          const isActive = pathname === `/chat/${chat.chatSessionId}`

          return (
            <div key={chat.chatSessionId} className="">
              <Link href={`/chat/${chat.chatSessionId}`}>
                <Button
                  variant="ghost"
                  className={`relative group w-full justify-start mb-2 text-left hover:bg-gray-200 ${isActive ? 'bg-gray-300 hover:bg-gray-300' : ''}`}
                >
                  <MessageCircle size={18} className="mr-1 -ml-3 flex-shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <div className="text-clip">{chat.chatName}</div>
                    <div className="text-xs text-gray-500">{chat.createdAt.toLocaleString()}</div>
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Ellipsis size={20} color="white" className='absolute inset-y-0 top-0 bottom-0 right-2 m-auto invisible group-hover:visible group-hover:bg-slate-500 rounded' />
                    </PopoverTrigger>
                    <PopoverContent className="w-25">
                      <div className="flex flex-col space-y-5">
                        <AlertDialog>
                          <AlertDialogTrigger className="text-red-500 flex flex-row justify-center items-center gap-1 text-sm">
                            <Trash size={20}/>
                            Delete
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this chat and its coonversations.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={async () => {
                                await deleteChat(userId, chat.chatSessionId)
                                router.refresh();
                              }}>
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </PopoverContent>
                  </Popover>

                </Button>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
