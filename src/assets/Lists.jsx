import { Stack,List, ListItem, ListItemText, ListItemButton, Box, Accordion, AccordionSummary, Typography, AccordionDetails, Input, Button, Menu, MenuItem, TextField } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import CardItems from './Carditems'
import { apiContext, tokenContext } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { displayList, addList, deleteList, createListName } from './ReduxFiles/lists'

const Lists = () => {

    const lists=useSelector(state=>state.list)

    const dispatch=useDispatch()

    const apiKey=useContext(apiContext)

    const token=useContext(tokenContext)

    const location=useLocation();

    const bkimg=location.state;

    const {id}=useParams();

    //const [ lists, setLists]=useState([]);

    //const [ list, setList]=useState('');

    const [anchorEl, setAnchorEl]=useState(null);

    const open=Boolean(anchorEl);

    const handleClick=(e)=>{
        setAnchorEl(e.currentTarget);
    };

    const handleClose=()=>{
        setAnchorEl(null);
    }

    useEffect(()=>{
        async function fetchData(){
            let response=await axios.get(`https://api.trello.com/1/boards/${id}/lists?key=${apiKey}&token=${token}`)
            //console.log(response.data);
            dispatch(displayList(response.data));
        }

        fetchData();
    },[])

    function createList(){
        axios.post(`https://api.trello.com/1/lists?name=${lists.list}&idBoard=${id}&key=${apiKey}&token=${token}`)
        .then(response=>dispatch(addList(response.data)))
    }

    async function archiveList(lId){
        //console.log(lId);
       await axios.put(`https://api.trello.com/1/lists/${lId}/closed?key=${apiKey}&token=${token}&value=true`)
        .then(response =>dispatch(deleteList(lid)));
    }

  return (
    <>
    {/* {console.log(lists)} */}
    <Stack direction='row' sx={{height:'100%',padding:'10px',display:'flex',flexWrap:'wrap',backgroundImage:`url(${bkimg?bkimg:'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/original/96bdbe972dc446362179d8255c9beb29/photo-1696144706485-ff7825ec8481'})`,backgroundRepeat:'no-repeat',backgroundSize:'cover'}}>
    {lists.lists.map(l=>{
        return<List key={l.id} sx={{border:'solid',margin:'10px',width:'200px',height:'fit-content',backgroundColor:'white'}}>
            <ListItem sx={{display:'flex',justifyContent:'space-between'}}>
            <Stack>{l.name}</Stack>
            <Button onClick={(e)=>archiveList(l.id)} sx={{backgroundColor:'#1976d2',color:'white',borderRadius:'5px',minWidth:'20px',height:'20px'}}>Del</Button>
        </ListItem>
        <CardItems listId={l.id}></CardItems>
        </List>
    })}
    <Button id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick} variant='contained' sx={{height:'30px',marginTop:'10px',marginLeft:'10px'}}>Add a List</Button>
        <Menu id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
            <MenuItem>
            <TextField label='List Name' variant='outlined' value={lists.list} onChange={e=>dispatch(createListName(e.target.value))}></TextField>
            </MenuItem>
            <MenuItem onClick={(e)=>{createList();handleClose()}}>Add</MenuItem>
        </Menu>
    </Stack>
    </>
  )
}

export default Lists