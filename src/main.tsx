import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store/rootStore.ts'

const main_store = store()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={main_store}>
      <App />
    </Provider>
  </StrictMode>,
)
