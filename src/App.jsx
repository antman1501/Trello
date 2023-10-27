import { createContext, useReducer, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route,Routes, useNavigate } from 'react-router-dom'
import { Button, List, Stack, TextField } from '@mui/material'
import Home from './assets/Home'
import Lists from './assets/Lists'
import LoadingScreen from './assets/LoadingScreen'
import { ErrorBoundary } from "react-error-boundary";

const Api_Key=import.meta.env.VITE_Api_Key
const Token=import.meta.env.VITE_Token

export const apiContext=createContext();
export const tokenContext=createContext();

const initialState={
  load:true
}

const reducer=(state,action)=>{
  switch(action.type){
    case 'loadScreen':
      return {load: false}
    default:
      return state
  }
}

function App() {

  const navigate=useNavigate();

  const [state, dispatch]=useReducer(reducer,initialState)

  async function loadScreen(){
    await setTimeout(()=>{dispatch({type:'loadScreen'})},1000);
  }
  
  return (
    <>
    {state.load?<LoadingScreen>{loadScreen()}</LoadingScreen>:
    <ErrorBoundary fallback={<div>Something Went Wrong</div>}>
    <apiContext.Provider value={Api_Key}>
      <tokenContext.Provider value={Token}>
        <Stack sx={{width:'98vw',height:'97vh',backgroundColor:'hsl(0, 0%, 98%)',borderRadius:'5px'}}>
          <Stack>
            <Button variant='contained' onClick={(e)=>navigate('/')}>Trello</Button>
          </Stack>
          <Routes>
            <Route path='/' element={<Home />}>
            </Route>
            <Route path='/boards/:id' element={<Lists/>}></Route>
          </Routes>
        </Stack>
      </tokenContext.Provider>
    </apiContext.Provider>
    </ErrorBoundary>}
    </>
  )
}

export default App
