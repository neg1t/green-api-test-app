import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { Pages } from './pages/Routes'

export const router = createBrowserRouter([{ path: '*', element: <Pages /> }])

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#02a698'
        }
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}

export default App
