import { Button, Checkbox, FormControlLabel, FormGroup, LinearProgress, Menu, MenuItem, Stack, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const apiKey="59402f0c1b9427bbe8bc44b40ffff806"
const token='ATTAf40296f42fa344149977f263968e1d793a094debbf7ac2019811398789b298bc0B5F40AB'

const CheckItems = (props) => {

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
        .then(response=>setTotalProgress(oldValue=>oldValue-1))
        
    }

  return (
    <>{console.log()}
    <Stack>
        <Stack>{Math.floor((currentProgress*100.0)/totalProgress)}</Stack>
        <LinearProgress variant='determinate' value={Math.floor((currentProgress*100.0)/totalProgress)}/>
    </Stack>
    <FormGroup>
    {checkItems.map((ci)=>{
        return <Stack key={ci.id} direction='row'>
            <FormControlLabel control={<Checkbox checked={ci.state=='complete'} onChange={(e)=>checkMark(e,ci)}/>} label={ci.name}></FormControlLabel>
            <Button onClick={(e)=>deleteCheckItem(ci)}>-</Button>
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
    </>
  )
}

export default CheckItems