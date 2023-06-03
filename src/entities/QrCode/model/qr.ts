import { createStore, guard, sample } from 'effector'
import { delay } from 'patronum/delay'
import { fetchAccountStatus, fetchQrCode } from 'shared/api/api'

const $qr = createStore<string>('').on(
  fetchQrCode.doneData,
  (_state, payload) => payload.message
)

// если при получении qr-кода придет ответ, что пользователь уже авторизован, то запрашиваем статус аккаунта
sample({
  clock: fetchQrCode.doneData,
  filter: (response) => response.type === 'alreadyLogged',
  target: fetchAccountStatus
})

// если при получении qr-кода придет ответ, что пользователь еще не авторизован, то запрашиваем новый qr-код
delay({
  source: guard({
    clock: fetchQrCode.doneData,
    filter: (response) => response.type !== 'alreadyLogged'
  }),
  timeout: 5 * 1000,
  target: fetchQrCode
})

export const stores = {
  $qr
}
