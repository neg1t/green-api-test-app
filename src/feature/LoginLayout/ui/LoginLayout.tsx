import { Outlet } from 'react-router-dom'
import './loginLayout.scss'

export const LoginLayout = () => {
  return (
    <div className='login-layout'>
      <div className='login-layout__card'>
        <Outlet />
      </div>
    </div>
  )
}
