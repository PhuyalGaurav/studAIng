/* eslint-disable @typescript-eslint/no-unused-vars */
import { ScrollArea } from "../ui/scroll-area";
import { GPT4oMessagesInput, O1MessagesInput } from "@/lib/types";
import Quiz from "./interactive-components/quiz";
import PptSlides from "./interactive-components/PptSlides";
import Flashcards from "./interactive-components/flashcards";
import ImageUploader from "./interactive-components/ImageUploader";
import DrawingCanvas from "./interactive-components/DrawingCanvas";
import Spelling from "./interactive-components/spelling";
import PhysicsSimulator from "./interactive-components/PhysicsSimulator";
import ReactMarkdown from 'react-markdown';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import React from "react";

interface AIChatMessagesProps {
  messages: GPT4oMessagesInput[] | O1MessagesInput[];
  setMessages: React.Dispatch<React.SetStateAction<GPT4oMessagesInput[] | O1MessagesInput[]>>;
}

export default function AIChatMessages({ messages, setMessages }: AIChatMessagesProps) {
  console.log(messages);

  return (
    <ScrollArea className="flex-grow w-full p-0 md:p-2 space-y-4">
      {messages.map((message, index) => {

        if (message.content && message.content.length > 0 && typeof message.content[0] !== 'string' && message.content[0].type === "image_url") {
          return
        }

        return (
          <div
            key={index}
            className={`flex items-start space-x-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role !== 'user' && (
              <Avatar className="bg-muted flex-shrink-0 w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10">
                <AvatarFallback>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#A0AEC0" strokeWidth="2" />
                  </svg>
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={`rounded-lg mb-4 ${message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted border-2 border-gray-300'
                }
              ${!message.componentMessageType && 'py-2 px-4'}
              `}

            >
              {message.content ? (
                (() => {
                  switch (message.componentMessageType) {
                    case 'quiz':
                      if (typeof message.content === 'string') {
                        const parsedContent = JSON.parse(message.content);
                        return <Quiz questions={parsedContent.questions} />;
                      }
                      break;
                    case 'ppt':
                      if (typeof message.content === 'string') {
                        const parsedContent = JSON.parse(message.content)
                        return <PptSlides slides={parsedContent.slides} />;
                      }
                      break;
                    case 'flashcards':
                      if (typeof message.content === 'string') {
                        const parsedContent = JSON.parse(message.content);
                        return <Flashcards flashcards={parsedContent.flashcards} />;
                      }
                      break;
                    case 'canvas':
                      console.log("canvas")
                      return <DrawingCanvas messages={messages} setMessages={setMessages} />
                    case 'image':
                      return <ImageUploader messages={messages} setMessages={setMessages} />
                    case 'spelling':
                      if (typeof message.content === 'string') {
                        const parsedContent = JSON.parse(message.content);
                        return <Spelling spellings={parsedContent.spellings} />;
                      }
                      break;
                    case 'physics':
                      if (typeof message.content === 'string') {
                        const parsedContent = JSON.parse(message.content);
                        return <PhysicsSimulator objects={parsedContent.objects} />;
                      }
                      break;
                    default:
                      return Array.isArray(message.content)
                        ? message.content.map((content, secondaryIndex) => {

                          if (typeof content === 'string') {

                            return (
                              <ReactMarkdown
                                key={secondaryIndex}
                                components={{
                                  h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-6 mb-2" {...props} />,
                                  p: ({ node, ...props }) => <p className="my-4" {...props} />,
                                  strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                                  ul: ({ node, ...props }) => <ul className="list-disc list-inside ml-4 my-2" {...props} />,
                                  li: ({ node, ...props }) => <li className="my-1" {...props} />,
                                }}
                              >
                                {content}
                              </ReactMarkdown>
                            )
                          }

                          // const contentExtracted = JSON.parse(content);

                          // return (
                          //   <div key={subIndex}>
                          //     {(typeof content === 'string')
                          //       ? content
                          //       : 'text' in content
                          //         ? content.text
                          //         : JSON.stringify(content)}
                          //   </div>
                          // )
                        })
                        : (
                          <ReactMarkdown
                          components={{
                            h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-6 mb-2" {...props} />,
                            p: ({ node, ...props }) => <p className="mt-0" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc list-inside ml-4 my-2" {...props} />,
                            li: ({ node, ...props }) => <li className="my-1" {...props} />,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                        );
                  }
                })()
              ) : (
                <div />
              )}
            </div>

            {message.role === 'user' && (
              <Avatar className="bg-muted w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 flex-shrink-0">
                <AvatarFallback>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#4A5568" />
                    <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20" fill="#A0AEC0" />
                  </svg>
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        )
      })}
    </ScrollArea>
  );
}
