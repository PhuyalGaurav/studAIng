'use client'

import { SendIcon } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from 'next/navigation'
import { GPT4oMessagesInput, O1MessagesInput } from '@/lib/types'
import AIChatMessages from './AIChatMessages'
import fetchGenerateAIResponse from '@/utils/fetchGenerateAIResponse'
import createChat from '@/utils/createChat'
import submitMessage from '@/utils/submitMessage'

export default function AIChat({ initialMessages, userId, chatId }: { initialMessages?: (GPT4oMessagesInput | O1MessagesInput)[], userId: string, chatId?: string }) {
  const [messages, setMessages] = useState<(GPT4oMessagesInput | O1MessagesInput)[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rows, setRows] = useState(1)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      setRows(textareaRef.current.rows)
    }
  }, [input])

  const router = useRouter()

  useEffect(() => {
    if (initialMessages) {
      const updatedMessages: (GPT4oMessagesInput | O1MessagesInput)[] = initialMessages.map((message) => {
        if ('messageType' in message) {
          const { messageType, ...rest } = message;

          if (['quiz', 'ppt', 'flashcards', 'physics', 'spelling', 'canvas', 'image'].includes(messageType as string)) {
            return {
              ...rest,
              componentMessageType: messageType as GPT4oMessagesInput['componentMessageType']
            };
          }
        }
        return message;
      });

      setMessages(updatedMessages);
    }
  }, [initialMessages]);


  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(event.target.value)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!input.trim() || isLoading) return

    const newUserMessage: O1MessagesInput = { role: 'user', content: input.trim() }
    setMessages(prevMessages => [...prevMessages, newUserMessage])
    setInput('')
    setIsLoading(true)

    if (!chatId) {
      try {
        const chatSessionId = await createChat(userId, input.trim(), newUserMessage)

        const aiResponse = await fetchGenerateAIResponse([...messages, newUserMessage])
        router.push(`/chat/${chatSessionId}`)
        router.refresh()

        if (aiResponse.contentType === 'quiz' || aiResponse.contentType === 'ppt' || aiResponse.contentType == 'flashcards' || aiResponse.contentType == 'spelling' || aiResponse.contentType == "canvas" || aiResponse.contentType == "image" || aiResponse.contentType == "physics") {
          const newAiMessage: O1MessagesInput | GPT4oMessagesInput = { role: 'assistant', content: aiResponse.content, componentMessageType: aiResponse.contentType }

          setMessages(prevMessages => [...prevMessages, newAiMessage])
          await submitMessage(userId, chatSessionId, newAiMessage)
          return
        }
        const newAiMessage: O1MessagesInput | GPT4oMessagesInput = { role: 'assistant', content: aiResponse.content }

        setMessages(prevMessages => [...prevMessages, newAiMessage])
        await submitMessage(userId, chatSessionId, newAiMessage)

        return
      } catch (error) {
        console.error('Error generating AI response:', error)
        setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
      } finally {
        setIsLoading(false)
        return
      }
    }

    try {
      await submitMessage(userId, chatId, newUserMessage)

      const aiResponse = await fetchGenerateAIResponse([...messages, newUserMessage])

      console.log(aiResponse)

      if (aiResponse.contentType === 'quiz' || aiResponse.contentType === 'ppt' || aiResponse.contentType == 'flashcards' || aiResponse.contentType == 'spelling' || aiResponse.contentType == "canvas" || aiResponse.contentType == "image" || aiResponse.contentType == "physics") {
        const newAiMessage: O1MessagesInput | GPT4oMessagesInput = { role: 'assistant', content: aiResponse.content, componentMessageType: aiResponse.contentType }

        setMessages(prevMessages => [...prevMessages, newAiMessage])
        await submitMessage(userId, chatId, newAiMessage)
        return
      }
      const newAiMessage: O1MessagesInput | GPT4oMessagesInput = { role: 'assistant', content: aiResponse.content }

      setMessages(prevMessages => [...prevMessages, newAiMessage])
      await submitMessage(userId, chatId, newAiMessage)
    } catch (error) {
      console.error('Error generating AI response:', error)
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full max-w-3xl h-full mx-auto px-4">
      <AIChatMessages messages={messages} setMessages={setMessages} />
      <form onSubmit={handleSubmit} className="p-4 bg-white border-2 border-black border-b-0 rounded-t-lg">
        <div className="flex space-x-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={rows}
            className="min-h-[40px] max-h-[200px] resize-none"
          />
          <Button type="submit" disabled={isLoading}>
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  )
}