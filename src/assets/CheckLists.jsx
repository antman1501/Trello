import { Button, Input, Menu, MenuItem, Popover, Stack, TextField } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CheckItems from './CheckItems';

const apiKey="59402f0c1b9427bbe8bc44b40ffff806"
const token='ATTAf40296f42fa344149977f263968e1d793a094debbf7ac2019811398789b298bc0B5F40AB'

const CheckLists = (props) => {

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
    <Stack>
        <Stack>{props.cardName}</Stack>
        {checkLists.map((cl)=>{
            return<Stack key={cl.id}>
                    <Stack spacing={2} direction='row'>
                        <Stack>{cl.name}</Stack>
                        <Button onClick={(e)=>deleteCheckList(cl.id)}>-</Button>
                    </Stack>
                    <CheckItems card={props.cardId} checkListId={cl.id}></CheckItems>
                </Stack>
        })}
        <Button id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}>
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