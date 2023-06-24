import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './HomePage'
import DashboardPage from './DashboardPage'

const App: React.FC = () => {
  return (
    <Routes>
        <Route path='/' element={ <HomePage /> } />
        <Route path='/dashboard' element={ <DashboardPage /> } />
    </Routes>
  )
}

export default App
