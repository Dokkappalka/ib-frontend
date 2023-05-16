import React from 'react'
import logo from './logo.svg'
import MainPage from './pages/MainPage/MainPage'
import Header from './components/Header/Header'
import Modal from './components/Modal/Modal'

function App() {
  return (
    <div className='bg-gray-200 min-h-screen'>
      <Header />
      <MainPage />
    </div>
  )
}

export default App
