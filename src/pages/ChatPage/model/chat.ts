import { createStore, createEvent } from 'effector'

export interface IChat {
  id: number
  chatId?: string
}

const chatAdd = createEvent<IChat>()
const chatUpdate = createEvent<IChat>()
const chatSelect = createEvent<IChat>()

const $chats = createStore<IChat[]>([])
  .on(chatAdd, (state, chat) => [...state, chat])
  .on(chatUpdate, (state, payload) => {
    return state.map((chat) => {
      if (chat.id === payload.id) {
        return {
          ...chat,
          chatId: payload.chatId
        }
      }
      return chat
    })
  })

const $selectedChat = createStore<IChat | null>(null).on(
  chatSelect,
  (_, chat) => chat
)

export const stores = {
  $chats,
  $selectedChat
}

export const events = {
  chatAdd,
  chatUpdate,
  chatSelect
}
