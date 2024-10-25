"use client";

import { useToast } from "@/hooks/use-toast";
import { useChat } from "ai/react";
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Send, Loader2, User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const TypingAnimation = () => (
  <div className="flex space-x-1">
    <div
      className="w-2 h-2 bg-primary rounded-full animate-bounce"
      style={{ animationDelay: "0s" }}
    ></div>
    <div
      className="w-2 h-2 bg-primary rounded-full animate-bounce"
      style={{ animationDelay: "0.2s" }}
    ></div>
    <div
      className="w-2 h-2 bg-primary rounded-full animate-bounce"
      style={{ animationDelay: "0.4s" }}
    ></div>
  </div>
);

export const Chat = () => {
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: chatEndpointIsLoading,
  } = useChat({
    api: "/api/chat",
    streamMode: "text",
    initialMessages: [
      {
        id: "welcome",
        role: "system",
        content: "Welcome! How can I assist you today?",
      },
    ],
    onError: (e) => {
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const groupedMessages = messages.reduce((acc, message, index) => {
    if (index === 0 || message.role !== messages[index - 1].role) {
      acc.push([message]);
    } else {
      acc[acc.length - 1].push(message);
    }
    return acc;
  }, [] as (typeof messages)[]);

  return (
    <Card className="w-full bg-transparent shadow-none border-0">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[50vh] pr-4" ref={scrollAreaRef}>
          {groupedMessages.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className={`mb-4 ${
                group[0].role === "user" ? "flex flex-col items-end" : ""
              }`}
            >
              {group.map((message, messageIndex) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : message.role === "system"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted"
                  } max-w-[80%] w-fit ${messageIndex > 0 ? "mt-1" : ""}`}
                >
                  {messageIndex === 0 && (
                    <div className="flex items-center mb-1">
                      {message.role === "user" ? (
                        <User className="h-4 w-4 mr-1" />
                      ) : message.role === "assistant" ? (
                        <Bot className="h-4 w-4 mr-1" />
                      ) : null}
                      <span className="text-xs font-semibold">
                        {message.role === "user"
                          ? "You"
                          : message.role === "assistant"
                          ? "AI"
                          : "System"}
                      </span>
                    </div>
                  )}
                  <ReactMarkdown
                    className="text-sm markdown-content"
                    components={{
                      // @ts-expect-error - `node` is not used but required by the type definition
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          // @ts-expect-error - `children` is not used but required by the type definition
                          <SyntaxHighlighter
                            {...props}
                            children={String(children).replace(/\n$/, "")}
                            style={atomDark}
                            language={match[1]}
                            PreTag="div"
                          />
                        ) : (
                          <code {...props} className={className}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          ))}
          {chatEndpointIsLoading && (
            <div className="flex justify-start">
              <div className="p-3 rounded-lg bg-muted max-w-[80%] w-fit">
                <TypingAnimation />
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            className="flex-grow"
          />
          <Button type="submit" size="icon" disabled={chatEndpointIsLoading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};
