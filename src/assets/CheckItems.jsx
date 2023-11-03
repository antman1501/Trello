import { Button, Checkbox, FormControlLabel, FormGroup, LinearProgress, Menu, MenuItem, Stack, TextField } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { apiContext, tokenContext } from '../App';
import { useSelector, useDispatch } from 'react-redux';
import { displayCheckItems, addCheckItem, deleteCheckItem, checkedCurrentProgress, uncheckedCurrentProgress, increaseTotalProgress, decreaseCurrentProgress, decreaseTotalProgress } from './ReduxFiles/checkItems';

const CheckItems = (props) => {

    const allCheckItems=useSelector(state=>state.checkItem)

    //const allCurrentProgress=useSelector(state=>state.checkItem.currentProgress)

    //const allTotalProgress=useSelector(state=>state.checkItem.totalProgress)

    const dispatch=useDispatch()

    const apiKey=useContext(apiContext)

    const token=useContext(tokenContext)

    //const [ checkItems, setCheckItems]=useState([]);

    const [ checkItem, setCheckItem]=useState('');

    //const [ currentProgress, setCurrentProgress]=useState(0);

    //const [ totalProgress, setTotalProgress]=useState(1);

    const [ anchorEl, setAnchorEl]=useState(null);
  
    const open = Boolean(anchorEl);
  
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(()=>{
        async function fetchData(){
            let response=await axios.get(`https://api.trello.com/1/checklists/${props.checkListId}/checkItems?key=${apiKey}&token=${token}`)
            dispatch(displayCheckItems({data:response.data,id:props.checkListId}))
            // setCheckItems(response.data);
            // setTotalProgress(response.data.length!=0?response.data.length:1);
            // setCurrentProgress(response.data.reduce((acc,curr)=>{
            //     if(curr.state=='complete'){
            //         return acc+=1;
            //     }
            //     else{
            //         return acc;
            //     }
            // },0))
        }

        fetchData();

    },[]);

    function checkMark(e,ci){
        //console.log(ci)
        if(ci.state=='incomplete'){
            axios.put(`https://api.trello.com/1/cards/${props.card}/checklist/${props.checkListId}/checkItem/${ci.id}?key=${apiKey}&token=${token}&state=complete`)
                .then(response=>dispatch(checkedCurrentProgress({id:props.checkListId,data:ci.id})))
                //.then(()=>console.log(allCurrentProgress))
            //dispatch(updateCheckItems({listId:props.checkListId,cardId:props.card,checkItemId:ci.id,bool:'complete'}))
            //ci.state='complete';
        }
        else{
            axios.put(`https://api.trello.com/1/cards/${props.card}/checklist/${props.checkListId}/checkItem/${ci.id}?key=${apiKey}&token=${token}&state=incomplete`)
                .then(response=>dispatch(uncheckedCurrentProgress({id:props.checkListId,data:ci.id})))
            //dispatch(updateCheckItems({listId:props.checkListId,cardId:props.card,checkItemId:ci.id,bool:'incomplete'}))
            //ci.state='incomplete';
        }
        //axios.put(`https://api.trello.com/1/cards/${props.card}/checklist/${props.checkListId}/checkItem/${ci.id}?key=${apiKey}&token=${token}&state=${ci.state}`)
    }

    function createCheckItem(){
        axios.post(`https://api.trello.com/1/checklists/${props.checkListId}/checkItems?name=${checkItem}&key=${apiKey}&token=${token}`)
            .then(response=>dispatch(addCheckItem({data:response.data,id:props.checkListId})))
            //.then(response=>dispatch(increaseTotalProgress(props.checkListId)))
            .then(response=>setCheckItem(''))
    }

    function deleteCheckItemitems(ci){
        // if(ci.state=='complete'){
        //     dispatch(decreaseCurrentProgress(props.checkListId))
        // }
        //console.log(ci)
        axios.delete(`https://api.trello.com/1/checklists/${props.checkListId}/checkItems/${ci.id}?key=${apiKey}&token=${token}`)
            .then(()=>dispatch(deleteCheckItem({id:props.checkListId,data:ci})))
            //.then(()=>dispatch(decreaseTotalProgress(props.checkListId)))
            //.then(()=>ci.state=='complete'?dispatch(decreaseCurrentProgress(props.checkListId)):null)
    }

  return (
    <Stack sx={{border:1,marginTop:'10px',padding:1}}>
        {console.log(allCheckItems)}
        {typeof(allCheckItems.currentProgress[props.checkListId])!='undefined'&&typeof(allCheckItems.totalProgress[props.checkListId])!='undefined'&&<>
    <Stack >
        <Stack>{isNaN(Math.floor((allCheckItems.currentProgress[props.checkListId]*100.0)/allCheckItems.totalProgress[props.checkListId]))?0:Math.floor((allCheckItems.currentProgress[props.checkListId]*100.0)/allCheckItems.totalProgress[props.checkListId])}%</Stack>
        <LinearProgress variant='determinate' value={isNaN(Math.floor((allCheckItems.currentProgress[props.checkListId]*100.0)/allCheckItems.totalProgress[props.checkListId]))?0:Math.floor((allCheckItems.currentProgress[props.checkListId]*100.0)/allCheckItems.totalProgress[props.checkListId])}/>
    </Stack>
        </>
    }
    <FormGroup>
    {typeof(allCheckItems.checkItems[props.checkListId])!='undefined'&&allCheckItems.checkItems[props.checkListId].map((ci)=>{
        return <Stack key={ci.id} direction='row' sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <FormControlLabel control={<Checkbox checked={ci.state=='complete'} onChange={(e)=>checkMark(e,ci)}/>} label={ci.name}></FormControlLabel>
            <Button variant='outlined' onClick={(e)=>deleteCheckItemitems(ci)} sx={{width:'20px',height:'20px'}}>Del</Button>
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
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
            <MenuItem>
            <TextField label='Check Item Name' variant='outlined' value={checkItem} onKeyDown = {(e) => {e.stopPropagation();}} onChange={e=>setCheckItem(e.target.value)}></TextField>
            </MenuItem>
            <MenuItem onClick={(e)=>{createCheckItem();handleClose()}}>Add</MenuItem>
        </Menu>
    
    </Stack>
  )
}

export default CheckItems