import { Stack,List, ListItem, ListItemText, ListItemButton, Box, Accordion, AccordionSummary, Typography, AccordionDetails, Input, Button, Menu, MenuItem, TextField } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import CardItems from './Carditems'
import { apiContext, tokenContext } from '../App'

const Lists = () => {

    const navigate=useNavigate();

    const apiKey=useContext(apiContext)

    const token=useContext(tokenContext)

    const location=useLocation();

    const bkimg=location.state;

    const {id}=useParams();

    const [ lists, setLists]=useState([]);

    const [ list, setList]=useState('');

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
            setLists(response.data);
        }

        fetchData();
    },[])

    function createList(){
        axios.post(`https://api.trello.com/1/lists?name=${list}&idBoard=${id}&key=${apiKey}&token=${token}`)
        .then(response=>setLists(oldValue=>[...oldValue,response.data]))
        .then(response=>setList(''))
    }

    async function archiveList(lId){
        //console.log(lId);
       await axios.put(`https://api.trello.com/1/lists/${lId}/closed?key=${apiKey}&token=${token}&value=true`)
        .then(response =>setLists(oldValue=>oldValue.filter(ol=>ol.id!=lId)));
    }

  return (
    <>
    {console.log(bkimg)}
    <Stack sx={{height:'100%',padding:'10px',display:'flex',flexWrap:'wrap',backgroundImage:`url(${bkimg.bkimg?bkimg.bkimg:'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/original/96bdbe972dc446362179d8255c9beb29/photo-1696144706485-ff7825ec8481'})`,backgroundRepeat:'no-repeat',backgroundSize:'cover'}}>
    <Stack direction="row">
    <Button variant="contained" sx={{width:"8rem",margin:"10px"}} onClick={(e)=>navigate('/')}>Go Back</Button>
    <Button variant="contained" sx={{width:"8rem",margin:"10px"}}>{bkimg.name}</Button>
    </Stack>
    <Stack direction="row">
    {lists.map(l=>{
        return<List key={l.id} sx={{border:'none',borderRadius:"5px",margin:'10px',width:'200px',height:'fit-content',backgroundColor:'rgba(215, 235, 255, 1)'}}>
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
            <TextField label='List Name' variant='outlined' value={list} onChange={e=>setList(e.target.value)}></TextField>
            </MenuItem>
            <MenuItem onClick={(e)=>{createList();handleClose()}}>Add</MenuItem>
        </Menu>
        </Stack>
    </Stack>
    </>
  )
}

export default Lists