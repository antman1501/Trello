import { Button, Dialog, Stack } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import CheckLists from './CheckLists';
import { apiContext, tokenContext } from '../App';

//const apiKey="59402f0c1b9427bbe8bc44b40ffff806"
//const token='ATTAf40296f42fa344149977f263968e1d793a094debbf7ac2019811398789b298bc0B5F40AB'

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
          <Dialog open={open} onClose={handleClose}>
            <CheckLists cardId={props.card.id} cardName={props.card.name}></CheckLists>
            <Button variant='outlined' onClick={handleClose} sx={{padding:0,margin:'15px',marginTop:0}}>Close</Button>
          </Dialog>
    </Stack>
  )
}

export default DisplayCards