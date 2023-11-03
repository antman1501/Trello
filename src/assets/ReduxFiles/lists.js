import { createSlice } from "@reduxjs/toolkit";

const initialState={
    lists:[],
    list:'',
}

const listSlice=createSlice({
    name:'list',
    initialState,
    reducers:{
        displayList:(state,action)=>{
            state.lists=action.payload
        },
        addList:(state,action)=>{
            state.lists=[...state.lists,action.payload]
            state.list=''
        },
        deleteList:(state,action)=>{
            state.lists=state.lists.filter(sl=>sl.id!=action.payload)
        },
        createListName:(state,action)=>{
            state.list=action.payload
        }
    }
})

export default listSlice.reducer
export const { displayList, addList, createListName, deleteList }=listSlice.actions