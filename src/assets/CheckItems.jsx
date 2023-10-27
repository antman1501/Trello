import { Button, Checkbox, FormControlLabel, FormGroup, LinearProgress, Menu, MenuItem, Stack, TextField } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { apiContext, tokenContext } from '../App';

const initialState={
    checkItems:[],
    checkItem:'',
    anchorEl:null,
    totalProgress:1,
    currentProgress:0
}

const reducer=(state,action)=>{
    switch(action.type){
        case 'fetchitems':
            return {
                ...state,
                checkItems:action.payload,
                totalProgress:action.payload.length!=0?action.payload.length:1,
                currentProgress:action.payload.reduce((acc,curr)=>{
                if(curr.state=='complete'){
                    return acc+=1;
                }
                else{
                    return acc;
                }
            },0)
            }
        case 'createitem':
            return {
                ...state,
                checkItems:[...state.checkItems,action.payload],
                checkItem:'',
                totalProgress:state.checkItems.length!=0?state.totalProgress+1:1
            }
        case 'deleteitem':
            return {
                ...state,
                checkItems:state.checkItems.filter(ci=>ci.id!=action.payload),
                totalProgress:state.checkItems.length==1?1:state.totalProgress-1
            }
        case 'checkitemname':
            return {
                ...state,
                checkItem:action.payload
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
        case 'checked':
            return{
                ...state,
                currentProgress:state.currentProgress+1
            }
        case 'unchecked':
            return{
                ...state,
                currentProgress:state.currentProgress-1
            }
        default:
            return state
    }
}

const CheckItems = (props) => {

    const apiKey=useContext(apiContext)

    const token=useContext(tokenContext)

    const [ state, dispatch]=useReducer(reducer,initialState)

    // const [ checkItems, setCheckItems]=useState([]);

    // const [ checkItem, setCheckItem]=useState('');

    // const [ currentProgress, setCurrentProgress]=useState(0);

    // const [ totalProgress, setTotalProgress]=useState(1);

    // const [ anchorEl, setAnchorEl]=useState(null);
  
    const open = Boolean(state.anchorEl);
  
    const handleClick = (event) => {
        dispatch({type:'setanchor',payload:event.currentTarget});
    };
  
    const handleClose = () => {
        dispatch({type:'closeanchor',payload:null});
    };

    useEffect(()=>{
        async function fetchData(){
            let response=await axios.get(`https://api.trello.com/1/checklists/${props.checkListId}/checkItems?key=${apiKey}&token=${token}`)
            //setCheckItems(response.data);
            dispatch({type:'fetchitems',payload:response.data})
        }

        fetchData();

    },[]);

    function checkMark(e,ci){
        if(e.target.checked){
            dispatch({type:'checked'});
            ci.state='complete';
        }
        else{
            dispatch({type:'unchecked'});
            ci.state='incomplete';
        }
        axios.put(`https://api.trello.com/1/cards/${props.card}/checklist/${props.checkListId}/checkItem/${ci.id}?key=${apiKey}&token=${token}&state=${ci.state}`)
    }

    function createCheckItem(){
        axios.post(`https://api.trello.com/1/checklists/${props.checkListId}/checkItems?name=${state.checkItem}&key=${apiKey}&token=${token}`)
        .then(response=>dispatch({type:'createitem',payload:response.data}))
    }

    function deleteCheckItem(ci){
        if(ci.state=='complete'){
            dispatch({type:'unchecked'});
        }
        axios.delete(`https://api.trello.com/1/checklists/${props.checkListId}/checkItems/${ci.id}?key=${apiKey}&token=${token}`)
        .then(response=>dispatch({type:'deleteitem',payload:ci.id}))
        
    }

  return (
    <Stack sx={{border:1,marginTop:'10px',padding:1}}>
        {console.log(state.checkItems)}
    <Stack >
        <Stack>{Math.floor((state.currentProgress*100.0)/state.totalProgress)}%</Stack>
        <LinearProgress variant='determinate' value={Math.floor((state.currentProgress*100.0)/state.totalProgress)}/>
    </Stack>
    <FormGroup>
    {state.checkItems.map((ci)=>{
        return <Stack key={ci.id} direction='row' sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <FormControlLabel control={<Checkbox checked={ci.state=='complete'} onChange={(e)=>checkMark(e,ci)}/>} label={ci.name}></FormControlLabel>
            <Button variant='outlined' onClick={(e)=>deleteCheckItem(ci)} sx={{width:'20px',height:'20px'}}>Del</Button>
            </Stack>
    })}
    </FormGroup>
    <Button id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}>
            Create CheckItem
        </Button>
        <Menu id="basic-menu"
        anchorEl={state.anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
            <MenuItem>
            <TextField label='Check Item Name' variant='outlined' value={state.checkItem} onKeyDown = {(e) => {e.stopPropagation();}} onChange={e=>dispatch({type:'checkitemname',payload:e.target.value})}></TextField>
            </MenuItem>
            <MenuItem onClick={(e)=>{createCheckItem();handleClose()}}>Add</MenuItem>
        </Menu>
    </Stack>
  )
}

export default CheckItems