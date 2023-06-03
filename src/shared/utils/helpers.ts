import { authModel } from 'entities/Auth'

export const makeRequestURL = (method: string): string => {
  const auth = authModel.stores.$tokens.getState()
  return `waInstance${auth?.idInstance}/${method}/${auth?.apiTokenInstance}`
}
