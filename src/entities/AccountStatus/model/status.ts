import { createStore, sample, createEvent } from 'effector'
import {
  fetchAccountStatus,
  fetchReceiveNotification,
  fetchSetAccountSetting
} from 'shared/api/api'
import { IAccountSetting, TStateInstace } from 'shared/api/types'

const accountStatusChange = createEvent<TStateInstace>()

const $accountStatus = createStore<TStateInstace | ''>('')
  .on(fetchAccountStatus.doneData, (_state, payload) => payload.stateInstance)
  .on(accountStatusChange, (_, payload) => payload)

sample({
  clock: $accountStatus,
  filter: (status) => status !== 'notAuthorized',
  fn: (): IAccountSetting => ({
    webhookUrl: '',
    outgoingWebhook: 'yes',
    stateWebhook: 'yes',
    incomingWebhook: 'yes'
  }),
  target: fetchSetAccountSetting
})

sample({
  clock: $accountStatus,
  filter: (status) => status === 'authorized',
  target: fetchReceiveNotification
})

export const events = {
  accountStatusChange
}

export const stores = {
  $accountStatus
}
