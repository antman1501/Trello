import { Button, Input, Menu, MenuItem, Popover, Stack, TextField } from '@mui/material'
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import CheckItems from './CheckItems';
import { apiContext, tokenContext } from '../App';
import { useSelector, useDispatch } from 'react-redux';
import { displayCheckList, addCheckList, deleteCheckList, createCheckListName } from './ReduxFiles/checkLists';

const CheckLists = (props) => {

    const checkLists=useSelector(state=>state.checkList)

    const dispatch=useDispatch()

    const apiKey=useContext(apiContext)

    const token=useContext(tokenContext)

    //const [ checkLists, setCheckLists]=useState([]);

    //const [ checkList, setCheckList]=useState('');

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
            dispatch(displayCheckList(response.data));
        }

        fetchData();

    },[]);

    function createCheckList(){
        axios.post(`https://api.trello.com/1/cards/${props.cardId}/checklists?key=${apiKey}&token=${token}&name=${checkLists.checkList}`)
        .then(response=>dispatch(addCheckList(response.data)))
    }

    function deleteCheckListItem(clId){
        axios.delete(`https://api.trello.com/1/cards/${props.cardId}/checklists/${clId}?key=${apiKey}&token=${token}`)
        .then(response=>dispatch(deleteCheckList(clId)))
    }

  return (
    <Stack sx={{width:'80vw',padding:2,display:'flex',justifyContent:'space-between'}}>
        {/* {console.log(checkLists.checkLists)} */}
        <Stack sx={{display:'flex',alignItems:'center',marginBottom:'10px',fontWeight:'700'}}>{props.cardName}</Stack>
        {checkLists.checkLists.map((cl)=>{
            return<Stack key={cl.id} sx={{border:1,padding:3,marginBottom:'10px'}}>
                    <Stack direction='row' sx={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <Stack sx={{textDecoration:'underline'}}>{cl.name}</Stack>
                        <Button variant='contained' onClick={(e)=>deleteCheckListItem(cl.id)} sx={{minWidth:'20px',height:'20px'}}>Del</Button>
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
            <TextField label='Checklist Name' variant='outlined' value={checkLists.checkList} onKeyDown = {(e) => {e.stopPropagation();}} onChange={e=>dispatch(createCheckListName(e.target.value))}></TextField>
            </MenuItem>
            <MenuItem onClick={(e)=>{createCheckList();handleClose()}}>Add</MenuItem>
        </Menu>
    </Stack>
  )
}

export default CheckLists