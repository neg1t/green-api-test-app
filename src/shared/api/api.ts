import { createEffect } from 'effector'
import axiosInstance from 'shared/utils/axios'
import { makeRequestURL } from 'shared/utils/helpers'
import {
  IAccountSetting,
  IReceiveNotification,
  IResponseAccountInfo,
  IResponseAccountSetting,
  IResponseQrCode,
  IResponseSendMessage,
  ISendMessageData
} from './types'

// Отправка сообщения
export const fetchSendMessage = createEffect<
  ISendMessageData,
  IResponseSendMessage
>(async (data) => {
  try {
    const res: IResponseSendMessage = await axiosInstance.post(
      makeRequestURL('sendMessage'),
      data
    )
    return res
  } catch (err) {
    return Promise.reject(err)
  }
})

// получение статуса аккаунта
export const fetchAccountStatus = createEffect<void, IResponseAccountInfo>(
  async () => {
    try {
      const res: IResponseAccountInfo = await axiosInstance.get(
        makeRequestURL('getStateInstance')
      )
      return res
    } catch (err) {
      return Promise.reject(err)
    }
  }
)

// установка настроек аккаунта
export const fetchSetAccountSetting = createEffect<
  IAccountSetting,
  IResponseAccountSetting
>(async (data) => {
  try {
    const res: IResponseAccountSetting = await axiosInstance.post(
      makeRequestURL('setSettings'),
      data
    )
    return res
  } catch (err) {
    return Promise.reject(err)
  }
})

// получение QR для активации аккаунта
export const fetchQrCode = createEffect<void, IResponseQrCode>(async () => {
  try {
    const res: IResponseQrCode = await axiosInstance.get(makeRequestURL('qr'))
    return res
  } catch (err) {
    return Promise.reject(err)
  }
})

// получение сообщения
export const fetchReceiveNotification = createEffect<
  void,
  IReceiveNotification | null
>(async () => {
  try {
    const res: IReceiveNotification = await axiosInstance.get(
      makeRequestURL('receiveNotification')
    )
    return res
  } catch (err) {
    return Promise.reject(err)
  }
})
// получение QR для активации аккаунта
export const fetchDeleteNotification = createEffect<
  number,
  { result: boolean }
>(async (receiptId) => {
  try {
    const res: { result: boolean } = await axiosInstance.delete(
      `${makeRequestURL('deleteNotification')}/${receiptId}`
    )
    return res
  } catch (err) {
    return Promise.reject(err)
  }
})
