import { useStore } from 'effector-react'
import { authModel } from 'entities/Auth'
import { FC } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { accountStatusModel } from 'entities/AccountStatus'
import { Spin } from 'antd'

export const AuthenticationGuard: FC = () => {
  const isAuthenticated = useStore(authModel.stores.$tokens)
  const accountStatus = useStore(accountStatusModel.stores.$accountStatus)

  if (!isAuthenticated) {
    return <Navigate to='/authorization' />
  }

  if (isAuthenticated && !accountStatus) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Spin size='large' />
      </div>
    )
  }

  return <Outlet />
}
