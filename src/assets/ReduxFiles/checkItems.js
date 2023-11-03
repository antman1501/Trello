import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiKey=import.meta.env.VITE_API_KEY
const token=import.meta.env.VITE_TOKEN

const initialState={
    checkItems:{},
    checkItem:[],
    currentProgress:{},
    totalProgress:{}
}

// export const updateCheckItems=createAsyncThunk('user/updateCheckItem',(payload)=>{
//     return axios.post(`https://api.trello.com/1/cards/${action.payload.cardId}/checklist/${action.payload.listId}/checkItem/${action.payload.checkItemId}?key=${apiKey}&token=${token}&state=${action.payload.bool}`)
//         .then(response=>console.log(response.data))
// })

const checkItemSlice=createSlice({
    name:'checkItem',
    initialState,
    reducers:{
        displayCheckItems:(state,action)=>{
            state.checkItems[action.payload.id]=action.payload.data
            state.currentProgress[action.payload.id]=action.payload.data.reduce((acc,curr)=>{
                if(curr.state=='complete'){
                    return acc+=1;
                }
                else{
                    return acc;
                }
            },0)
            state.totalProgress[action.payload.id]=Math.max(action.payload.data.length,1)
        },
        addCheckItem:(state,action)=>{
            state.checkItems[action.payload.id].push(action.payload.data)
            state.totalProgress[action.payload.id]+=1
            //state.checkItem=''
        },
        increaseTotalProgress:(state,action)=>{
            state.totalProgress[action.payload.id]+=1
        },
        deleteCheckItem:(state,action)=>{
            state.currentProgress[action.payload.id]=(action.payload.data.state=='complete'?Math.max(state.currentProgress[action.payload.id]-1,0):state.currentProgress[action.payload.id])
            state.checkItems[action.payload.id]=state.checkItems[action.payload.id].filter(sl=>sl.id!=action.payload.data.id)
            state.totalProgress[action.payload.id]-=(state.totalProgress[action.payload.id]==0?0:1)
        },
        decreaseTotalProgress:(state,action)=>{
            //console.log(action)
            state.totalProgress[action.payload.id]-=(state.totalProgress[action.payload.id]==0?0:1)
        },
        uncheckedCurrentProgress:(state,action)=>{
            state.checkItems[action.payload.id].forEach((c)=>{
                if(c.id==action.payload.data){
                    c.state='incomplete'
                }
            })
            state.currentProgress[action.payload.id]-=(state.currentProgress[action.payload.id]==0?0:1)
        },
        checkedCurrentProgress:(state,action)=>{
            state.checkItems[action.payload.id].forEach((c)=>{
                if(c.id==action.payload.data){
                    c.state='complete'
                }
            })
            state.currentProgress[action.payload.id]+=1
        },
        decreaseCurrentProgress:(state,action)=>{
            state.currentProgress[action.payload.id]-=(state.currentProgress[action.payload.id]==0?0:1)
        }
        // createCheckItemName:(state,action)=>{
        //     state.checkItem=action.payload
        // }
    },
    // extraReducers:(builder)=>{
    //     builder.addCase(updateCheckItems.fulfilled,(state,action)=>{
    //         state.checkItems[action.payload.listId][action.payload.checkItemId].state=action.payload.bool
    //     })
    // }
})

export default checkItemSlice.reducer
export const { displayCheckItems, addCheckItem, deleteCheckItem, checkedCurrentProgress, uncheckedCurrentProgress, increaseTotalProgress, decreaseCurrentProgress, decreaseTotalProgress }=checkItemSlice.actions