export interface ISendMessageData {
  chatId: string
  message: string
  quotedMessageId?: string
  archiveChat?: boolean
  linkPreview?: boolean
}

export type TStateInstace =
  | 'notAuthorized'
  | 'authorized'
  | 'blocked'
  | 'sleepMode'
  | 'starting'

export interface IAccountSetting {
  webhookUrl: string
  outgoingWebhook: string
  stateWebhook: string
  incomingWebhook: string
}
//? response interfaces

export interface IResponseAccountInfo {
  stateInstance: TStateInstace
}
export interface IResponseSendMessage {
  idMessage: string
}

export interface IResponseAccountSetting {
  saveSettings: boolean
}

export interface IResponseQrCode {
  type: 'qrCode' | 'error' | 'alreadyLogged'
  message: string
}

export interface IReceiveNotification {
  receiptId: number
  body: {
    typeWebhook: string
    instanceData: {
      idInstance: number
      wid: string
      typeInstance: string
    }
    timestamp: number
    idMessage: string
    senderData: {
      chatId: string
      sender: string
      senderName: string
    }
    messageData: {
      typeMessage: string
      textMessageData: {
        textMessage: string
      }
    }
  }
}
