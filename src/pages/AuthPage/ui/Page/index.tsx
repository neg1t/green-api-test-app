import { useStore } from 'effector-react'
import { Button, Form, Input } from 'antd'
import { authModel } from 'entities/Auth'
import { IAuth } from 'entities/Auth/model/authStore'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './authorization.scss'

export const AuthPage = () => {
  const naviage = useNavigate()
  const auth = useStore(authModel.stores.$tokens)
  useEffect(() => {
    if (auth?.apiTokenInstance && auth?.idInstance) {
      naviage('/')
    }
  }, [auth])

  const onSubmit = (values: IAuth) => {
    authModel.events.setAuthTokens(values)
  }
  return (
    <Form
      name='basic'
      layout='vertical'
      initialValues={{ remember: true }}
      onFinish={onSubmit}
      autoComplete='off'
    >
      <Form.Item
        label='idInstance'
        name='idInstance'
        rules={[{ required: true, message: 'Поле обязательно' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label='apiTokenInstance'
        name='apiTokenInstance'
        rules={[{ required: true, message: 'Поле обязательно' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 10 }}>
        <Button type='primary' htmlType='submit'>
          Войти
        </Button>
      </Form.Item>
    </Form>
  )
}
