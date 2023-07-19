import React from 'react'
import { Route, Routes } from 'react-router'
import { Tablo } from '../Pages/Tablo'

function MainRouter() {
  return (
    <Routes>
        <Route path='/' element={<Tablo/>}/>
    </Routes>
  )
}

export default MainRouter