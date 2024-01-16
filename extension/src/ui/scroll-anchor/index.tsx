import { useEffect, useRef } from 'react'

interface ChatScrollAnchorProps {
  messages: unknown[]
}

export function BottomScroll({ messages }: ChatScrollAnchorProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return <div ref={messagesEndRef} className="h-5 w-full" />
}
