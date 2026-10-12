import React, { useEffect, useRef, useState } from 'react'
import { Bot, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import './TechieChatbot.css'

const API_BASE_URL = (import.meta.env.VITE_CHATBOT_API_URL || '').trim().replace(/\/+$/, '')
const WHATSAPP_URL = 'https://wa.me/918310808011'
const MAX_MESSAGE_LENGTH = 2000
const LOGO_URL = '/Projects/tech-in-air-logo.jpeg'
const QUICK_REPLIES = [
  '🚀 Start a Project',
  '💰 Pricing',
  '📂 View Projects',
  '📄 Documentation & PPT',
  '🔧 Hardware Projects',
  '💬 Contact Us',
]

const initialMessage =
  "Hi, I'm Techie, the Tech in Air assistant. Ask me a question, or tell me a little about what you're looking for."

const stripMarkdown = (text) =>
  text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1$2')
    .replace(/(^|[^_])_([^_\n]+)_(?!_)/g, '$1$2')
    .replace(/`([^`]+)`/g, '$1')

function renderLinkedText(text) {
  const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)|(https?:\/\/[^\s<]+|mailto:[^\s<]+)/g
  const nodes = []
  let lastIndex = 0
  let match
  let key = 0

  while ((match = linkPattern.exec(text)) !== null) {
    const rawUrl = match[2] || match[3]
    const url = rawUrl.replace(/[.,!?;:]+$/, '')
    const trailingText = rawUrl.slice(url.length)
    const label = match[1] || url

    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    nodes.push(
      <a key={`link-${key++}`} href={url} target={url.startsWith('http') ? '_blank' : undefined} rel={url.startsWith('http') ? 'noreferrer' : undefined}>
        {label}
      </a>
    )
    if (trailingText) nodes.push(trailingText)
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

function renderAssistantText(text) {
  const lines = stripMarkdown(text).split(/\r?\n/)
  const blocks = []
  let paragraphLines = []
  let listItems = []
  let key = 0

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return
    blocks.push(<p key={`paragraph-${key++}`}>{renderLinkedText(paragraphLines.join(' '))}</p>)
    paragraphLines = []
  }

  const flushList = () => {
    if (listItems.length === 0) return
    blocks.push(
      <ul key={`list-${key++}`}>
        {listItems.map((item, index) => (
          <li key={`item-${index}`}>{renderLinkedText(item)}</li>
        ))}
      </ul>
    )
    listItems = []
  }

  lines.forEach((line) => {
    const trimmedLine = line.trim()
    const bullet = trimmedLine.match(/^(?:[-*+]|\d+[.)])\s+(.+)$/)

    if (!trimmedLine || /^([-*_]\s*){3,}$/.test(trimmedLine)) {
      flushParagraph()
      flushList()
      return
    }

    if (bullet) {
      flushParagraph()
      listItems.push(bullet[1])
      return
    }

    flushList()
    paragraphLines.push(trimmedLine)
  })

  flushParagraph()
  flushList()
  return blocks
}

export default function TechieChatbot({ context = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const launcherRef = useRef(null)
  const isSubmittingRef = useRef(false)
  const historyRef = useRef([])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [messages, isLoading, errorMessage])

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        launcherRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const sendMessage = async (messageText) => {
    const message = messageText.trim()

    if (!message || message.length > MAX_MESSAGE_LENGTH || isSubmittingRef.current) return

    if (!API_BASE_URL) {
      setErrorMessage(
        'Techie is not connected yet. Please contact Tech in Air on WhatsApp instead.'
      )
      return
    }

    isSubmittingRef.current = true
    setIsLoading(true)
    setErrorMessage('')
    setInput('')
    setMessages((current) => [...current, { role: 'user', text: message }])

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context: (() => {
            const requestContext =
              typeof context === 'function' ? context(message, historyRef.current) : context
            return typeof requestContext === 'string' ? requestContext : ''
          })(),
          history: historyRef.current
            .filter(
              (item) =>
                item &&
                ['user', 'model'].includes(item.role) &&
                typeof item.text === 'string' &&
                item.text.trim()
            )
            .slice(-8)
            .map(({ role, text }) => ({
              role,
              text: text.slice(0, MAX_MESSAGE_LENGTH),
            })),
        }),
      })

      let data
      try {
        data = await response.json()
      } catch {
        throw new Error(
          response.ok
            ? 'Techie could not read the reply. Please try again.'
            : 'Techie is temporarily unavailable. Please try again shortly.'
        )
      }

      if (!response.ok) {
        throw new Error(
          typeof data?.error === 'string' && data.error.trim()
            ? data.error
            : 'Techie is temporarily unavailable. Please try again shortly.'
        )
      }

      if (typeof data?.reply !== 'string' || !data.reply.trim()) {
        throw new Error('Techie could not prepare a reply. Please try again.')
      }

      const reply = data.reply.trim()
      historyRef.current = [
        ...historyRef.current,
        { role: 'user', text: message },
        { role: 'model', text: reply },
      ].slice(-8)
      setMessages((current) => [...current, { role: 'model', text: reply }])
    } catch (error) {
      setErrorMessage(
        error instanceof TypeError
          ? 'Techie could not connect right now. Check your connection or contact us on WhatsApp.'
          : error.message || 'Techie is temporarily unavailable. Please try again shortly.'
      )
    } finally {
      isSubmittingRef.current = false
      setIsLoading(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    void sendMessage(input)
  }

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div className="techie-chatbot">
      {isOpen && (
        <section
          id="techie-chat-panel"
          className="techie-chat-panel"
          role="dialog"
          aria-labelledby="techie-chat-title"
        >
          <header className="techie-chat-header">
            <div className="techie-chat-brand">
              <span className="techie-chat-logo-wrap">
                <img src={LOGO_URL} alt="Tech in Air" className="techie-chat-logo" />
              </span>
              <div>
                <h2 id="techie-chat-title">Techie</h2>
                <p>Tech in Air assistant</p>
              </div>
            </div>
            <button
              type="button"
              className="techie-icon-button techie-close-button"
              onClick={() => {
                setIsOpen(false)
                launcherRef.current?.focus()
              }}
              aria-label="Close Techie chat"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </header>

          <div className="techie-chat-messages" aria-live="polite" aria-relevant="additions text">
            {messages.length === 0 ? (
              <div className="techie-welcome">
                <span className="techie-welcome-icon" aria-hidden="true">
                  <Sparkles size={22} />
                </span>
                <h3>Welcome! How can I help?</h3>
                <p>{initialMessage}</p>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                  Prefer WhatsApp? Message us
                </a>
                <div className="techie-quick-replies" aria-label="Suggested questions">
                  {QUICK_REPLIES.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="techie-quick-reply"
                      onClick={() => void sendMessage(suggestion)}
                      disabled={isLoading}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  className={`techie-message techie-message-${message.role}`}
                  key={`${message.role}-${index}`}
                >
                  {message.role === 'model' && (
                    <span className="techie-message-avatar" aria-hidden="true">
                      <Bot size={16} />
                    </span>
                  )}
                  <div className="techie-message-content">{renderAssistantText(message.text)}</div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="techie-message techie-message-model" role="status">
                <span className="techie-message-avatar" aria-hidden="true">
                  <Bot size={16} />
                </span>
                <span className="techie-loading-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="techie-visually-hidden">Techie is preparing a reply</span>
              </div>
            )}

            {errorMessage && (
              <div className="techie-error" role="alert">
                <p>{errorMessage}</p>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                  Contact us on WhatsApp
                </a>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="techie-chat-form" onSubmit={handleSubmit}>
            <label className="techie-visually-hidden" htmlFor="techie-chat-input">
              Message Techie
            </label>
            <textarea
              id="techie-chat-input"
              ref={inputRef}
              value={input}
              onChange={(event) => {
                setInput(event.target.value)
                if (errorMessage) setErrorMessage('')
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="Ask Techie a question..."
              rows={2}
              maxLength={MAX_MESSAGE_LENGTH}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="techie-send-button"
              aria-label="Send message"
              disabled={isLoading || !input.trim()}
            >
              <Send size={18} aria-hidden="true" />
            </button>
            <p className="techie-input-hint">
              Enter to send · Shift+Enter for a new line
              <span>{input.length}/{MAX_MESSAGE_LENGTH}</span>
            </p>
          </form>
        </section>
      )}

      <button
        ref={launcherRef}
        type="button"
        className="techie-launcher"
        aria-label={isOpen ? 'Close Techie chat' : 'Open Techie chat'}
        aria-expanded={isOpen}
        aria-controls="techie-chat-panel"
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? <X size={25} aria-hidden="true" /> : <MessageCircle size={25} aria-hidden="true" />}
      </button>
    </div>
  )
}
