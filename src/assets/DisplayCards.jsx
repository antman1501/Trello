import { Button, Dialog, Stack } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import CheckLists from './CheckLists';
import { apiContext, tokenContext } from '../App';

const DisplayCards = (props) => {

  const apiKey=useContext(apiContext)

  const token=useContext(tokenContext)

  const [ open, setOpen]=useState(false);

  function handleClose(){
    setOpen(false);
  }

  return (
    <Stack direction='row'>
          <Stack onClick={(e)=>setOpen(true)}>{props.card.name}</Stack>
          <Dialog open={open} onClose={handleClose} >
            <CheckLists cardId={props.card.id} cardName={props.card.name}></CheckLists>
            <Button variant='outlined' onClick={handleClose} sx={{padding:0,margin:'15px',marginTop:0}}>Close</Button>
          </Dialog>
    </Stack>
  )
}

export default DisplayCards