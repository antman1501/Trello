import { createSlice } from "@reduxjs/toolkit";

const initialState={
    cards:{},
}


const cardSlice=createSlice({
    name:'card',
    initialState,
    reducers:{
        displayCards:(state,action)=>{
            //console.log(action.payload)
            state.cards[action.payload.id]=action.payload.data
        },
        addCard:(state,action)=>{
            state.cards[action.payload.id].push(action.payload.data)
        },
        deleteCard:(state,action)=>{
            state.cards[action.payload.id]=state.cards[action.payload.id].filter(sl=>sl.id!=action.payload.data)
        },
    }
})

export default cardSlice.reducer
export const { displayCards, addCard, deleteCard }=cardSlice.actions