import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Button, Stack, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ButtonGroup} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { apiContext, tokenContext } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoards, fetchBoard, open, close, createBoardName, resetBoardName } from './ReduxFiles/boards'

const Home = () => {

    const boards=useSelector(state=>state.board)

    const dispatch=useDispatch()

    const apiKey=useContext(apiContext)

    const token=useContext(tokenContext)

    const navigate=useNavigate();

    //const [ boards, setBoard]=useState([]);

    //const [ open, setOpen]=useState(false);

    //const [ boardName, setBoardName]=useState('');

    useEffect(()=>{
        dispatch(fetchBoards())
    },[])

    function createBoard(){
        dispatch(fetchBoard(boards.boardName))
        .then(response=>console.log(response))
        .then(response=>dispatch(resetBoardName()))
        .then(response=>dispatch(close()))
    }

  return (
    <>
     {/* {console.log(boards)} */}
    <Stack direction='row' sx={{width:'92.5vw',padding:'20px',display:'flex',flexWrap:'wrap',}}>
        {boards.boards.length>0 && boards.boards.map(board=>{
           return (
            <Stack key={board.id} onClick={(e)=>navigate(`boards/${board.id}`,{state:board.prefs.backgroundImage})} sx={{width:150,height:'100px',backgroundImage:`url(${board.prefs.backgroundImage?board.prefs.backgroundImage:'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/original/96bdbe972dc446362179d8255c9beb29/photo-1696144706485-ff7825ec8481'})`,backgroundRepeat:'no-repeat',backgroundSize:'cover',color:'white',display:'flex',borderRadius:'5px',marginRight:'10px',marginBottom:'10px',padding:1}}>{board.name}</Stack>
           )
        })}
        <Button variant='contained' onClick={()=>dispatch(open())} sx={{height:'100px'}}>Create New Board</Button>
        <Dialog open={boards.open} onClose={()=>dispatch(close())}>
            <DialogTitle>Create a Board</DialogTitle>
            <DialogContent>
                <TextField autoFocus id='name' type='text' variant='standard' value={boards.boardName} onChange={(e)=>dispatch(createBoardName(e.target.value))}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={boards.boardName.length!=0?createBoard:null}>Create</Button>
                <Button onClick={()=>dispatch(close())}>Cancel</Button>
            </DialogActions>
        </Dialog>
    </Stack>
    </>
  )
}

export default Home