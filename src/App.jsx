import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route,Routes, useNavigate } from 'react-router-dom'
import { Button, List, Stack, TextField } from '@mui/material'
import Home from './assets/Home'
import Lists from './assets/Lists'
import LoadingScreen from './assets/LoadingScreen'

const apiKey="59402f0c1b9427bbe8bc44b40ffff806"
const token='ATTAf40296f42fa344149977f263968e1d793a094debbf7ac2019811398789b298bc0B5F40AB'

function App() {

  const navigate=useNavigate();

  const [loading, setLoading]=useState(true)

  async function loadScreen(){
    await setTimeout(()=>{setLoading(false)},1000);
  }
  
  return (
    <>
    {loading?<LoadingScreen>{loadScreen()}</LoadingScreen>:
    <Stack sx={{width:'98vw',height:'97vh',backgroundColor:'hsl(0, 0%, 98%)',borderRadius:'5px'}}>
    <Stack>
      <Button variant='contained' onClick={(e)=>navigate('/')}>Trello</Button>
    </Stack>
    <Routes>
      <Route path='/' element={<Home />}>
      </Route>
      <Route path='/boards/:id' element={<Lists/>}></Route>
    </Routes>
    </Stack>}
    </>
  )
}

export default App
