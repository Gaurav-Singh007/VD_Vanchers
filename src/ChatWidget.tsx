import { useState, useRef, useEffect } from 'react'
import { supabase } from './lib/supabase'
import type { ChatMessage } from './lib/types'

const QUICK_REPLIES = [
  'Tell me about pricing',
  'What are the amenities?',
  'Where is the location?',
  'Book a site visit',
]

const BOT_RESPONSES: Record<string, string> = {
  pricing: 'The Highway Farms land parcels start at a <strong>base price of Rs. 15,499 per sq. yd.</strong> The total price for a 1,008 sq. yd. parcel is <strong>Rs. 1,56,22,992</strong> (including all charges). Corner plots have a 10% premium. Prices are expected to rise soon due to Adani acquiring Jaypee Sports City nearby. Would you like a detailed breakdown?',
  amenities: 'The Highway Farms offers world-class amenities: <strong>Clubhouse (7,060 sq. yd.), Swimming Pool, Golf Course, Restaurant, Kids Play Area, Live Music Arena, and Stud Farming.</strong> All set across 30 acres of premium land near Yamuna Expressway.',
  location: 'The Highway Farms is strategically located near Yamuna Expressway with excellent connectivity: <strong>5 min</strong> to Galgotias University, Jaypee Sports City, International Cricket Stadium, Buddha Circuit & IT Hub. <strong>10 min</strong> to Film City. <strong>15 min</strong> to Noida International Airport (Jewar).',
  visit: 'Great! I can help you book a site visit. Please share your <strong>name and phone number</strong> and our team will call you to schedule a visit to The Highway Farms.',
  default: 'I can help you with information about <strong>The Highway Farms</strong> — pricing, amenities, location, farmhouse specifications, or booking a site visit. What would you like to know?',
  budget: 'The total price for a land parcel is <strong>Rs. 1,56,22,992</strong>. This includes base price, development charges, electricity charges, club membership (Rs. 2,50,000), and maintenance charges. Corner plots have a 10% premium. Prices are likely to rise soon — would you like to speak with our sales team?',
  size: 'Each land parcel is <strong>1,008 sq. yd. (9,072 sq. ft. / 6.66 kattha / 842.82 sq. meters)</strong>. The project spans <strong>30 acres</strong> with <strong>106 land parcels</strong>. Government electricity is approved. You can build your own farmhouse on this land subject to approvals.',
  default2: 'I can help you with pricing, amenities, location, farmhouse sizes, or booking a site visit. What interests you most?',
}

function getBotResponse(userText: string): string {
  const lower = userText.toLowerCase()
  if (lower.includes('price') || lower.includes('cost') || lower.includes('budget') || lower.includes('kitna') || lower.includes('kitne')) {
    return BOT_RESPONSES.pricing
  }
  if (lower.includes('amenit') || lower.includes('facility') || lower.includes('feature')) {
    return BOT_RESPONSES.amenities
  }
  if (lower.includes('location') || lower.includes('where') || lower.includes('address') || lower.includes('kahan')) {
    return BOT_RESPONSES.location
  }
  if (lower.includes('visit') || lower.includes('book') || lower.includes('site') || lower.includes('schedule')) {
    return BOT_RESPONSES.visit
  }
  if (lower.includes('size') || lower.includes('area') || lower.includes('dimension') || lower.includes('kitna bada')) {
    return BOT_RESPONSES.size
  }
  if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('namaste')) {
    return 'Namaste! Welcome to <strong>VD Vanchers — The Highway Farms</strong>. I am your AI assistant. I can help you with pricing, amenities, location, farmhouse specifications, or booking a site visit. How can I help you today?'
  }
  return BOT_RESPONSES.default
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: 'Namaste! Welcome to <strong>VD Vanchers — The Highway Farms</strong>. I am your AI assistant. I can help you with pricing, amenities, location, farmhouse specifications, or booking a site visit. How can I help you today?' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [leadData, setLeadData] = useState<{ name?: string; phone?: string }>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  async function sendMessage(text: string) {
    if (!text.trim()) return

    const userMsg: ChatMessage = { role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    const lower = text.toLowerCase()

    if (lower.includes('book') || lower.includes('visit') || lower.includes('call') || lower.includes('contact')) {
      setLeadData((prev) => ({ ...prev }))
    }

    const phoneMatch = text.match(/[\+]?[0-9]{10,13}/)
    if (phoneMatch && !leadData.phone) {
      setLeadData((prev) => ({ ...prev, phone: phoneMatch[0] }))
    }

    const nameMatch = text.match(/(?:my name is|i am|name:?)\s+([a-zA-Z\s]+)/i)
    if (nameMatch && !leadData.name) {
      setLeadData((prev) => ({ ...prev, name: nameMatch[1].trim() }))
    }

    if (leadData.phone && leadData.name) {
      try {
        await supabase.from('leads').insert({
          name: leadData.name,
          phone: leadData.phone,
          source: 'chat-widget',
          status: 'new',
          qualified: true,
        })
      } catch {
        // silently fail — user experience first
      }
    }

    setTimeout(() => {
      const response = getBotResponse(text)
      setMessages((prev) => [...prev, { role: 'bot', text: response }])
      setTyping(false)
    }, 800)
  }

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-header-avatar">🤖</div>
              <div className="chat-header-text">
                <h4>VD Vanchers Assistant</h4>
                <span>Online — Typically replies instantly</span>
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-message ${msg.role}`}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            ))}
            {typing && (
              <div className="chat-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 2 && (
            <div className="chat-quick-replies">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  className="chat-quick-reply"
                  onClick={() => sendMessage(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(input)
                }
              }}
            />
            <button
              className="chat-send"
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <button
        className="chat-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle chat"
      >
        {open ? '×' : '💬'}
      </button>
    </div>
  )
}
