import { configureStore } from "@reduxjs/toolkit";
import boardReducer from './boards'
import listReducer from './lists'
import checkListReducer from './checkLists'
import cardReducer from './cardItems'
import checkItemReducer from './checkItems'

const store=configureStore({
    reducer:{
        board:boardReducer,
        list:listReducer,
        checkList:checkListReducer,
        card:cardReducer,
        checkItem:checkItemReducer,
    },
})

export default store