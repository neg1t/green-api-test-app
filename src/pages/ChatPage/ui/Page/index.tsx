import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import React, { useRef, useEffect, useMemo } from 'react'
import { Button, Input, InputRef } from 'antd'
import { useStore } from 'effector-react'
import { PlusOutlined, SendOutlined, LogoutOutlined } from '@ant-design/icons'
import { chatModel, messagesModel } from 'pages/ChatPage/model'
import { IChat } from 'pages/ChatPage/model/chat'
import { accountStatusModel } from 'entities/AccountStatus'
import './styles.scss'
import { authModel } from 'entities/Auth'

export const ChatPage: React.FC = () => {
  const messageValue = useStore(messagesModel.stores.$inputMessage)
  const chats = useStore(chatModel.stores.$chats)
  const selectedChat = useStore(chatModel.stores.$selectedChat)
  const accountStatus = useStore(accountStatusModel.stores.$accountStatus)
  const messageInChat = useStore(messagesModel.stores.$messagesInChat)
  const messagesInSelectedChat = useMemo(() => {
    return messageInChat.find(
      (chatItem) => chatItem.chatId === selectedChat?.chatId
    )
  }, [selectedChat, messageInChat])

  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const newChatNumberRef = useRef<InputRef>(null)

  useEffect(() => {
    if (accountStatus === 'notAuthorized') {
      navigate('/account-auth')
    }
  }, [accountStatus])

  useEffect(() => {
    scrollToBottom()
  }, [messagesInSelectedChat])

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const changeMessageValueHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    messagesModel.events.inputMessageChange(event.target.value)
  }

  const submitMessageHandler = () => {
    messagesModel.events.messageSend()
  }

  const updateNewChatHandler = (id: number) => () => {
    chatModel.events.chatUpdate({
      id: id,
      chatId: newChatNumberRef?.current?.input?.value + '@c.us' || ''
    })
  }

  const addNewChatHandler = () => {
    chatModel.events.chatAdd({
      id: chats.length + 1
    })
  }

  const selectChatHandler = (chat: IChat) => () => {
    chatModel.events.chatSelect(chat)
  }

  const loadoutHandler = () => {
    authModel.events.logout()
  }

  return (
    <div className='chat-page'>
      <div className='chat-page__chats'>
        <Button
          type='primary'
          onClick={loadoutHandler}
          style={{ margin: '20px 0px 0px 0px' }}
          className='message-input__button'
          icon={<LogoutOutlined />}
        />
        <Button
          icon={<PlusOutlined />}
          style={{ margin: '20px 0px', padding: '0px 20px' }}
          type='primary'
          onClick={addNewChatHandler}
        >
          Новый чат
        </Button>
        {chats.map((chat, index) => (
          <div key={index} className='chat'>
            {chat.chatId ? (
              <div
                onClick={selectChatHandler(chat)}
                className={clsx(
                  'chat__card',
                  selectedChat?.id === chat.id && 'chat__card_selected'
                )}
              >
                {chat.chatId}
              </div>
            ) : (
              <Input
                style={{ margin: '20px 0px' }}
                placeholder='Введите номер телефона'
                ref={newChatNumberRef}
                onPressEnter={updateNewChatHandler(chat.id)}
              />
            )}
          </div>
        ))}
      </div>
      <div className='chat-page__messages'>
        <div className='chat'>
          {!!selectedChat?.chatId &&
            messagesInSelectedChat?.messages.map((message, index) => (
              <div
                key={index}
                className={clsx(
                  'chat__message',
                  message.type === 'incoming'
                    ? 'chat__message_incoming'
                    : 'chat__message_outgoing'
                )}
              >
                <span>{message.textMessage}</span>
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
        <div className='message-input'>
          <Input
            onPressEnter={submitMessageHandler}
            placeholder='Введите сообщение'
            value={messageValue}
            onChange={changeMessageValueHandler}
          />
          <Button
            type='primary'
            disabled={!messageValue || !selectedChat?.chatId}
            onClick={submitMessageHandler}
            className='message-input__button'
            icon={<SendOutlined />}
          />
        </div>
      </div>
    </div>
  )
}
