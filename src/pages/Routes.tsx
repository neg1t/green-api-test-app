import { authModel } from 'entities/Auth'
import { AuthenticationGuard } from 'feature/AuthenticationGuard'
import { LoginLayout } from 'feature/LoginLayout'
import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AccountAuthPage } from './AccountAuth'
import { AuthPage } from './AuthPage'
import { ChatPage } from './ChatPage'

export const Pages = () => {
  useEffect(() => {
    authModel.events.getAuthTokens()
  }, [])
  return (
    <Routes>
      <Route path='/' element={<AuthenticationGuard />}>
        <Route path='/' element={<Navigate replace to='/chat' />} />
        <Route path='/chat' element={<ChatPage />} />
        <Route path='/account-auth' element={<AccountAuthPage />} />
      </Route>

      <Route element={<LoginLayout />}>
        <Route path='/authorization' element={<AuthPage />} />
        <Route path='*' element={<Navigate to='/authorization' replace />} />
      </Route>
    </Routes>
  )
}
