import { createEvent, createStore, forward, sample } from 'effector'
import { chatModel } from 'pages/ChatPage/model'
import {
  fetchDeleteNotification,
  fetchReceiveNotification,
  fetchSendMessage
} from 'shared/api/api'
import { ISendMessageData } from 'shared/api/types'

type TMessage = 'incoming' | 'outgoing'

interface IMessageInChatAdd {
  chatId: string
  textMessage: string
  type: TMessage
}

export interface IMessagesInChat {
  chatId: string
  messages: {
    type: TMessage
    textMessage: string
  }[]
}

const inputMessageChange = createEvent<string>()
const messageSend = createEvent()
const messageReset = createEvent()
const messageInChatAdd = createEvent<IMessageInChatAdd>()

const $inputMessage = createStore('')
  .on(inputMessageChange, (_, value) => value)
  .reset(messageReset)

const $messagesInChat = createStore<IMessagesInChat[]>([]).on(
  messageInChatAdd,
  (state, payload) => {
    if (
      !state.length ||
      !state.find((chat) => chat.chatId === payload.chatId)
    ) {
      return [
        ...state,
        {
          chatId: payload.chatId,
          messages: [{ textMessage: payload.textMessage, type: payload.type }]
        }
      ]
    }
    return state.map((chatMessage) => {
      if (chatMessage.chatId === payload.chatId) {
        return {
          ...chatMessage,
          messages: [
            ...chatMessage.messages,
            { textMessage: payload.textMessage, type: payload.type }
          ]
        }
      }
      return chatMessage
    })
  }
)

const outgoingMessageSend = sample({
  clock: messageInChatAdd,
  filter: ({ type }) => type === 'outgoing'
})

const notificationReceived = sample({
  clock: fetchReceiveNotification.doneData,
  filter: (notification) => !!notification?.receiptId,
  fn: (notification) => notification
})

// отправляем новое сообщение пользователю
sample({
  clock: messageSend,
  source: {
    selectedChat: chatModel.stores.$selectedChat,
    message: $inputMessage
  },
  fn: ({ selectedChat, message }): IMessageInChatAdd => {
    return {
      chatId: selectedChat?.chatId || '',
      textMessage: message,
      type: 'outgoing'
    }
  },
  target: messageInChatAdd
})

//если пришло сообщение добавляем его в чат
sample({
  clock: notificationReceived,
  filter: (notification) =>
    notification?.body.typeWebhook === 'incomingMessageReceived',
  fn: (notification): IMessageInChatAdd => {
    return {
      chatId: notification?.body.senderData.chatId || '',
      textMessage:
        notification?.body.messageData.textMessageData.textMessage || '',
      type: 'incoming'
    }
  },
  target: messageInChatAdd
})

// удаляем уведомление
sample({
  clock: notificationReceived,
  fn: (notification) => notification?.receiptId || 1,
  target: fetchDeleteNotification
})

// отправляем сообщение на сервер
sample({
  clock: outgoingMessageSend,
  fn: ({ chatId, textMessage }): ISendMessageData => ({
    chatId,
    message: textMessage
  }),
  target: [fetchSendMessage, messageReset]
})

// после удаление отправляем запрос на новые уведомления
forward({
  from: fetchDeleteNotification.doneData,
  to: fetchReceiveNotification
})

// после получения уведомления отправляем запрос на новые уведомления
// при условии что уведомлений нет
sample({
  clock: fetchReceiveNotification.doneData,
  filter: (notification) => !notification?.receiptId,
  target: fetchReceiveNotification
})

export const stores = {
  $inputMessage,
  $messagesInChat
}

export const events = {
  inputMessageChange,
  messageSend,
  messageInChatAdd
}
