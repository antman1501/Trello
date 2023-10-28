import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Button, Stack, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ButtonGroup} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { apiContext, tokenContext } from '../App'

const Home = () => {

    const apiKey=useContext(apiContext)

    const token=useContext(tokenContext)

    const navigate=useNavigate();

    const [ boards, setBoard]=useState([]);

    const [ open, setOpen]=useState(false);

    const [ boardName, setBoardName]=useState('');

    useEffect(()=>{
        async function fetchData(){
        let response=await axios.get(`https://api.trello.com/1/members/me/boards?fields=name,id,prefs&key=${apiKey}&token=${token}`)
        //console.log(response.data);
        setBoard(response.data)
    }
        fetchData();
    },[])

    function createBoard(){
        axios.post(`https://api.trello.com/1/boards/?name=${boardName}&key=${apiKey}&token=${token}`)
        .then(response=>setBoard(oldValue=>[...oldValue,response.data]))
        .then(response=>setBoardName(''))
        setOpen(false);
    }

    function handleClose()
    {
        setOpen(false);
    }

  return (
    <>
    {/* {console.log(boards)} */}
    <Stack direction='row' sx={{width:'92.5vw',padding:'20px',display:'flex',flexWrap:'wrap',}}>
        {boards.length>0 && boards.map(board=>{
           return (
            <Stack key={board.id} onClick={(e)=>navigate(`boards/${board.id}`,{state:board.prefs.backgroundImage})} sx={{width:150,height:'100px',backgroundImage:`url(${board.prefs.backgroundImage?board.prefs.backgroundImage:'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/original/96bdbe972dc446362179d8255c9beb29/photo-1696144706485-ff7825ec8481'})`,backgroundRepeat:'no-repeat',backgroundSize:'cover',color:'white',display:'flex',borderRadius:'5px',marginRight:'10px',marginBottom:'10px',padding:1}}>{board.name}</Stack>
           )
        })}
        <Button variant='contained' onClick={()=>setOpen(true)} sx={{height:'100px'}}>Create New Board</Button>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create a Board</DialogTitle>
            <DialogContent>
                <TextField autoFocus id='name' type='text' variant='standard' value={boardName} onChange={(e)=>setBoardName(e.target.value)}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={boardName.length!=0?createBoard:null}>Create</Button>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    </Stack>
    </>
  )
}

export default Home