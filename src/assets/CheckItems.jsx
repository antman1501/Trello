import { Button, Checkbox, FormControlLabel, FormGroup, LinearProgress, Menu, MenuItem, Stack, TextField } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { apiContext, tokenContext } from '../App';

const CheckItems = (props) => {

    const apiKey=useContext(apiContext)

    const token=useContext(tokenContext)

    const [ checkItems, setCheckItems]=useState([]);

    const [ checkItem, setCheckItem]=useState('');

    const [ currentProgress, setCurrentProgress]=useState(0);

    const [ totalProgress, setTotalProgress]=useState(1);

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
            setCheckItems(response.data);
            setTotalProgress(response.data.length!=0?response.data.length:1);
            setCurrentProgress(response.data.reduce((acc,curr)=>{
                if(curr.state=='complete'){
                    return acc+=1;
                }
                else{
                    return acc;
                }
            },0))
        }

        fetchData();

    },[]);

    function checkMark(e,ci){
        if(e.target.checked){
            setCurrentProgress(oldProgress=>oldProgress+1);
            ci.state='complete';
        }
        else{
            setCurrentProgress(oldProgress=>oldProgress-1);
            ci.state='incomplete';
        }
        axios.put(`https://api.trello.com/1/cards/${props.card}/checklist/${props.checkListId}/checkItem/${ci.id}?key=${apiKey}&token=${token}&state=${ci.state}`)
    }

    function createCheckItem(){
        axios.post(`https://api.trello.com/1/checklists/${props.checkListId}/checkItems?name=${checkItem}&key=${apiKey}&token=${token}`)
        .then(response=>setCheckItems(oldValue=>[...oldValue,response.data]))
        .then(response=>setTotalProgress(oldValue=>checkItems.length!=0?oldValue+1:1))
        .then(response=>setCheckItem(''))
    }

    function deleteCheckItem(ci){
        if(ci.state=='complete'){
            setCurrentProgress(oldValue=>oldValue-1)
        }
        axios.delete(`https://api.trello.com/1/checklists/${props.checkListId}/checkItems/${ci.id}?key=${apiKey}&token=${token}`)
        .then(response=>setCheckItems(oldValue=>oldValue.filter(ol=>ol.id!=ci.id)))
        .then(response=>setTotalProgress(oldValue=>checkItems.length==1?1:oldValue-1))
        
    }

  return (
    <Stack sx={{border:1,marginTop:'10px',padding:1}}>
        {console.log()}
    <Stack >
        <Stack>{Math.floor((currentProgress*100.0)/totalProgress)}%</Stack>
        <LinearProgress variant='determinate' value={Math.floor((currentProgress*100.0)/totalProgress)}/>
    </Stack>
    <FormGroup>
    {checkItems.map((ci)=>{
        return <>{ci.state=='incomplete'?<Stack key={ci.id} direction='row' sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <FormControlLabel control={<Checkbox checked={ci.state=='complete'} onChange={(e)=>checkMark(e,ci)}/>} label={ci.name}></FormControlLabel>
            <Button variant='outlined' onClick={(e)=>deleteCheckItem(ci)} sx={{width:'20px',height:'20px'}}>Del</Button>
            </Stack>:null}</>
    })}
    {currentProgress?<Stack>Completed</Stack>:null}
    {checkItems.map((ci)=>{
        return <>{ci.state=='complete'?<Stack key={ci.id} direction='row' sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <FormControlLabel control={<Checkbox checked={ci.state=='complete'} onChange={(e)=>checkMark(e,ci)}/>} label={ci.name} sx={{color:"rgba(0,0,0,.25)",textDecoration:"line-through"}}></FormControlLabel>
            <Button variant='outlined' onClick={(e)=>deleteCheckItem(ci)} sx={{width:'20px',height:'20px'}}>Del</Button>
            </Stack>:null}</>
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