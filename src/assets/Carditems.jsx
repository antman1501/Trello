import { Box, Button, ButtonGroup, Dialog, ListItem, ListItemText, Modal, Paper, Stack, TextField } from '@mui/material'
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import CheckLists from './CheckLists';
import DisplayCards from './DisplayCards';
import { apiContext, tokenContext } from '../App';
import { useSelector, useDispatch } from 'react-redux';
import { displayCards, addCard, deleteCard } from './ReduxFiles/cardItems';

const CardItems = (props) => {

  // const cards=useSelector(state=>state.card)
  //console.log(cards);
  const dispatch=useDispatch()

  const apiKey=useContext(apiContext)

  const token=useContext(tokenContext)

  //const [ cards, setCards]=useState([]);

  const [ card, setCard]=useState('');

  //const [ open, setOpen]=useState(false);

  useEffect(()=>{
    async function fetchData(){
      let response=await axios.get(`https://api.trello.com/1/lists/${props.listId}/cards?key=${apiKey}&token=${token}`);
      // console.log(response.data)
      dispatch(displayCards({data:response.data,id:props.listId}))
    }

    fetchData();
    //dispatch(reset())
  },[])

  function cardCreation(){
    axios.post(`https://api.trello.com/1/cards?idList=${props.listId}&key=${apiKey}&token=${token}&name=${card}`)
    .then(response=>dispatch(addCard({data:response.data,id:props.listId})))
    .then(response=>setCard(''))
  }

  function deleteCardItem(cId){
    axios.delete(`https://api.trello.com/1/cards/${cId}?key=${apiKey}&token=${token}`)
    .then(response=>dispatch(deleteCard({data:cId,id:props.listId})))
  }

  const allCards = useSelector((state)=>state.card.cards)
  //console.log(allCards);

  return (
    <>
  
    {typeof(allCards[props.listId])!='undefined'&&allCards[props.listId].map((c)=>{
      return<ListItem key={c.id}>
        <Stack direction='row' sx={{width:200,height:30,padding:1,backgroundColor:'hsl(0, 0%, 98%)',border:1,borderRadius:1,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <DisplayCards card={c}></DisplayCards>
        <Button variant='outlined' onClick={(e)=>deleteCardItem(c.id)} sx={{minWidth:'20px',height:'20px',padding:'5px'}}>Del</Button>
        </Stack>
      </ListItem>
    })}
    <ListItem sx={{width:200,display:'flex',justifyContent:'space-between'}}>
      <TextField label='Add a card' value={card} onChange={(e)=>setCard(e.target.value)} sx={{backgroundColor:'hsl(0, 0%, 98%)',width:'120px'}}></TextField>
      <Button variant='contained' onClick={(e)=>card.length!=0?cardCreation():null} sx={{padding:0,minWidth:'30px',height:'30px'}}>+</Button>
    </ListItem>
    {/* {dispatch(reset())} */}
    </>
  )
}

export default CardItems;