import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICountSlice {
    emptyCount: number, 
    totalCount: number, 
    fullCount: number
}

const initialState: ICountSlice = {
    emptyCount: 0,
    totalCount: 0,
    fullCount: 0
}

export const countSlice = createSlice({
    name: 'count',
    initialState,
    reducers: {
        setCount: (state: ICountSlice, action: PayloadAction<ICountSlice>) => {
            state.emptyCount = action.payload.emptyCount
            state.totalCount = action.payload.totalCount
            state.fullCount = action.payload.fullCount
        }
    }
})

export const {setCount} = countSlice.actions

export default countSlice.reducer