import { Spin } from 'antd'
import { useStore } from 'effector-react'
import { accountStatusModel } from 'entities/AccountStatus'
import { qrCodeModel } from 'entities/QrCode'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchQrCode } from 'shared/api/api'
import './styles.scss'

export const AccountAuthPage: React.FC = () => {
  const accountStatus = useStore(accountStatusModel.stores.$accountStatus)
  const qr = useStore(qrCodeModel.stores.$qr)

  const navigate = useNavigate()

  useEffect(() => {
    fetchQrCode()
    if (accountStatus === 'authorized') {
      navigate('/')
    }
  }, [accountStatus])

  return (
    <div className='account-auth'>
      <div className='account-auth__container'>
        <span className='title'>
          Ваш аккаунт не авторизирован, отсканируйте QR-код в приложении
          WhatsApp
        </span>
        {!qr ? (
          <Spin />
        ) : (
          <img className='qr-code' src={`data:image/png;base64,${qr}`} />
        )}
      </div>
    </div>
  )
}
