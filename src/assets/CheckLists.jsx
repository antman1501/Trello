import { Button, Input, Menu, MenuItem, Popover, Stack, TextField } from '@mui/material'
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import CheckItems from './CheckItems';
import { apiContext, tokenContext } from '../App';

//const apiKey="59402f0c1b9427bbe8bc44b40ffff806"
//const token='ATTAf40296f42fa344149977f263968e1d793a094debbf7ac2019811398789b298bc0B5F40AB'

const CheckLists = (props) => {

    const apiKey=useContext(apiContext)

    const token=useContext(tokenContext)

    const [ checkLists, setCheckLists]=useState([]);

    const [ checkList, setCheckList]=useState('');

    const [anchorEl, setAnchorEl]=useState(null);
  
    const open = Boolean(anchorEl);
  
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(()=>{
        async function fetchData(){
            let response=await axios.get(`https://api.trello.com/1/cards/${props.cardId}/checklists?key=${apiKey}&token=${token}`);
            //console.log(response.data);
            setCheckLists(response.data);
        }

        fetchData();

    },[]);

    function createCheckList(){
        axios.post(`https://api.trello.com/1/cards/${props.cardId}/checklists?key=${apiKey}&token=${token}&name=${checkList}`)
        .then(response=>setCheckLists(oldValue=>[...oldValue,response.data]))
        .then(response=>setCheckList(''))
    }

    function deleteCheckList(clId){
        axios.delete(`https://api.trello.com/1/cards/${props.cardId}/checklists/${clId}?key=${apiKey}&token=${token}`)
        .then(response=>setCheckLists(oldValue=>oldValue.filter(ol=>ol.id!=clId)))
    }

  return (
    <Stack sx={{width:'80vw',padding:2,display:'flex',justifyContent:'space-between'}}>
        <Stack sx={{display:'flex',alignItems:'center',marginBottom:'10px',fontWeight:'700'}}>{props.cardName}</Stack>
        {checkLists.map((cl)=>{
            return<Stack key={cl.id} sx={{border:1,padding:3,marginBottom:'10px'}}>
                    <Stack direction='row' sx={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <Stack sx={{textDecoration:'underline'}}>{cl.name}</Stack>
                        <Button variant='contained' onClick={(e)=>deleteCheckList(cl.id)} sx={{minWidth:'20px',height:'20px'}}>Del</Button>
                    </Stack>
                    <CheckItems card={props.cardId} checkListId={cl.id}></CheckItems>
                </Stack>
        })}
        <Button variant='contained' id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick} sx={{height:'30px'}}>
            Create CheckList
        </Button>
        <Menu id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
            <MenuItem>
            <TextField label='Checklist Name' variant='outlined' value={checkList} onKeyDown = {(e) => {e.stopPropagation();}} onChange={e=>setCheckList(e.target.value)}></TextField>
            </MenuItem>
            <MenuItem onClick={(e)=>{createCheckList();handleClose()}}>Add</MenuItem>
        </Menu>
    </Stack>
  )
}

export default CheckLists