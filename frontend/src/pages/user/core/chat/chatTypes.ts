export type ChatContext = {
  threadId: string
  peerName: string
  peerRole: string
  listingTitle: string
  listingImage: string
  listingRate?: string
  draft?: string
}

export type ChatMessage = {
  id: string
  fromMe: boolean
  text: string
}

export type ChatThread = ChatContext & {
  lastMessage: string
  time: string
  messages: ChatMessage[]
}
