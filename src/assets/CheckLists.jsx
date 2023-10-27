import { Button, Input, Menu, MenuItem, Popover, Stack, TextField } from '@mui/material'
import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react'
import CheckItems from './CheckItems';
import { apiContext, tokenContext } from '../App';

const initialState={
    checkLists:[],
    checkList:'',
    anchorEl:null
}

const reducer=(state,action)=>{
    switch(action.type){
        case 'fetchlists':
            return {...state,checkLists:action.payload}
        case 'createlist':
            return {
                ...state,
                checkLists:[...state.checkLists,action.payload],
                checkList:''
            }
        case 'deletelist':
            return {
                ...state,
                checkLists:state.checkLists.filter(cl=>cl.id!=action.payload)
            }
        case 'checklistname':
            return{
                ...state,
                checkList:action.payload
            }
        case 'setanchor':
            return{
                ...state,
                anchorEl:action.payload
            }
        case 'closeanchor':
            return{
                ...state,
                anchorEl:action.payload
            }
    }
}

const CheckLists = (props) => {

    const apiKey=useContext(apiContext)

    const token=useContext(tokenContext)

    const [ state, dispatch]=useReducer(reducer,initialState)

    // const [ checkLists, setCheckLists]=useState([]);

    // const [ checkList, setCheckList]=useState('');

    // const [anchorEl, setAnchorEl]=useState(null);
  
    const open = Boolean(state.anchorEl);
  
    const handleClick = (event) => {
        dispatch({type:'setanchor',payload:event.currentTarget});
    };
  
    const handleClose = () => {
        dispatch({type:'closeanchor',payload:null});
    };

    useEffect(()=>{
        async function fetchData(){
            let response=await axios.get(`https://api.trello.com/1/cards/${props.cardId}/checklists?key=${apiKey}&token=${token}`);
            //console.log(response.data);
            dispatch({type:'fetchlists', payload:response.data})
        }

        fetchData();

    },[]);

    function createCheckList(){
        axios.post(`https://api.trello.com/1/cards/${props.cardId}/checklists?key=${apiKey}&token=${token}&name=${state.checkList}`)
        .then(response=>dispatch({type:'createlist',payload:response.data}))
    }

    function deleteCheckList(clId){
        axios.delete(`https://api.trello.com/1/cards/${props.cardId}/checklists/${clId}?key=${apiKey}&token=${token}`)
        .then(response=>dispatch({type:'deletelist',payload:clId}))
    }

  return (
    <Stack sx={{width:'50vw',padding:2,display:'flex',justifyContent:'space-between'}}>
        {console.log()}
        <Stack sx={{display:'flex',alignItems:'center',marginBottom:'10px',fontWeight:'700'}}>{props.cardName}</Stack>
        {state.checkLists.map((cl)=>{
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
        anchorEl={state.anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
            <MenuItem>
            <TextField label='Checklist Name' variant='outlined' value={state.checkList} onKeyDown = {(e) => {e.stopPropagation();}} onChange={e=>dispatch({type:'checklistname',payload:e.target.value})}></TextField>
            </MenuItem>
            <MenuItem onClick={(e)=>{createCheckList();handleClose()}}>Add</MenuItem>
        </Menu>
    </Stack>
  )
}

export default CheckLists