import { Box, Button, ButtonGroup, Dialog, ListItem, ListItemText, Modal, Paper, Stack, TextField } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CheckLists from './CheckLists';
import DisplayCards from './DisplayCards';

const apiKey="59402f0c1b9427bbe8bc44b40ffff806"
const token='ATTAf40296f42fa344149977f263968e1d793a094debbf7ac2019811398789b298bc0B5F40AB'


const CardItems = (props) => {

  const [ cards, setCards]=useState([]);

  const [ card, setCard]=useState('');

  const [ open, setOpen]=useState(false);

  useEffect(()=>{
    async function fetchData(){
      let response=await axios.get(`https://api.trello.com/1/lists/${props.listId}/cards?key=${apiKey}&token=${token}`);
      //console.log(response.data)
      setCards(response.data);
    }

    fetchData();
  },[])

  function cardCreation(){
    axios.post(`https://api.trello.com/1/cards?idList=${props.listId}&key=${apiKey}&token=${token}&name=${card}`)
    .then(response=>setCards(oldValue=>[...oldValue,response.data]))
    .then(response=>setCard(''))
  }

  function deleteCard(cId){
    axios.delete(`https://api.trello.com/1/cards/${cId}?key=${apiKey}&token=${token}`)
    .then(response=>setCards(oldValue=>oldValue.filter(ol=>ol.id!=cId)))
  }

  return (
    <>
    {cards.map((c)=>{
      return <ListItem key={c.id}>
        <Stack direction='row' sx={{width:200,height:30,padding:1,backgroundColor:'hsl(0, 0%, 98%)',border:1,borderRadius:1,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <DisplayCards card={c}></DisplayCards>
        <Button variant='outlined' onClick={(e)=>deleteCard(c.id)} sx={{minWidth:'20px',height:'20px',padding:'5px'}}>Del</Button>
        </Stack>
      </ListItem>
    })}
    <ListItem sx={{width:200,display:'flex',justifyContent:'space-between'}}>
      <TextField label='Add a card' value={card} onChange={(e)=>setCard(e.target.value)} sx={{backgroundColor:'hsl(0, 0%, 98%)',width:'120px'}}></TextField>
      <Button variant='contained' onClick={(e)=>card.length!=0?cardCreation():null} sx={{padding:0,minWidth:'30px',height:'30px'}}>+</Button>
    </ListItem>
    </>
  )
}

export default CardItems;