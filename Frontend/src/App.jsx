import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import User from './components/User'
import Post from './components/Post'

function App() {
  return (
    <Routes>
      <Route path='/' Component={User}/>
      <Route path='/post' Component={Post}/>
    </Routes>
  )
}

export default App
