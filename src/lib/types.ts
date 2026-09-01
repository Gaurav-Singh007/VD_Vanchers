export interface Lead {
  id: string
  name: string
  phone: string
  email: string | null
  message: string | null
  source: string
  status: string
  qualified: boolean
  budget: string | null
  timeline: string | null
  created_at: string
}

export interface ChatMessage {
  role: 'bot' | 'user'
  text: string
}
