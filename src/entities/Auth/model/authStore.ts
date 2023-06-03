import { createEvent, createStore, forward, sample } from 'effector'
import { fetchAccountStatus } from 'shared/api/api'

type TToken = 'idInstance' | 'apiTokenInstance'

export type IAuth = {
  [key in TToken]: string | number
}

const getAuthTokens = createEvent()
const setAuthTokens = createEvent<IAuth>()
const logout = createEvent()

export const $tokens = createStore<IAuth | null>(null)
  .on(setAuthTokens, (_state, payload) => payload)
  .reset(logout)

sample({
  clock: getAuthTokens,
  fn: (): IAuth => {
    const idInstance = localStorage.getItem('idInstance') || ''
    const apiTokenInstance = localStorage.getItem('apiTokenInstance') || ''
    return {
      idInstance,
      apiTokenInstance
    }
  },
  target: setAuthTokens
})

sample({
  clock: setAuthTokens,
  fn: (tokens) => {
    localStorage.setItem('idInstance', tokens.idInstance.toString())
    localStorage.setItem('apiTokenInstance', tokens.apiTokenInstance.toString())
    return tokens
  }
})

sample({
  clock: logout,
  fn: () => {
    localStorage.removeItem('idInstance')
    localStorage.removeItem('apiTokenInstance')
  }
})

// после обновления токенов проверяем статус аккаунта
forward({
  from: $tokens,
  to: fetchAccountStatus
})

export const stores = {
  $tokens
}

export const events = {
  getAuthTokens,
  setAuthTokens,
  logout
}
