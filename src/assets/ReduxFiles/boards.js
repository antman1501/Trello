import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiKey=import.meta.env.VITE_API_KEY
const token=import.meta.env.VITE_TOKEN

const initialState={
    loading:false,
    boards:[],
    error:'',
    open:false,
    boardName:'',
}

export const fetchBoards=createAsyncThunk('user/fetchBoards',()=>{
    return axios.get(`https://api.trello.com/1/members/me/boards?fields=name,id,prefs&key=${apiKey}&token=${token}`)
        .then(response=>response.data)
})

export const fetchBoard=createAsyncThunk('user/fetchBoard',(name)=>{
    return axios.post(`https://api.trello.com/1/boards/?name=${name}&key=${apiKey}&token=${token}`)
        .then(response=>response.data)
})

const boardSlice=createSlice({
    name:'board',
    initialState,
    reducers:{
        // addBoard:(state,action)=>{
        //     state.boards=[...state.boards,action.payload]
        // },
        open:(state)=>{
            state.open=true
        },
        close:(state)=>{
            state.open=false
        },
        createBoardName:(state,action)=>{
            state.boardName=action.payload
        },
        resetBoardName:(state)=>{
            state.boardName=''
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchBoards.pending,(state)=>{
            state.loading=true
        })
        builder.addCase(fetchBoards.fulfilled,(state,action)=>{
            state.loading=false
            state.boards=action.payload
            state.error=''
        })
        builder.addCase(fetchBoards.rejected,(state,action)=>{
            state.loading=false
            state.boards=[]
            state.error=action.error.message
        })
        builder.addCase(fetchBoard.pending,(state)=>{
            state.loading=true
        })
        builder.addCase(fetchBoard.fulfilled,(state,action)=>{
            state.loading=false
            state.boards=[...state.boards,action.payload]
            state.error=''
        })
        builder.addCase(fetchBoard.rejected,(state,action)=>{
            state.loading=false
            state.boards=[]
            state.error=action.error.message
        })
    },
})

export default boardSlice.reducer
export const { open, close, createBoardName, resetBoardName }=boardSlice.actions