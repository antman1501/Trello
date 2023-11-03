import { createSlice } from "@reduxjs/toolkit";

const initialState={
    checkLists:[],
    checkList:''
}

const checkListSlice=createSlice({
    name:'checklist',
    initialState,
    reducers:{
        displayCheckList:(state,action)=>{
            state.checkLists=action.payload
        },
        addCheckList:(state,action)=>{
            state.checkLists=[...state.checkLists,action.payload]
            state.checkList=''
        },
        deleteCheckList:(state,action)=>{
            state.checkLists=state.checkLists.filter(sl=>sl.id!=action.payload)
        },
        createCheckListName:(state,action)=>{
            state.checkList=action.payload
        }
    }
})

export default checkListSlice.reducer
export const { displayCheckList, addCheckList, deleteCheckList, createCheckListName }=checkListSlice.actions